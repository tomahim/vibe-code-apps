"""Long-polling Telegram bot for the Etchebest recipe API."""

from __future__ import annotations

import asyncio
import json
import logging
import os
import re

import httpx
from telegram import BotCommand, Update
from telegram.error import TelegramError
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    ConversationHandler,
    MessageHandler,
    filters,
)

logger = logging.getLogger("recipe_bot")

API_BASE_URL = os.environ.get("API_BASE_URL", "http://api.railway.internal:8000").rstrip("/")
API_TIMEOUT_SECONDS = 20
MAX_IMAGE_BYTES = 5 * 1024 * 1024
TITLE, INGREDIENTS, SOURCE, PHOTO = range(4)
CAPTION_LIMIT = 1024  # Telegram's photo caption limit
MAX_LIST_PHOTOS = 10  # keep /list under Telegram's per-chat rate limits
WAKEUP_ATTEMPTS = 3  # cold-starting a sleeping serverless API can outlast one request
WAKEUP_TIMEOUT_SECONDS = 30
WAKEUP_RETRY_DELAY_SECONDS = 5


def required_settings() -> tuple[str, str, set[int]]:
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    secret = os.environ.get("BOT_API_SECRET", "").strip()
    raw_user_ids = os.environ.get("ALLOWED_TELEGRAM_USER_IDS", "").strip()
    if not token or not secret or not raw_user_ids:
        raise RuntimeError(
            "Set TELEGRAM_BOT_TOKEN, BOT_API_SECRET, and ALLOWED_TELEGRAM_USER_IDS before starting the bot."
        )
    try:
        user_ids = {int(value.strip()) for value in raw_user_ids.split(",") if value.strip()}
    except ValueError as exc:
        raise RuntimeError("ALLOWED_TELEGRAM_USER_IDS must be comma-separated numeric Telegram user IDs.") from exc
    if not user_ids:
        raise RuntimeError("ALLOWED_TELEGRAM_USER_IDS must contain at least one Telegram user ID.")
    return token, secret, user_ids


def authorized(update: Update, user_ids: set[int]) -> bool:
    user = update.effective_user
    return user is not None and user.id in user_ids


async def require_authorized(update: Update, context: ContextTypes.DEFAULT_TYPE) -> bool:
    user_ids: set[int] = context.application.bot_data["allowed_user_ids"]
    if authorized(update, user_ids):
        return True
    if update.effective_message:
        await update.effective_message.reply_text("Sorry, this bot is private.")
    return False


def api_client(context: ContextTypes.DEFAULT_TYPE) -> httpx.AsyncClient:
    return context.application.bot_data["api_client"]


async def recipe_api_error(response: httpx.Response) -> str:
    try:
        payload = response.json()
    except ValueError:
        return f"The recipe API returned HTTP {response.status_code}."
    detail = payload.get("error")
    errors = payload.get("errors")
    if detail:
        return str(detail)
    if errors:
        return "The recipe was rejected: " + json.dumps(errors, ensure_ascii=False)
    return f"The recipe API returned HTTP {response.status_code}."


async def api_get(context: ContextTypes.DEFAULT_TYPE, path: str, ingredients: str = "") -> dict:
    params = {"ingredients": ingredients} if ingredients else None
    response = await api_client(context).get(f"{API_BASE_URL}{path}", params=params)
    response.raise_for_status()
    return response.json()


async def api_create(
    context: ContextTypes.DEFAULT_TYPE,
    data: dict,
    image: tuple[str, bytes, str] | None = None,
) -> httpx.Response:
    headers = {"X-Bot-Token": context.application.bot_data["api_secret"]}
    endpoint = f"{API_BASE_URL}/api/apps/recipes/recipes/"
    if image is None:
        return await api_client(context).post(endpoint, json=data, headers=headers)
    filename, content, content_type = image
    files = {"image": (filename, content, content_type)}
    form = {
        "title": data["title"],
        "source_url": data.get("source_url", ""),
        "ingredients": json.dumps(data["ingredients"], ensure_ascii=False),
    }
    return await api_client(context).post(endpoint, data=form, files=files, headers=headers)


def parse_ingredients(text: str) -> list[dict[str, str]]:
    """Parse comma/newline separated ingredients, optionally as name: quantity."""
    entries = [part.strip() for part in re.split(r"[,\n]", text) if part.strip()]
    ingredients = []
    for entry in entries:
        if ":" in entry:
            name, quantity = entry.split(":", 1)
        else:
            name, quantity = entry, ""
        ingredients.append({"name": name.strip(), "quantity": quantity.strip()})
    if not ingredients or any(not item["name"] for item in ingredients):
        raise ValueError("Enter at least one ingredient, one per line or separated by commas.")
    if len(ingredients) > 100:
        raise ValueError("Please enter no more than 100 ingredients.")
    return ingredients


def format_recipe(recipe: dict) -> str:
    lines = [recipe.get("title", "Untitled recipe")]
    ingredients = recipe.get("ingredients", [])
    if ingredients:
        lines.append("\n".join(
            f"• {item['quantity']} {item['name']}".strip() for item in ingredients
        ))
    if recipe.get("source_url"):
        lines.append(recipe["source_url"])
    return "\n".join(lines)


async def fetch_image(context: ContextTypes.DEFAULT_TYPE, url: str) -> bytes | None:
    """Download a recipe image so Telegram never has to reach our URL itself.

    Returns None when the image can't be fetched, so callers fall back to text.
    """
    try:
        async with api_client(context).stream("GET", url, headers={"Accept": "image/*"}, follow_redirects=True) as response:
            response.raise_for_status()
            content = bytearray()
            async for chunk in response.aiter_bytes():
                content.extend(chunk)
                if len(content) > MAX_IMAGE_BYTES:
                    logger.warning("Recipe image over %d bytes, sending text only", MAX_IMAGE_BYTES)
                    return None
            return bytes(content) or None
    except httpx.HTTPError:
        logger.warning("Could not fetch recipe image, sending text only", exc_info=True)
        return None


async def reply_recipe(update: Update, context: ContextTypes.DEFAULT_TYPE, recipe: dict) -> bool:
    """Send one recipe, as a photo with caption when it has a reachable image.

    Returns True when a photo was sent.
    """
    message = update.effective_message
    text = format_recipe(recipe)
    image_url = recipe.get("image_url")
    if image_url:
        content = await fetch_image(context, image_url)
        if content:
            try:
                if len(text) <= CAPTION_LIMIT:
                    await message.reply_photo(photo=content, caption=text)
                else:
                    await message.reply_photo(photo=content, caption=recipe.get("title", "")[:CAPTION_LIMIT])
                    await message.reply_text(text[:4000])
                return True
            except TelegramError:
                logger.warning("Telegram rejected the recipe image, sending text only", exc_info=True)
    await message.reply_text(text[:4000])
    return False


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await require_authorized(update, context):
        return
    await update.effective_message.reply_text(
        "Recipe bot ready. Use /add, /list [ingredient, ingredient], /random [ingredient, ingredient], or /help."
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await require_authorized(update, context):
        return
    await update.effective_message.reply_text(
        "Commands:\n"
        "/add — save a recipe through a short conversation; add a photo or skip it.\n"
        "/list [ingredient, ingredient] — list recipes, optionally requiring all ingredients.\n"
        "/random [ingredient, ingredient] — pick a random recipe, optionally filtered.\n"
        "/wakeup — wake the sleeping API and confirm it is up.\n"
        "/cancel — stop adding a recipe.\n\n"
        "During /add, enter ingredients separated by commas or new lines. Add a quantity as "
        "ingredient: quantity, for example tomato: 200 g, pasta: 150 g."
    )


async def add_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    if not await require_authorized(update, context):
        return ConversationHandler.END
    # Wake the serverless API in the background so it cold-starts while the
    # user types the recipe instead of when the bot saves it.
    context.application.create_task(warm_up_api(context), update=update)
    context.user_data["new_recipe"] = {}
    await update.effective_message.reply_text("What is the recipe title? Send /cancel to stop.")
    return TITLE


async def receive_title(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    title = update.effective_message.text.strip()
    if not title:
        await update.effective_message.reply_text("Please send a title, or /cancel.")
        return TITLE
    context.user_data["new_recipe"]["title"] = title
    await update.effective_message.reply_text(
        "Send ingredients separated by commas or new lines. Add quantities as "
        "ingredient: quantity (for example tomato: 200 g, pasta: 150 g)."
    )
    return INGREDIENTS


async def receive_ingredients(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    try:
        context.user_data["new_recipe"]["ingredients"] = parse_ingredients(update.effective_message.text)
    except ValueError as exc:
        await update.effective_message.reply_text(str(exc))
        return INGREDIENTS
    await update.effective_message.reply_text("Send the source URL, or /skip.")
    return SOURCE


async def receive_source(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["new_recipe"]["source_url"] = update.effective_message.text.strip()
    await update.effective_message.reply_text("Send a recipe photo, or /skip.")
    return PHOTO


async def skip_source(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["new_recipe"]["source_url"] = ""
    await update.effective_message.reply_text("Send a recipe photo, or /skip.")
    return PHOTO


async def save_recipe(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE,
    image: tuple[str, bytes, str] | None = None,
) -> int:
    message = update.effective_message
    recipe = context.user_data.get("new_recipe", {})
    try:
        response = await api_create(context, recipe, image)
        if response.status_code != 201:
            await message.reply_text(await recipe_api_error(response))
            return ConversationHandler.END
        created = response.json()
        await message.reply_text(f"Saved recipe #{created['id']}: {created['title']}")
    except httpx.RequestError:
        logger.exception("Recipe API request failed")
        await message.reply_text("I couldn't reach the recipe API. Please try again later.")
    except httpx.HTTPError:
        logger.exception("Recipe API returned an unsuccessful response")
        await message.reply_text("The recipe API is temporarily unavailable.")
    finally:
        context.user_data.pop("new_recipe", None)
    return ConversationHandler.END


async def receive_photo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    photo = update.effective_message.photo[-1]
    telegram_file = await photo.get_file()
    if telegram_file.file_size and telegram_file.file_size > MAX_IMAGE_BYTES:
        await update.effective_message.reply_text("That image is over the 5 MB upload limit. Send a smaller one or /skip.")
        return PHOTO
    content = bytes(await telegram_file.download_as_bytearray())
    if len(content) > MAX_IMAGE_BYTES:
        await update.effective_message.reply_text("That image is over the 5 MB upload limit. Send a smaller one or /skip.")
        return PHOTO
    return await save_recipe(update, context, ("recipe.jpg", content, "image/jpeg"))


async def skip_photo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    return await save_recipe(update, context)


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    if not await require_authorized(update, context):
        return ConversationHandler.END
    context.user_data.pop("new_recipe", None)
    await update.effective_message.reply_text("Recipe entry cancelled.")
    return ConversationHandler.END


async def list_recipes(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await require_authorized(update, context):
        return
    ingredients = " ".join(context.args).strip()
    try:
        result = await api_get(context, "/api/apps/recipes/recipes/", ingredients)
    except (httpx.RequestError, httpx.HTTPError):
        logger.exception("Recipe list request failed")
        await update.effective_message.reply_text("I couldn't reach the recipe API. Please try again later.")
        return
    recipes = result.get("recipes", [])
    if not recipes:
        await update.effective_message.reply_text("No matching recipes found.")
        return
    # Recipes with an image go out as photos (first MAX_LIST_PHOTOS only); the rest
    # are grouped into text messages. Order is kept by flushing text before a photo.
    pending: list[str] = []

    async def flush_text() -> None:
        current = ""
        for block in pending:
            block = block[:3900]
            addition = f"\n\n{block}" if current else block
            if current and len(current) + len(addition) > 3900:
                await update.effective_message.reply_text(current)
                current = block
            else:
                current += addition
        if current:
            await update.effective_message.reply_text(current)
        pending.clear()

    photos_sent = 0
    for recipe in recipes:
        if recipe.get("image_url") and photos_sent < MAX_LIST_PHOTOS:
            await flush_text()
            if await reply_recipe(update, context, recipe):
                photos_sent += 1
            continue
        pending.append(format_recipe(recipe))
    await flush_text()


async def random_recipe(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await require_authorized(update, context):
        return
    ingredients = " ".join(context.args).strip()
    try:
        result = await api_get(context, "/api/apps/recipes/random/", ingredients)
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 404:
            await update.effective_message.reply_text("No matching recipes found.")
            return
        logger.exception("Random recipe request failed")
        await update.effective_message.reply_text("The recipe API is temporarily unavailable.")
        return
    except httpx.RequestError:
        logger.exception("Random recipe request failed")
        await update.effective_message.reply_text("I couldn't reach the recipe API. Please try again later.")
        return
    await reply_recipe(update, context, result)


async def ping_api(context: ContextTypes.DEFAULT_TYPE) -> bool:
    """Ping the API health endpoint once; True only when the API is actually up."""
    try:
        response = await api_client(context).get(f"{API_BASE_URL}/health/", timeout=WAKEUP_TIMEOUT_SECONDS)
        return response.status_code == 200 and response.json().get("status") == "ok"
    except (httpx.RequestError, ValueError):
        return False


async def warm_up_api(context: ContextTypes.DEFAULT_TYPE) -> None:
    """Background warm-up ping so a sleeping API cold-starts while the user types.

    Fire-and-forget: the result never blocks the conversation; failures only log.
    """
    if await ping_api(context):
        logger.info("API warm-up ping succeeded")
    else:
        logger.info("API warm-up ping did not succeed yet; the request on save may wait out the cold start")


async def wakeup(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Ping the API health endpoint and confirm only once it is actually up.

    The API is serverless and sleeps when idle, so a first ping can time out
    while the service cold-starts; retry a few times before giving up.
    """
    if not await require_authorized(update, context):
        return
    message = update.effective_message
    for attempt in range(1, WAKEUP_ATTEMPTS + 1):
        if await ping_api(context):
            await message.reply_text("Hello ! I am awake, what can I do for you ?")
            return
        logger.warning("Wakeup ping attempt %d failed", attempt)
        if attempt < WAKEUP_ATTEMPTS:
            await asyncio.sleep(WAKEUP_RETRY_DELAY_SECONDS)
    await message.reply_text("The API is still waking up. Please try /wakeup again in a moment.")


async def post_init(application: Application) -> None:
    _, secret, user_ids = required_settings()
    application.bot_data["api_secret"] = secret
    application.bot_data["allowed_user_ids"] = user_ids
    application.bot_data["api_client"] = httpx.AsyncClient(
        timeout=API_TIMEOUT_SECONDS,
        headers={"Accept": "application/json"},
    )
    await application.bot.set_my_commands([
        BotCommand("add", "Add a recipe"),
        BotCommand("wakeup", "Wake the API and confirm it is up"),
        BotCommand("list", "List recipes, optionally by ingredients"),
        BotCommand("random", "Pick a random recipe"),
        BotCommand("cancel", "Cancel recipe entry"),
        BotCommand("help", "Show available commands"),
    ])
    logger.info("Recipe bot started with %d allowed Telegram user(s)", len(user_ids))


async def post_shutdown(application: Application) -> None:
    client = application.bot_data.get("api_client")
    if client:
        await client.aclose()


def main() -> None:
    token, _, user_ids = required_settings()
    application = (
        Application.builder()
        .token(token)
        .post_init(post_init)
        .post_shutdown(post_shutdown)
        .build()
    )
    application.bot_data["allowed_user_ids"] = user_ids
    conversation = ConversationHandler(
        entry_points=[CommandHandler("add", add_start)],
        states={
            TITLE: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_title)],
            INGREDIENTS: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_ingredients)],
            SOURCE: [
                CommandHandler("skip", skip_source),
                MessageHandler(filters.TEXT & ~filters.COMMAND, receive_source),
            ],
            PHOTO: [
                CommandHandler("skip", skip_photo),
                MessageHandler(filters.PHOTO, receive_photo),
            ],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
        allow_reentry=True,
        per_chat=True,
        per_user=True,
    )
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(conversation)
    application.add_handler(CommandHandler("list", list_recipes))
    application.add_handler(CommandHandler("random", random_recipe))
    application.add_handler(CommandHandler("wakeup", wakeup))
    application.add_handler(CommandHandler("cancel", cancel))
    logger.info("Starting Telegram long polling")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    logging.basicConfig(
        level=os.environ.get("LOG_LEVEL", "INFO").upper(),
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    main()

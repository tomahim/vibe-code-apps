# Telegram recipe bot

This is a long-polling worker for the Django recipe API. It has no inbound
HTTP listener, public domain, database, volume, or Tailscale dependency. Keep
the bot and API in the same Railway project and environment; the bot calls the
API over http://api.railway.internal:8000.

## Railway setup

Terraform creates a bot service from this repository with /bot as its root
directory. Set these variables on that service in Railway:

- TELEGRAM_BOT_TOKEN: token from BotFather.
- BOT_API_SECRET: a new random secret shared with the API service.
- ALLOWED_TELEGRAM_USER_IDS: comma-separated numeric Telegram user IDs that
  may use the bot. This is required; the bot rejects everyone else. You can
  retrieve your numeric ID by messaging a trusted ID lookup bot in Telegram.
- API_BASE_URL: http://api.railway.internal:8000 (Terraform sets this).

Set the same BOT_API_SECRET on the Railway api service. Use a generated
random value and keep it out of Terraform files, Git, logs, and chat. The
Terraform config intentionally leaves credentials for manual entry so they
are not stored in Terraform state. Once the variables are saved, Railway
deploys the bot and it starts polling Telegram. Keep it at one replica.

## Stop the bot overnight

After Terraform has created the bot service, deploy the Railway marketplace
[Starter Stopper template](https://railway.com/template/starter-stopper-1)
into this project. It creates separate scheduled start and stop functions.
The template is currently marked unverified in Railway's marketplace.

Set TARGET_SERVICE_ID to the new bot service ID, TARGET_ENVIRONMENT_ID to the
production environment ID, and RAILWAY_PROJECT_TOKEN to a project token scoped
to production. Keep the token in Railway variables, not in this repository or
Terraform state.

Railway cron schedules use UTC, while the requested 23:00–07:00 schedule is
Europe/Paris local time. Set the two template schedules to:

- Winter (CET): start at 06:00 UTC and stop at 22:00 UTC.
- Summer (CEST): start at 05:00 UTC and stop at 21:00 UTC.

Change the schedules when Paris switches between CET and CEST. Railway may
start a scheduled run a few minutes after its nominal time.

## Commands

- /add asks for a title, ingredients, optional source URL, and optional photo.
  Use /skip for the source or photo, and /cancel to discard the draft.
- /list shows all recipes. /list tomato, pasta filters to recipes containing
  both ingredients.
- /random returns one recipe. /random tomato, pasta filters first.
- /help shows the command list and ingredient syntax.

Ingredients can be comma or newline separated. Add optional quantities with
name: quantity, for example tomato: 200 g, pasta: 150 g. Photos are uploaded
as bytes to the API (up to 5 MB); the bot does not store image URLs.

The bot needs outbound HTTPS to Telegram and private-network access to the API.
Long polling runs continuously, so do not use Railway's cron schedule for this
service. There is deliberately one replica to avoid two pollers consuming the
same bot updates.

"""Same-origin delivery of published card illustrations from the media bucket."""
from django.core.files.storage import default_storage
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.views.decorators.http import require_GET

from .models import Card


def image_url(row):
    """Root-relative illustration URL for a card; other kinds carry no artwork."""
    if not isinstance(row, Card) or not row.illustration_path:
        return ""
    return reverse("learning-image", kwargs={"kind": row.CONTENT_KIND, "content_id": row.pk})


def illustration_srcset(card):
    """Width-described variant URLs for a card with processed WebP variants."""
    variants = card.illustration_variants
    if not isinstance(variants, dict) or not variants:
        return []
    base = reverse("learning-image", kwargs={"kind": card.CONTENT_KIND, "content_id": card.pk})
    return [
        {"url": f"{base}?w={width}", "width": int(width)}
        for width in sorted(variants, key=int)
    ]


# Redirects must be re-requested well before the bucket's signed URLs expire
# (genious-media is private; AWS_QUERYSTRING_EXPIRE defaults to one hour).
REDIRECT_CACHE_SECONDS = 3000
# Never cache a redirect closer than this to the signature's expiry.
SIGNED_URL_EXPIRY_MARGIN_SECONDS = 600


def variant_redirect(request, card):
    """Cards with processed WebP variants get a fresh signed bucket URL (#195).

    The bucket stays private: each request mints a short-lived presigned URL
    and the redirect itself is cacheable only for less than that lifetime, so
    no stale signature ever ships. Anything odd means the illustration is not
    served at all (404): missing artwork must stay visible, never proxied
    from somewhere else.
    """
    variants = card.illustration_variants
    if not isinstance(variants, dict) or not variants:
        return None
    prefix = f"learning/{card.pk}/"
    candidates = [variants.get(request.GET.get("w", "")), variants.get("640")]
    candidates += [variants[width] for width in sorted(variants, key=int)]
    key = next((c for c in candidates if isinstance(c, str) and c.startswith(prefix)), None)
    if key is None:
        return None
    expire = int(getattr(default_storage, "querystring_expire", 3600) or 3600)
    max_age = min(REDIRECT_CACHE_SECONDS, expire - SIGNED_URL_EXPIRY_MARGIN_SECONDS)
    if max_age < 60:
        return None  # signatures too short-lived to redirect safely
    try:
        signed = default_storage.url(key)
    except Exception:
        return None
    response = HttpResponseRedirect(signed)
    response["Cache-Control"] = f"public, max-age={max_age}"
    return response


@require_GET
def content_image(request, kind, content_id):
    """Redirect to a published card's processed illustration on the media bucket.

    Only cards carry artwork (#195), stored as WebP variants on the private
    media bucket before the sync's database transaction. Other kinds, unknown
    rows and cards without processed variants return 404, so missing artwork
    is visible instead of silently served from another source.
    """
    from .api import visible

    if kind != Card.CONTENT_KIND:
        raise Http404
    card = get_object_or_404(visible(Card), pk=content_id)
    redirect = variant_redirect(request, card)
    if redirect is None:
        raise Http404
    return redirect

"""Seed the weekly Challenge (Thomas, 2026-11-09).

Replaces the earlier env-variable proposal: the duel's players live in the
lg_challenge_player table, and this command is the way to seat them:

    python manage.py seed_challenge_players thomas aurore

It also flags the general-knowledge paths the weekly draw picks from - the
two English paths and the baby development path, and nothing else (Thomas,
2026-11-09: "only 3 paths for now"). The same paths carry
`general_knowledge: true` in their content front matter, so content syncs
keep the flags; this command just applies them to the database right away.

Idempotent: re-running seats the same duo and keeps the same three flags.
Fails before writing anything when a handle or a path slug does not resolve
to exactly one row.
"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import models, transaction

from apps.learning.models import ChallengePlayer, LearningPath

GENERAL_KNOWLEDGE_PATHS = [
    "language/600-words-for-little-english-talkers",
    "language/early-childhood-english",
    "life-and-society/baby-first-year-science",
]


def resolve_user(handle):
    matches = get_user_model().objects.filter(models.Q(username=handle) | models.Q(email=handle))
    if matches.count() != 1:
        raise CommandError(f"{handle!r} matches {matches.count()} accounts, expected exactly one.")
    return matches.get()


class Command(BaseCommand):
    help = "Seat the two Challenge players and flag the 3 general-knowledge paths."

    def add_arguments(self, parser):
        parser.add_argument("players", nargs=2, help="The two players, by username or email.")

    @transaction.atomic
    def handle(self, *args, **options):
        players = [resolve_user(handle.strip()) for handle in options["players"]]
        if players[0].pk == players[1].pk:
            raise CommandError("Both handles resolve to the same account; the duel needs two distinct players.")

        ChallengePlayer.objects.all().delete()
        ChallengePlayer.objects.bulk_create([ChallengePlayer(user=player) for player in players])
        for player in players:
            self.stdout.write(f"Seated {player.username} ({player.email}).")

        for slug in GENERAL_KNOWLEDGE_PATHS:
            paths = LearningPath.objects.filter(source_path__endswith=f"{slug}/index.md")
            if paths.count() != 1:
                raise CommandError(f"{slug!r} matches {paths.count()} learning paths, expected exactly one.")
            path = paths.get()
            if not path.general_knowledge:
                path.general_knowledge = True
                path.save(update_fields=["general_knowledge"])
            self.stdout.write(f"General knowledge: {path.title}.")
        self.stdout.write(self.style.SUCCESS("Challenge seeded: 2 players, 3 general-knowledge paths."))

"""Feature flags are retired from vibe-code-apps.

The model is gone and migration 0002 drops the tables. The app stays
installed as an empty shell so the migration history (0001 creates, 0002
deletes) replays cleanly on every database; it carries no models, views,
decorators, or admin.
"""

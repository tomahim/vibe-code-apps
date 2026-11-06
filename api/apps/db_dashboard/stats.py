"""Read-only PostgreSQL size and activity statistics for the dashboard.

Only catalog metadata and row counts are read. No table contents leave the
database, and every query runs inside a READ ONLY transaction.
"""

from django.apps import apps as django_apps
from django.db import connection, transaction

# Exact COUNT(*) is cheap on a small database. Past this many estimated rows
# the dashboard falls back to the planner's estimate instead of scanning.
EXACT_COUNT_ROW_LIMIT = 2_000_000

APP_LABELS = {
    "auth": "Accounts",
    "accounts": "Accounts",
    "admin": "Django admin",
    "contenttypes": "Django core",
    "sessions": "Django core",
    "curator": "Little notes",
    "hockey": "Hockey Lab",
    "learning": "Little Grains",
    "little_grains": "Little Grains",
    "recipes": "Etchebest",
    "livetrail_scrap": "LiveTrail",
    "rust_learning_path": "Rust path",
}

TABLES_SQL = """
SELECT c.relname,
       pg_total_relation_size(c.oid),
       pg_relation_size(c.oid),
       pg_indexes_size(c.oid),
       COALESCE(pg_total_relation_size(NULLIF(c.reltoastrelid, 0)), 0),
       GREATEST(c.reltuples, 0)::bigint,
       COALESCE(s.n_live_tup, 0),
       COALESCE(s.n_dead_tup, 0),
       COALESCE(s.seq_scan, 0),
       COALESCE(s.idx_scan, 0),
       COALESCE(s.n_tup_ins, 0),
       COALESCE(s.n_tup_upd, 0),
       COALESCE(s.n_tup_del, 0),
       GREATEST(s.last_vacuum, s.last_autovacuum),
       GREATEST(s.last_analyze, s.last_autoanalyze)
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_stat_all_tables s ON s.relid = c.oid
WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
"""

INDEXES_SQL = """
SELECT s.relname, s.indexrelname, pg_relation_size(s.indexrelid),
       COALESCE(s.idx_scan, 0), i.indisunique, i.indisprimary
FROM pg_stat_all_indexes s
JOIN pg_index i ON i.indexrelid = s.indexrelid
WHERE s.schemaname = 'public'
"""

DATABASE_SQL = """
SELECT current_database(), pg_database_size(current_database()),
       current_setting('server_version'), pg_postmaster_start_time(),
       COALESCE(d.numbackends, 0), COALESCE(d.xact_commit, 0), COALESCE(d.xact_rollback, 0),
       COALESCE(d.blks_hit, 0), COALESCE(d.blks_read, 0), COALESCE(d.deadlocks, 0),
       COALESCE(d.temp_bytes, 0), d.stats_reset
FROM pg_stat_database d WHERE d.datname = current_database()
"""


def table_groups():
    """Map table name -> friendly group, from Django's own model registry."""
    mapping = {"django_migrations": "Django core"}  # not a registered model
    for model in django_apps.get_models(include_auto_created=True):
        label = model._meta.app_label
        mapping[model._meta.db_table] = APP_LABELS.get(label, label.replace("_", " ").title())
    return mapping


def iso(value):
    return value.isoformat() if value else None


def collect():
    """Return the full overview payload. Requires PostgreSQL."""
    groups = table_groups()
    with transaction.atomic():
        with connection.cursor() as cursor:
            cursor.execute("SET TRANSACTION READ ONLY")
            cursor.execute(DATABASE_SQL)
            db = cursor.fetchone()
            cursor.execute(TABLES_SQL)
            table_rows = cursor.fetchall()
            cursor.execute(INDEXES_SQL)
            index_rows = cursor.fetchall()

            tables = []
            for (name, total, heap, idx, toast, estimate, live, dead, seq, idx_scan,
                 ins, upd, dele, vacuumed, analyzed) in table_rows:
                rows, exact = max(estimate, live), False
                if rows <= EXACT_COUNT_ROW_LIMIT:
                    cursor.execute(f"SELECT count(*) FROM {connection.ops.quote_name(name)}")
                    rows, exact = cursor.fetchone()[0], True
                tables.append({
                    "name": name,
                    "group": groups.get(name, "Other"),
                    "total_bytes": total,
                    "table_bytes": heap,
                    "index_bytes": idx,
                    "toast_bytes": toast,
                    "rows": rows,
                    "rows_exact": exact,
                    "dead_rows": dead,
                    "seq_scans": seq,
                    "index_scans": idx_scan,
                    "inserts": ins,
                    "updates": upd,
                    "deletes": dele,
                    "last_vacuum": iso(vacuumed),
                    "last_analyze": iso(analyzed),
                })

    tables.sort(key=lambda t: (-t["total_bytes"], t["name"]))
    by_table = {}
    indexes = []
    for table, name, size, scans, unique, primary in index_rows:
        by_table[table] = by_table.get(table, 0) + 1
        indexes.append({
            "table": table, "name": name, "bytes": size, "scans": scans,
            "unique": unique, "primary": primary,
        })
    indexes.sort(key=lambda i: (-i["bytes"], i["name"]))
    for table in tables:
        table["index_count"] = by_table.get(table["name"], 0)

    hits, reads = db[7], db[8]
    relation_bytes = sum(t["total_bytes"] for t in tables)
    return {
        "database": {
            "name": db[0],
            "size_bytes": db[1],
            "version": db[2],
            "server_started_at": iso(db[3]),
            "connections": db[4],
            "commits": db[5],
            "rollbacks": db[6],
            "cache_hit_ratio": round(hits / (hits + reads), 4) if hits + reads else None,
            "deadlocks": db[9],
            "temp_bytes": db[10],
            "stats_reset_at": iso(db[11]),
        },
        "tables": tables,
        "indexes": indexes,
        "groups": summarise_groups(tables),
        "totals": {
            "tables": len(tables),
            "indexes": len(indexes),
            "rows": sum(t["rows"] for t in tables),
            "table_bytes": sum(t["table_bytes"] for t in tables),
            "index_bytes": sum(t["index_bytes"] for t in tables),
            "toast_bytes": sum(t["toast_bytes"] for t in tables),
            "relation_bytes": relation_bytes,
            # Catalogs, other schemas and WAL-independent overhead outside the public tables.
            "system_bytes": max(db[1] - relation_bytes, 0),
        },
    }


def summarise_groups(tables):
    groups = {}
    for table in tables:
        group = groups.setdefault(table["group"], {
            "name": table["group"], "tables": 0, "rows": 0, "bytes": 0,
            "table_bytes": 0, "index_bytes": 0, "toast_bytes": 0,
        })
        group["tables"] += 1
        group["rows"] += table["rows"]
        group["bytes"] += table["total_bytes"]
        for key in ("table_bytes", "index_bytes", "toast_bytes"):
            group[key] += table.get(key, 0)
    return sorted(groups.values(), key=lambda g: (-g["bytes"], g["name"]))

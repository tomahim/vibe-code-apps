# Hockey stats app - data model proposal (REVIEW ONLY)

National League only. This PR is the data-model review vehicle: it adds the
`apps.hockey` Django app with models + initial migration and this document.
No ingestion, no API, no UI yet. Do not merge without Thomas's explicit OK.

## What the app will do (from Thomas's voice notes, 2026-11-04)

- After each finished NL match, collect official results and stats for every
  player in the league, plus Hockey Manager points and prices.
- Players by team with a team filter; beautiful charts; multi-select players
  and overlay their week-by-week evolution; history from the start of the
  current season (2026/27).
- HM values, price history and evolution to judge transfers.
- Each user (Thomas, Aurore) can register several of their own fantasy teams,
  see their value, and run what-if transfer simulations. Teams stay private
  to their owner.
- Team logos and player photos from external sources (hotlinked with source +
  attribution, e.g. Wikipedia), not necessarily self-hosted.

## Verified source contract (checked live 2026-11-04, 22:03-22:11 CET)

| Source | What it gives | Verified | Constraints |
| --- | --- | --- | --- |
| `data.sihf.ch` (official SIHF stats) | Current-season player tables (updated same day), results, per-game box scores + play-by-play with licence numbers, seasons back to 2009/10. Keyless JSON, CSV/PDF export offered by the site. | Results through Nov 1 (LHC 3-2 HCD, Oct 31); box score of game `20271105000132`; player table updated 2026-11-04 | Terms of use not found - reuse posture unresolved. Proposal: polite daily sync + caching, no aggressive polling, revisit if terms surface. |
| `nationalleague.ch/api` (official league app API) | Richer per-player fields (TOI splits etc.), player photos at `/api/player/{id}/image` | Live responses verified | `robots.txt` disallows `/api` - NO automated ingestion (photos included). Manual spot checks only. |
| `hockeymanager.ch` (login) | Full priced league list (`/fr/stats/top-scorer`: price, points, avg, position + nationality filters); player detail lightbox with price history and per-appearance points | Bounded one-time read 22:06-22:07 | Infrequent reads only (standing rule). HM corrects stats retroactively (a player's totals moved Nov 1 -> Nov 4 with no new games). |

### Player identity - verified with a paired live sample

The SIHF licence number = nationalleague.ch API `playerId` = Hockey Manager's
`nlid` attribute. Proof: Denis Malgin is `155486` in HM's markup, in the NL
API (`/api/player/155486`), and in the SIHF box score of Kloten-ZSC
(`20271105000130`, Oct 31, where he appears as ZSC center with an assist).
HM additionally has its own small internal id (Malgin 223, Järventie 728) -
stored as `hm_id`.

### Known data caveats (designed into the model)

- HM price history exists (e.g. Järventie 10.5 -> 12 -> 13.5 -> 15) but the
  x-axis is ORDINAL (value-change #1..4), not dated. `HMPriceEvent` keeps the
  ordinal series and leaves `event_date` null until the mapping to the
  published repricing calendar is verified (`date_verified` flag).
- HM per-appearance points are also ordinal ("last games", no dates).
  `HMGamePoints.game` stays null until an appearance is matched to an
  official game with real evidence (`join_verified`) - never by order alone
  (DNP, transfers, retroactive corrections).
- HM evolution from the app's launch is captured by `HMSnapshot`
  (full-league price/points per date). No retrospective price fabrication.
- Images: URL + source + attribution fields stay EMPTY when no grounded,
  appropriately-licensed image exists. League photos are copyrighted;
  Wikimedia Commons is free-licensed but NL coverage is spotty. No local
  copies. Fallback: generated avatar (initials + number + team colours).

## Tables (15)

League facts (shared): `hockey_team`, `hockey_player`,
`hockey_player_team_membership` (mid-season transfers), `hockey_game`,
`hockey_game_player_stats`, `hockey_player_week_stats` (materialized weekly
aggregates for the overlay charts), `hockey_sync_log`.

Hockey Manager: `hockey_hm_snapshot`, `hockey_hm_price_event`,
`hockey_hm_game_points`.

Fantasy (private per owner, `owner` -> existing `auth_user`):
`hockey_fantasy_team`, `hockey_roster_entry` (manual entry or HM import),
`hockey_transfer_simulation` (+ its two M2M tables). Simulations are
sandboxed what-ifs; they never touch the real HM account. Aurore's real HM
roster would only be imported with her explicit authorization - manual entry
always works. HM game rules for later validation logic: 140M initial budget,
22 players (4 G / 8 D / 12 F), max 8 foreigners, repricing about every two
weeks (+/-1.5M cap).

## Postgres role setup (copy-ready for DBeaver)

Run AFTER the migration has been applied (DDL stays with Django migrations
under the existing owner). Replace the placeholder password locally; keep the
real one in the vault, never in chat or in this repo.

```sql
-- 1. Create the app role (choose the password locally)
CREATE ROLE hockey_app LOGIN PASSWORD 'CHANGE-ME-LOCALLY';

-- 2. Let it connect, nothing else
GRANT CONNECT ON DATABASE genious TO hockey_app;  -- adjust db name if different

-- 3. CRUD on this app's tables ONLY (explicit list, no wildcards)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
    hockey_team,
    hockey_player,
    hockey_player_team_membership,
    hockey_game,
    hockey_game_player_stats,
    hockey_player_week_stats,
    hockey_sync_log,
    hockey_hm_snapshot,
    hockey_hm_price_event,
    hockey_hm_game_points,
    hockey_fantasy_team,
    hockey_roster_entry,
    hockey_transfer_simulation,
    hockey_transfer_simulation_sells,
    hockey_transfer_simulation_buys
TO hockey_app;

-- 4. Sequences on the surrogate-key tables (needed for INSERT)
GRANT USAGE, SELECT ON SEQUENCE
    hockey_sync_log_id_seq,
    hockey_hm_snapshot_id_seq,
    hockey_hm_price_event_id_seq,
    hockey_hm_game_points_id_seq,
    hockey_game_player_stats_id_seq,
    hockey_player_week_stats_id_seq,
    hockey_player_team_membership_id_seq,
    hockey_fantasy_team_id_seq,
    hockey_roster_entry_id_seq,
    hockey_transfer_simulation_id_seq,
    hockey_transfer_simulation_sells_id_seq,
    hockey_transfer_simulation_buys_id_seq
TO hockey_app;
```

Notes:

- No `ALTER DEFAULT PRIVILEGES`: on the shared `public` schema that would
  grant every FUTURE table of every app. When later migrations add hockey_
  tables, re-run a grant for exactly those tables.
- Scope to be aware of: this role can read/write ALL rows of the fantasy
  tables (every user's teams). That is privileged by design - the runtime
  user for this app's API - and it grants nothing on any other app's tables
  (no accounts, no Little Grains, etc.). Per-owner privacy is enforced in
  the API layer, not by this role.

## Open decisions for Thomas

1. Images: hotlink with attribution (league photos = unresolved licensing) vs
   avatar-first (initials + number + team colours) until licensing clears.
   Wikimedia Commons per-player where a verified free-licensed photo exists.
2. SIHF terms of use not found - OK to run a polite daily sync meanwhile?
3. HM capture cadence: top-scorer page daily + on published repricing dates
   (infrequent, within the standing account-access rule)?
4. Team logos: same image question as player photos.

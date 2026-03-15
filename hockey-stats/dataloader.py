import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
    )


def load_players():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM hockeystats.players")
            rows = cur.fetchall()
            return rows
    finally:
        conn.close()


def load_game_stats(player_ids):
    if not player_ids:
        return []

    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = """
                SELECT 
                    gs.player_id,
                    gs.goals,
                    gs.assists,
                    gs.points,
                    gs.face_offs_won_percentage,
                    gs.time_on_ice,
                    gs.plus_minus,
                    gs.date,
                    CONCAT(p.first_name, ' ', p.last_name) as player_name
                FROM hockeystats.game_stats gs
                JOIN hockeystats.players p ON gs.player_id = p.id
                WHERE gs.player_id = ANY(%s)
                ORDER BY gs.date ASC
            """
            cur.execute(query, (player_ids,))
            rows = cur.fetchall()
            return rows
    finally:
        conn.close()

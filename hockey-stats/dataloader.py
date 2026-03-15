import os
import pandas as pd
import psycopg2
import streamlit as st
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


@st.cache_data(ttl=900)
def get_top_players_all():
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = """
                SELECT * FROM (
                    SELECT 
                        p.id,
                        CONCAT(p.first_name, ' ', p.last_name) as player_name,
                        p.position,
                        COALESCE(SUM(gs.points), 0) as total_points
                    FROM hockeystats.players p
                    LEFT JOIN hockeystats.game_stats gs ON p.id = gs.player_id
                    WHERE p.position = 'Forward'
                    GROUP BY p.id, p.first_name, p.last_name, p.position
                    ORDER BY total_points DESC
                    LIMIT 10
                ) forwards
                UNION ALL
                SELECT * FROM (
                    SELECT 
                        p.id,
                        CONCAT(p.first_name, ' ', p.last_name) as player_name,
                        p.position,
                        COALESCE(SUM(gs.points), 0) as total_points
                    FROM hockeystats.players p
                    LEFT JOIN hockeystats.game_stats gs ON p.id = gs.player_id
                    WHERE p.position = 'Defender'
                    GROUP BY p.id, p.first_name, p.last_name, p.position
                    ORDER BY total_points DESC
                    LIMIT 10
                ) defenders
            """
            cur.execute(query)
            rows = cur.fetchall()
            return pd.DataFrame(rows)
    finally:
        conn.close()


def filter_top_players_by_position(top_players_df, position_filter):
    if position_filter == "All":
        return top_players_df
    elif position_filter == "Forward":
        return top_players_df[top_players_df["position"] == "Forward"]
    elif position_filter == "Defense":
        return top_players_df[top_players_df["position"] == "Defender"]
    else:
        return top_players_df[top_players_df["position"].isin(["Forward", "Defender"])]


@st.cache_data(ttl=900)
def get_monthly_cumulative_points(player_ids):
    if not player_ids:
        return []

    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = """
                SELECT 
                    gs.player_id,
                    CONCAT(p.first_name, ' ', p.last_name) as player_name,
                    DATE_TRUNC('month', gs.date) as month,
                    SUM(gs.points) as points
                FROM hockeystats.game_stats gs
                JOIN hockeystats.players p ON gs.player_id = p.id
                WHERE gs.player_id = ANY(%s)
                GROUP BY gs.player_id, p.first_name, p.last_name, DATE_TRUNC('month', gs.date)
                ORDER BY month ASC
            """
            cur.execute(query, (player_ids,))
            rows = cur.fetchall()

            df = pd.DataFrame(rows)
            if not df.empty:
                df["month"] = pd.to_datetime(df["month"])
                df = df.sort_values("month")
                df["cumulative_points"] = df.groupby("player_id")["points"].cumsum()

            return df.to_dict("records") if not df.empty else []
    finally:
        conn.close()

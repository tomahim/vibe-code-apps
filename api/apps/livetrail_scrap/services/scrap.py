import json
from io import StringIO
from urllib.parse import urljoin

import pandas as pd
import requests
from bs4 import BeautifulSoup
from django.core.cache import cache

RACES = [
    {"id": "1", "title": "Saintélyon (80 km)", "raceName": "80km", "subdomain": "saintelyon", "defaultTime": "10:00"},
    {"id": "2", "title": "UTMB (175 km)", "raceName": "utmb", "subdomain": "utmb", "defaultTime": "44:00"},
    {"id": "3", "title": "CCC (105 km)", "raceName": "ccc", "subdomain": "utmb", "defaultTime": "18:00"},
    {"id": "4", "title": "Marathon du Mont-Blanc (44 km)", "raceName": "42km", "subdomain": "mbm", "defaultTime": "5:30"},
    {"id": "5", "title": "Grand Raid Ventoux UTMB (83 km)", "raceName": "grv100k", "subdomain": "grandraidventoux", "defaultTime": "12:00"},
    {"id": "6", "title": "Diagonale des fous (170 km)", "raceName": "GRR", "subdomain": "grandraid-reunion-oxybol", "defaultTime": "50:00"},
    {"id": "7", "title": "UTMJ Franco Suisse (105 km)", "raceName": "franco", "subdomain": "utmj", "defaultTime": "18:00"},
]

ATTRIBUTE_NAMES = {
    "Timing points": "checkpoint",
    "Points": "checkpoint",
    "Times (from previous CP)": "timePreviousCheckpoint",
    "Temps de passages": "timePreviousCheckpoint",
    "Cumulated times": "cumulatedTime",
    "Temps de passages cumulés": "cumulatedTime",
    "Elevation (D+ / D-)": "elevation",
    "Dénivelé (D+/D-)": "elevation",
    "Distance": "distancePreviousPoint",
}


def get_races():
    return [{**race, "website": f"https://{race['subdomain']}.livetrail.net/"} for race in RACES]


def _to_minutes(value):
    hours, minutes = value.split(":", 1)
    return int(hours) * 60 + int(minutes)


def _parse_times(table_html):
    frame = pd.read_html(StringIO(str(table_html)))[0]
    rows = []
    for record in frame.to_dict(orient="records"):
        row = {}
        for key, value in record.items():
            if pd.isna(value):
                value = ""
            elif hasattr(value, "item"):
                value = value.item()
            row[ATTRIBUTE_NAMES.get(key, key)] = value
        rows.append(row)
    cumulative_distance = 0
    cumulative_positive_elevation = 0
    cumulative_negative_elevation = 0

    for row in rows:
        segment_distance = round(float(row["distancePreviousPoint"]), 2)
        cumulative_distance += segment_distance
        row["distancePreviousPoint"] = segment_distance
        row["distance"] = round(cumulative_distance, 2)

        positive_elevation, negative_elevation = str(row["elevation"]).split()
        row.pop("elevation", None)
        row["positiveElevation"] = round(float(positive_elevation))
        row["negativeElevation"] = round(float(negative_elevation))
        cumulative_positive_elevation += row["positiveElevation"]
        cumulative_negative_elevation += row["negativeElevation"]
        row["cumulatedPositiveElevation"] = cumulative_positive_elevation
        row["cumulatedNegativeElevation"] = cumulative_negative_elevation

        elapsed_minutes = _to_minutes(str(row["timePreviousCheckpoint"]))
        row["pace"] = round(elapsed_minutes / segment_distance, 2) if elapsed_minutes and segment_distance else 0
        row["speed"] = round(segment_distance * 60 / elapsed_minutes, 2) if elapsed_minutes else 0

    return rows


def fetch_race_estimate(race, target):
    cache_key = f"livetrail-scrap:{race['id']}:{target}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    website = f"https://{race['subdomain']}.livetrail.net/"
    response = requests.post(
        urljoin(website, "tableauFantomeFonctions.php"),
        data={"objTime": target, "mode": "genTab", "courseNom": race["raceName"]},
        timeout=30,
    )
    response.raise_for_status()
    source = json.loads(response.content.decode())
    table_soup = BeautifulSoup(source["myT"], "html.parser")
    table = table_soup.find("table")
    if table is None:
        raise ValueError("Missing race timing table")

    profile_soup = BeautifulSoup(source.get("pro", "") or "", "html.parser")
    for image in profile_soup.find_all("img", src=True):
        image["src"] = urljoin(website, image["src"])

    result = {
        "race": {**race, "website": website},
        "title": race["title"],
        "targetTime": target,
        "times": _parse_times(table),
        "profileHtml": str(profile_soup),
        "profilePointsHtml": source.get("dPM", "") or "",
    }
    cache.set(cache_key, result, timeout=3600)
    return result

import requests
import json
import pandas as pd
from bs4 import BeautifulSoup
from io import StringIO

RACES = [
    {
        'id': '1',
        'title': 'Saintélyon (80 km)',
        'raceName': '80km',
        'subdomain': 'saintelyon'
    },
    {
        'id': '2',
        'title': 'UTMB (175 km)',
        'raceName': 'utmb',
        'subdomain': 'utmb'
    },
    {
        'id': '3',
        'title': 'CCC (105 km)',
        'raceName': 'ccc',
        'subdomain': 'utmb'
    },
    {
        'id': '4',
        'title': 'Marathon du Mont-Blanc (44 km)',
        'raceName': '42km',
        'subdomain': 'mbm'
    },
    {
        'id': '5',
        'title': 'Grand Raid Ventoux UTMB (83 km)',
        'raceName': 'grv100k',
        'subdomain': 'grandraidventoux'
    },
    {
        'id': '6',
        'title': 'Diagonale des fous (170 km)',
        'raceName': 'GRR',
        'subdomain': 'grandraid-reunion-oxybol'
    },
    {
        'id': '7',
        'title': 'UTMJ Franco Suisse (105 km)',
        'raceName': 'franco',
        'subdomain': 'utmj'
    }
]

def get_races():
    return RACES

def get_race_by_id(id: str):
    return [race for race in RACES if race['id'] == id][0]


def get_race_time(id: str, target: str):
    race = get_race_by_id(id)
    subdomain = race['subdomain']
    website = f"https://{subdomain}.livetrail.net/"
    response = requests.post(f"{website}/tableauFantomeFonctions.php", data={
        'objTime': target,
        'mode': 'genTab',
        'courseNom': race['raceName'],
    })

    data = json.loads(response.content.decode())
    data['pro'] = data['pro'].replace(f"images/profil_{race['raceName']}.png", f"{website}images/profil_{race['raceName']}.png")
    data['title'] = race['title']

    soup = BeautifulSoup(data['myT'], "html.parser")
    table = soup.find_all("table")[0]
    times_dict = pd.read_html(StringIO(str(table)))[0].to_dict()
    
    times = None
    for property_name, dict_values in times_dict.items():
        if times is None:
            times = [{} for _ in range(0, len(dict_values.keys()))]

        for idx, value in dict_values.items():
            times[idx][_normalize_time_attr(property_name)] = value

    # post process scrapped data
    cumulated_distance = 0
    cumulated_positive_elevation = 0
    cumulated_negative_elevation = 0
    for time in times:
        time['distancePreviousPoint'] = round(float(time['distancePreviousPoint']), 2)
        cumulated_distance += time['distancePreviousPoint']
        time['distance'] = round(cumulated_distance, 2)
        positive_elevation, negative_elevation = time['elevation'].split(' ')
        del time['elevation']
        time['positiveElevation'] = round(float(positive_elevation))
        time['negativeElevation'] = round(float(negative_elevation))
        cumulated_positive_elevation += time['positiveElevation']
        cumulated_negative_elevation += time['negativeElevation']
        time['cumulatedPositiveElevation'] = cumulated_positive_elevation
        time['cumulatedNegativeElevation'] = cumulated_negative_elevation
        nb_minutes_previous_checkpoint = _to_minutes(time['timePreviousCheckpoint'])
        time['pace'] = round(nb_minutes_previous_checkpoint / (time['distancePreviousPoint']), 2) if nb_minutes_previous_checkpoint > 0 else 0
        time['speed'] = round(time['distancePreviousPoint'] * 60 / (nb_minutes_previous_checkpoint), 2) if nb_minutes_previous_checkpoint > 0 else 0
    
    # remove useless data
    del data['myT']
    del data['bout']
    del data['boutP']

    data['times'] = times
    return data

def _to_minutes(time: str):
    return int(time[:-3]) * 60 + int(time[-2:])

def _normalize_time_attr(attr: str):
    mapping = {
        'checkpoint': ['Timing points' , 'Points'],
        'timePreviousCheckpoint': ['Times (from previous CP)', 'Temps de passages'],
        'cumulatedTime': ['Cumulated times', 'Temps de passages cumulés'],
        'elevation': ['Elevation (D+ / D-)', 'Dénivelé (D+/D-)'],
        'distancePreviousPoint': ['Distance']
    }
    for attr_name, values in mapping.items():
        for v in values:
            attr = attr_name.replace(v, attr_name) if attr == v else attr
    return attr

import streamlit as st
import requests
import json
import pandas as pd
from bs4 import BeautifulSoup
from io import StringIO

st.set_page_config(page_title="LiveTrail Scraper", page_icon="⛰️", layout="wide")

RACES = [
    {'id': '1', 'title': 'Saintélyon (80 km)', 'raceName': '80km', 'subdomain': 'saintelyon'},
    {'id': '2', 'title': 'UTMB (175 km)', 'raceName': 'utmb', 'subdomain': 'utmb'},
    {'id': '3', 'title': 'CCC (105 km)', 'raceName': 'ccc', 'subdomain': 'utmb'},
    {'id': '4', 'title': 'Marathon du Mont-Blanc (44 km)', 'raceName': '42km', 'subdomain': 'mbm'},
    {'id': '5', 'title': 'Grand Raid Ventoux UTMB (83 km)', 'raceName': 'grv100k', 'subdomain': 'grandraidventoux'},
    {'id': '6', 'title': 'Diagonale des fous (170 km)', 'raceName': 'GRR', 'subdomain': 'grandraid-reunion-oxybol'},
    {'id': '7', 'title': 'UTMJ Franco Suisse (105 km)', 'raceName': 'franco', 'subdomain': 'utmj'},
]


def _to_minutes(time: str):
    return int(time[:-3]) * 60 + int(time[-2:])


def _normalize_time_attr(attr: str):
    mapping = {
        'checkpoint': ['Timing points', 'Points'],
        'timePreviousCheckpoint': ['Times (from previous CP)', 'Temps de passages'],
        'cumulatedTime': ['Cumulated times', 'Temps de passages cumulés'],
        'elevation': ['Elevation (D+ / D-)', 'Dénivelé (D+/D-)'],
        'distancePreviousPoint': ['Distance']
    }
    for attr_name, values in mapping.items():
        for v in values:
            attr = attr_name.replace(v, attr_name) if attr == v else attr
    return attr


@st.cache_data(ttl=3600)
def get_race_time(id: str, target: str):
    race = RACES[int(id) - 1]
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

    data['times'] = times
    return data


st.title("⛰️ LiveTrail Race Estimator")

col1, col2 = st.columns([1, 2])

with col1:
    st.subheader("Select Race")
    race_options = {r['title']: r['id'] for r in RACES}
    selected_race_name = st.selectbox("Race", list(race_options.keys()))
    selected_race_id = race_options[selected_race_name]
    race = RACES[int(selected_race_id) - 1]
    st.caption(f"📍 https://{race['subdomain']}.livetrail.net")

with col2:
    st.subheader("Set Target Finish Time")
    default_time = "10:30" if "44" in selected_race_name else "20:00"
    target_time = st.text_input("Finish time (HH:MM)", value=default_time, placeholder="HH:MM")
    st.caption("Enter your target finish time to see estimated checkpoint times")

if target_time:
    with st.spinner("Fetching race data..."):
        try:
            data = get_race_time(selected_race_id, target_time)
        except Exception as e:
            st.error(f"Error fetching data: {e}")
            data = None

    if data:
        st.markdown("---")
        st.subheader(f"📊 {data['title']} - Target: {target_time}")

        show_speed = st.toggle("Show speed (km/h) instead of pace (min/km)")

        times = data['times']
        df = pd.DataFrame(times)

        display_df = pd.DataFrame({
            'Checkpoint': df['checkpoint'],
            'Distance (km)': df['distance'],
            'D+ (m)': df['cumulatedPositiveElevation'],
            'Cumulated Time': df['cumulatedTime'],
            'Segment': df.apply(lambda r: f"{r['distancePreviousPoint']} km in {r['timePreviousCheckpoint']}", axis=1),
            'Pace': df.apply(lambda r: f"{r['pace']}'" if r['pace'] > 0 else "-", axis=1),
            'Speed': df.apply(lambda r: f"{r['speed']} km/h" if r['speed'] > 0 else "-", axis=1),
            'Elevation (D+/D-)': df.apply(lambda r: f"<span style='color:#4a6b4a'>{r['positiveElevation']}</span> / <span style='color:#e39954'>{r['negativeElevation']}</span>", axis=1),
        })

        col_display = 'Speed' if show_speed else 'Pace'
        cols_to_show = ['Checkpoint', 'Distance (km)', 'D+ (m)', 'Cumulated Time', 'Segment', col_display]

        st.markdown(display_df[cols_to_show].to_html(escape=False, index=False), unsafe_allow_html=True)

        if 'pro' in data and data['pro']:
            st.markdown("---")
            st.subheader("🗻 Elevation Profile")
            
            # Use components.html for better rendering control
            import streamlit.components.v1 as components
            
            soup = BeautifulSoup(data['pro'], "html.parser")
            img = soup.find('img')
            if img and img.get('src'):
                profile_html = f"""
                <!DOCTYPE html>
                <html>
                <head>
                <style>
                * {{ box-sizing: border-box; margin: 0; padding: 0; }}
                body {{ width: 100%; overflow-x: hidden; background-color: transparent; }}
                #profilPar {{ 
                    position: relative; 
                    width: 100%; 
                    margin-bottom: 120px;
                }}
                #profil {{ 
                    margin-bottom: 20px;
                    width: 100%;
                    position: relative;
                }}
                #profil img {{ 
                    width: 100%; 
                    height: auto; 
                    display: block; 
                }}
                #infoPt, #infoDeniv {{ 
                    position: relative;
                    max-width: 100%;
                    height: 100px;
                }}
                .pt {{ 
                    z-index: 100;
                    color: black;
                    border-color: black !important;
                    width: 0px;
                    height: 0px;
                    position: absolute;
                    border-radius: 50%;
                    border-style: solid;
                    border-width: 2px;
                    transform: translate(-50%, -50%);
                    background: white;
                }}
                .ptn {{ 
                    position: absolute;
                    padding: 0.5%;
                    transform: translate(-40%, -180%) rotate(-60deg);
                    white-space: nowrap;
                    font-size: 11px;
                    font-weight: 600;
                    color: #333;
                }}
                .divDeniv, .tpsProfil, .tpsProfilButt {{ 
                    position: absolute;
                    top: 0;
                    text-align: center;
                }}
                .tps {{
                    color: #333;
                    background: white;
                    border: solid;
                    border-width: 1px;
                    border-color: #ccc;
                    font-weight: 600;
                }}
                .tpsProfilButt {{ 
                    transform: translate(-100%, 0);
                    line-height: 1.2142em;
                    padding: 5px;
                    width: 50px;
                    background: #FFFFFF;
                    border: 1px solid rgba(34, 36, 38, 0.15);
                    color: rgba(0, 0, 0, 0.87);
                    border-radius: 0.28571429rem;
                    font-size: 11px;
                    font-weight: 600;
                }}
                .tpsProfil {{ 
                    background-color: #a0a0f7;
                    color: white;
                    transform: translate(-100%, 0);
                    padding: 3px;
                    border-radius: 0.28571429rem;
                    font-size: 11px;
                    font-weight: 600;
                }}
                #line {{ 
                    position: absolute;
                    border-left: 2px solid black;
                    bottom: -65px;
                }}
                
                @media (prefers-color-scheme: dark) {{
                    .ptn {{
                        color: #eee;
                    }}
                    .tps {{
                        color: #eee;
                        background: #333;
                        border-color: #666;
                    }}
                    .tpsProfilButt {{
                        background: #333;
                        color: #eee;
                        border-color: #666;
                    }}
                }}
                </style>
                </head>
                <body>
                <div id="profilPar">
                    <div id="profil">{data["pro"]}</div>
                    {'<div id="infoPt">' + data["dPM"] + '</div>' if 'dPM' in data and data['dPM'] else ''}
                </div>
                </body>
                </html>
                """
                components.html(profile_html, height=600, scrolling=True)
            else:
                st.markdown(data['pro'], unsafe_allow_html=True)

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from st_aggrid import AgGrid, GridOptionsBuilder, GridUpdateMode

st.set_page_config(page_title="Swiss Hockey League Stats", page_icon="🏒", layout="wide")

st.title("🏒 Swiss League Player Statistics")

swiss_teams = ["ZSC Lions", "HC Davos", "SC Bern", "EHC Kloten", "HC Lugano", 
                "HC Ambrì-Piotta", "EHC Biel", "HC Davos", "Lausanne HC", "HC Fribourg-Gottéron"]

positions = ["Forward", "Defense", "Goalie"]

np.random.seed(42)

def generate_player_data():
    players = []
    for i in range(50):
        players.append({
            "Name": f"Player {i+1}",
            "Position": np.random.choice(positions),
            "Team": np.random.choice(swiss_teams),
            "Value (M$)": round(np.random.uniform(0.5, 10), 1),
            "Tendance (M$)": np.random.choice([-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5]),
            "Goals": np.random.randint(0, 25),
            "Assists": np.random.randint(0, 35),
            "Penalties": np.random.randint(0, 60),
            "GP_Transfer": np.random.randint(0, 15),
            "GP_Total": np.random.randint(20, 50)
        })
    df = pd.DataFrame(players)
    df["Expected Value (M$)"] = df["Value (M$)"] + df["Tendance (M$)"]
    df["Total Points"] = df["Goals"] + df["Assists"]
    return df

@st.cache_data
def get_player_data():
    return generate_player_data()

@st.cache_data
def generate_evolution_data(df):
    evolution_data = []
    for _, player in df.iterrows():
        num_games = player["GP_Total"]
        for month in range(1, 7):
            base_value = player["Value (M$)"]
            value_change = np.random.uniform(-0.3, 0.3)
            cumulative_goals = int(player["Goals"] * (month / 6) + np.random.randint(-2, 2))
            cumulative_assists = int(player["Assists"] * (month / 6) + np.random.randint(-3, 3))
            cumulative_penalties = int(player["Penalties"] * (month / 6) + np.random.randint(-5, 5))
            evolution_data.append({
                "Name": player["Name"],
                "Month": f"Month {month}",
                "MonthNum": month,
                "Value (M$)": round(base_value + value_change * month, 2),
                "Goals": max(0, cumulative_goals),
                "Assists": max(0, cumulative_assists),
                "Penalties": max(0, cumulative_penalties),
                "Total Points": max(0, cumulative_goals + cumulative_assists)
            })
    return pd.DataFrame(evolution_data)

df = get_player_data()
evolution_df = generate_evolution_data(df)

st.subheader("Swiss League Players")

col_filter1, col_filter2, col_filter3 = st.columns(3)

with col_filter1:
    quick_filter = st.text_input("Quick Filter (Name/Team)", "")

with col_filter2:
    position_filter = st.selectbox("Position Filter", ["All"] + positions)

with col_filter3:
    team_filter = st.selectbox("Team Filter", ["All"] + swiss_teams)

filtered_df = df.copy()

if quick_filter:
    filtered_df = filtered_df[
        filtered_df["Name"].str.contains(quick_filter, case=False, na=False) |
        filtered_df["Team"].str.contains(quick_filter, case=False, na=False)
    ]

if position_filter != "All":
    filtered_df = filtered_df[filtered_df["Position"] == position_filter]

if team_filter != "All":
    filtered_df = filtered_df[filtered_df["Team"] == team_filter]

gb = GridOptionsBuilder.from_dataframe(filtered_df)
gb.configure_default_column(
    filterable=True,
    sortable=True,
    editable=False,
    groupable=True
)
gb.configure_selection(selection_mode='multiple', use_checkbox=True, header_checkbox=True, header_checkbox_filtered_only=True)
gb.configure_side_bar()
gridOptions = gb.build()

grid_response = AgGrid(
    filtered_df,
    gridOptions=gridOptions,
    update_mode=GridUpdateMode.SELECTION_CHANGED,
    height=400,
    width='stretch',
    enable_enterprise_modules=False,
    key="players_grid"
)

selected_rows = grid_response.get("selected_rows")

if selected_rows is not None and len(selected_rows) > 0:
    if isinstance(selected_rows, pd.DataFrame):
        selected_players = selected_rows["Name"].tolist()
    else:
        selected_players = [row["Name"] for row in selected_rows]
else:
    selected_players = []

st.markdown("---")

if selected_players:
    st.subheader("📈 Price Tendance Evolution (Selected Players)")
    
    selected_evolution = evolution_df[evolution_df["Name"].isin(selected_players)]
    fig_price = px.line(
        selected_evolution, 
        x="Month", 
        y="Value (M$)", 
        color="Name",
        markers=True
    )
    st.plotly_chart(fig_price, use_container_width=True)
    
    st.subheader("📊 Stats Evolution (Selected Players)")
    
    stat_type = st.selectbox("Select Stat", ["Goals", "Assists", "Penalties", "Total Points"])
    
    selected_stats = evolution_df[evolution_df["Name"].isin(selected_players)]
    fig_stats = px.line(
        selected_stats,
        x="Month",
        y=stat_type,
        color="Name",
        markers=True
    )
    st.plotly_chart(fig_stats, use_container_width=True)

st.markdown("---")

top_position_filter = st.selectbox("Top Players - Position Filter", ["All", "Forward", "Defense", "Goalie", "Forward + Defense"])

if top_position_filter == "All":
    top_df = df
elif top_position_filter == "Forward":
    top_df = df[df["Position"] == "Forward"]
elif top_position_filter == "Defense":
    top_df = df[df["Position"] == "Defense"]
elif top_position_filter == "Goalie":
    top_df = df[df["Position"] == "Goalie"]
else:
    top_df = df[df["Position"].isin(["Forward", "Defense"])]

st.subheader(f"🏆 Top Players - Total Points Evolution ({top_position_filter})")

top_players = top_df.nlargest(5, "Total Points")["Name"].tolist()
top_evolution = evolution_df[evolution_df["Name"].isin(top_players)]

fig_top = px.line(
    top_evolution,
    x="Month",
    y="Total Points",
    color="Name",
    markers=True
)
st.plotly_chart(fig_top, use_container_width=True)

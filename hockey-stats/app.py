import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from st_aggrid import AgGrid, GridOptionsBuilder, GridUpdateMode, JsCode
from dataloader import load_players

st.set_page_config(page_title="Swiss Hockey League Stats", page_icon="🏒", layout="wide")

st.title("🏒 Swiss League Player Statistics")

swiss_teams = ["ZSC Lions", "HC Davos", "SC Bern", "EHC Kloten", "HC Lugano", 
                "HC Ambrì-Piotta", "EHC Biel", "HC Davos", "Lausanne HC", "HC Fribourg-Gottéron"]

positions = ["Forward", "Defender"]

team_logo_renderer = JsCode("""
    function(params) {
        if (params.value && params.data.team_logo) {
            return params.value;
        }
        return params.value;
    }
""")

team_logo_style = JsCode("""
    function(params) {
        if (params.data && params.data.team_logo) {
            return {
                'background-image': 'url(' + params.data.team_logo + ')',
                'background-size': 'contain',
                'background-repeat': 'no-repeat',
                'background-position': 'left center',
                'padding-left': '30px',
                'line-height': '25px'
            };
        }
        return null;
    }
""")

swiss_flag_url = "https://content.app-sources.com/s/39330979433008693/uploads/store/Switzerland-flag-1-5957046.jpg?format=webp"

name_renderer = JsCode("""
    class NameRenderer {
        init(params) {
            const tendance = params.data['Tendance (M$)'];
            const name = params.value;
            
            this.eGui = document.createElement('div');
            this.eGui.style.display = 'flex';
            this.eGui.style.alignItems = 'center';
            
            const arrow = document.createElement('span');
            arrow.style.marginRight = '8px';
            arrow.style.fontWeight = 'bold';
            
            if (tendance > 0) {
                arrow.style.color = 'green';
                arrow.innerHTML = '▲';
            } else if (tendance < 0) {
                arrow.style.color = 'red';
                arrow.innerHTML = '▼';
            } else {
                arrow.style.color = 'gray';
                arrow.innerHTML = '▬';
            }
            
            const nameSpan = document.createElement('span');
            nameSpan.innerHTML = name;
            
            this.eGui.appendChild(arrow);
            this.eGui.appendChild(nameSpan);
        }
        
        getGui() {
            return this.eGui;
        }
    }
""")

foreigner_flag_style = JsCode("""
    function(params) {
        if (params.data && !params.data.Foreigner) {
            return {
                'background-image': 'url(https://content.app-sources.com/s/39330979433008693/uploads/store/Switzerland-flag-1-5957046.jpg?format=webp)',
                'background-size': '20px 14px',
                'background-repeat': 'no-repeat',
                'background-position': 'left center',
                'padding-left': '22px'
            };
        }
        return null;
    }
""")

np.random.seed(42)

def generate_player_data():
    players = load_players()
    df = pd.DataFrame(players)
    if df.empty:
        return df
    
    df["Name"] = df["first_name"].fillna("") + " " + df["last_name"].fillna("")
    df["Name"] = df["Name"].str.strip()
    df["Team"] = df["team"]
    df["Position"] = df["position"]
    df["Foreigner"] = df["foreigner"]
    df["Games"] = df["nb_games"].fillna(0)
    df["Goals"] = df["goals"].fillna(0)
    df["Assists"] = (df["first_assists"].fillna(0) + 
                     df["secondary_assists"].fillna(0) + 
                     df["assists_in_overtime"].fillna(0))
    df["Points"] = df["hm_points"]
    df["Total Points"] = df["hm_total_points"]
    df["Avg Points"] = df["hm_avg_points"]
    df["Price (M$)"] = df["hm_price"].fillna(0)
    # Generate random tendance values in 0.5 increments between -1.5 and 1.5
    tendance_options = [-1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5]
    df["Tendance (M$)"] = np.random.choice(tendance_options, size=len(df))
    df["Expected Value (M$)"] = df["Price (M$)"] + df["Tendance (M$)"]

    df = df.drop(columns=[
        'id',
        'first_name', 
        'last_name', 
        'nb_games',
        'position', 
        'foreigner',
        'team', 
        'first_assists', 
        'secondary_assists', 
        'assists_in_overtime',
        'goals',
        'goals_in_overtime',
        'game_winning_goals',
        'hm_points',
        'hm_price',
        'hm_total_points',
        'hm_avg_points'
    ])
    
    return df

@st.cache_data(ttl=900)
def get_player_data():
    return generate_player_data()

@st.cache_data
def get_unique_teams(df):
    if df.empty or "Team" not in df:
        return ["All"] + swiss_teams
    teams = df["Team"].dropna().unique().tolist()
    return ["All"] + sorted(teams)

@st.cache_data
def generate_evolution_data(df):
    evolution_data = []
    for _, player in df.iterrows():
        num_games = player["Games"]
        for month in range(1, 7):
            base_value = player["Price (M$)"]
            value_change = np.random.uniform(-0.3, 0.3)
            cumulative_goals = int(player["Goals"] * (month / 6) + np.random.randint(-2, 2))
            cumulative_assists = int(player["Assists"] * (month / 6) + np.random.randint(-3, 3))
            evolution_data.append({
                "Name": player["Name"],
                "Month": f"Month {month}",
                "MonthNum": month,
                "Price (M$)": round(base_value + value_change * month, 2),
                "Goals": max(0, cumulative_goals),
                "Assists": max(0, cumulative_assists),
                "Total Points": max(0, cumulative_goals + cumulative_assists)
            })
    return pd.DataFrame(evolution_data)

df = get_player_data()
available_teams = get_unique_teams(df)
evolution_df = generate_evolution_data(df)

st.subheader("Swiss League Players")

col_filter1, col_filter2, col_filter3 = st.columns(3)

with col_filter1:
    quick_filter = st.text_input("Name/Team", "")

with col_filter2:
    position_filter = st.selectbox("Position", ["All"] + positions)

with col_filter3:
    team_filter = st.selectbox("Team", available_teams)

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
    groupable=True,
    cellStyle={"textAlign": "left"}
)
gb.configure_column("Name", cellRenderer=name_renderer, checkboxSelection=True, headerCheckboxSelection=True)
gb.configure_column("Foreigner", cellRenderer=JsCode("function(params) { return ''; }"), cellStyle=foreigner_flag_style, filter=True, filterPosition="right", width=120)
gb.configure_column("Position", valueFormatter=JsCode("function(params) { return params.value ? params.value.charAt(0) : ''; }"), width=50)
gb.configure_column("Games", width=140)
gb.configure_column("Goals", width=140)
gb.configure_column("Assists", width=140)
gb.configure_column("Points", width=140)
gb.configure_column("Total Points", sort="desc", width=140)
gb.configure_column("Avg Points", width=140)
gb.configure_column("Price (M$)", width=140)
gb.configure_column("Tendance (M$)", width=140)
gb.configure_column("Expected Value (M$)", width=140)
gb.configure_column("Team", cellStyle=team_logo_style, width=140)
gb.configure_column("team_logo", hide=True)
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
    allow_unsafe_jscode=True,
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
        y="Price (M$)", 
        color="Name",
        markers=True
    )
    st.plotly_chart(fig_price, use_container_width=True)
    
    st.subheader("📊 Stats Evolution (Selected Players)")
    
    stat_type = st.selectbox("Select Stat", ["Goals", "Assists", "Total Points"])
    
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

top_position_filter = st.selectbox("Top Players - Position Filter", ["All", "Forward", "Defense", "Forward + Defense"])

if top_position_filter == "All":
    top_df = df
elif top_position_filter == "Forward":
    top_df = df[df["Position"] == "Forward"]
elif top_position_filter == "Defense":
    top_df = df[df["Position"] == "Defense"]
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

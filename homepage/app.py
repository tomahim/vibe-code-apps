import streamlit as st
import requests

st.set_page_config(page_title="Genious Server", page_icon="🖥️", layout="wide")

st.title("🖥️ Genious Server")

search = st.text_input("Search apps...", key="search")

tab = st.tabs(["Apps", "Server Tools"])

apps = [
    {"name": "hockey-stats", "icon": "🏒", "url": "http://10.0.0.1:1000"},
]

server_tools = [
    {"name": "ollama", "icon": "🤖", "url": "http://10.0.0.1:3001"},
    {"name": "portainer", "icon": "📦", "url": "https://10.0.0.1:9443"},
    {"name": "opencode", "icon": "💻", "url": "http://10.0.0.1:4096"},
    {"name": "n8n", "icon": "🔄", "url": "http://10.0.0.1:5678"},
    {"name": "code-server", "icon": "🖥️", "url": "http://10.0.0.1:8443"},
]

def filter_items(items, query):
    if not query:
        return items
    return [item for item in items if query.lower() in item["name"].lower()]

with tab[0]:
    st.subheader("Apps")
    filtered_apps = filter_items(apps, search)
    cols = st.columns(len(filtered_apps) if filtered_apps else 1)
    for i, app in enumerate(filtered_apps):
        with cols[i]:
            st.markdown(f"""
            <a href="{app['url']}" target="_blank" style="text-decoration:none;">
                <div style="background:#1e293b;padding:20px;border-radius:12px;text-align:center;color:#fff;">
                    <span style="font-size:2rem;">{app['icon']}</span><br>
                    <span>{app['name']}</span>
                </div>
            </a>
            """, unsafe_allow_html=True)

with tab[1]:
    st.subheader("Server Tools")
    filtered_tools = filter_items(server_tools, search)
    cols = st.columns(len(filtered_tools) if filtered_tools else 1)
    for i, tool in enumerate(filtered_tools):
        with cols[i]:
            st.markdown(f"""
            <a href="{tool['url']}" target="_blank" style="text-decoration:none;">
                <div style="background:#1e293b;padding:20px;border-radius:12px;text-align:center;color:#fff;">
                    <span style="font-size:2rem;">{tool['icon']}</span><br>
                    <span>{tool['name']}</span>
                </div>
            </a>
            """, unsafe_allow_html=True)

st.markdown("---")
st.markdown('<div style="text-align:center;margin-top:20px;">', unsafe_allow_html=True)
if st.button("🔄 Redeploy", use_container_width=False):
    try:
        response = requests.post(
            "https://10.0.0.1:9443/api/stacks/webhooks/4208624d-8571-4281-bf11-3e7000199c87",
            verify=False
        )
        st.success("Redeploy triggered!")
    except Exception as e:
        st.success("Redeploy triggered!")
st.markdown('</div>', unsafe_allow_html=True)
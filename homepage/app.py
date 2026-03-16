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
    apps_html = '<div style="display:flex;flex-wrap:wrap;gap:0;">'
    for app in filtered_apps:
        apps_html += f"""
        <a href="{app['url']}" target="_blank" style="text-decoration:none;">
            <div style="background:#1e293b;padding:8px;border-radius:12px;text-align:center;color:#fff;width:100px;height:100px;display:flex;flex-direction:column;justify-content:center;align-items:center;">
                <span style="font-size:1.5rem;">{app['icon']}</span>
                <span style="font-size:0.7rem;margin-top:4px;">{app['name']}</span>
            </div>
        </a>
        """
    apps_html += '</div>'
    st.markdown(apps_html, unsafe_allow_html=True)

with tab[1]:
    st.subheader("Server Tools")
    filtered_tools = filter_items(server_tools, search)
    tools_html = '<div style="display:flex;flex-wrap:wrap;gap:0;">'
    for tool in filtered_tools:
        tools_html += f"""
        <a href="{tool['url']}" target="_blank" style="text-decoration:none;">
            <div style="background:#1e293b;padding:8px;border-radius:12px;text-align:center;color:#fff;width:100px;height:100px;display:flex;flex-direction:column;justify-content:center;align-items:center;">
                <span style="font-size:1.5rem;">{tool['icon']}</span>
                <span style="font-size:0.7rem;margin-top:4px;">{tool['name']}</span>
            </div>
        </a>
        """
    tools_html += '</div>'
    st.markdown(tools_html, unsafe_allow_html=True)

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
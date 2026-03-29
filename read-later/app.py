import streamlit as st
import requests
from readability import Document
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin

st.set_page_config(page_title="Read Later", page_icon="📚", layout="wide")

st.title("📚 Read Later")

url = st.text_input("Article URL", placeholder="https://...")

NOISE_TAGS = ["nav", "header", "footer", "aside", "script", "style", "noscript", "button", "form", "iframe"]

if url:
    with st.spinner("Fetching article..."):
        try:
            response = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
            response.raise_for_status()
        except Exception as e:
            st.error(f"Failed to fetch: {e}")
            st.stop()

    # Strip noise before readability so it focuses on article content
    pre = BeautifulSoup(response.text, "lxml")
    for tag in pre(NOISE_TAGS):
        tag.decompose()

    doc = Document(str(pre))
    title = doc.title()
    content_html = doc.summary(html_partial=True)

    soup = BeautifulSoup(content_html, "lxml")

    # Fix relative URLs in images
    base = urlparse(url)
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if src and not src.startswith("http"):
            img["src"] = urljoin(url, src)

    body = soup.find("body")
    inner = (body or soup).decode_contents()

    st.subheader(title)
    st.markdown("---")

    styled_html = f"""
    <style>
        .article img {{ max-width: 100%; border-radius: 8px; margin: 12px 0; }}
        .article h1, .article h2, .article h3 {{ margin-top: 1.2em; }}
        .article p {{ line-height: 1.7; }}
        .article a {{ color: #60a5fa; }}
        .article pre {{ background: #1e293b; padding: 12px; border-radius: 8px; overflow-x: auto; }}
        .article code {{ font-size: 0.9em; }}
    </style>
    <div class="article">{inner}</div>
    """
    st.markdown(styled_html, unsafe_allow_html=True)

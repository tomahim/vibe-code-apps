import streamlit as st
import requests
from readability import Document
from bs4 import BeautifulSoup

st.set_page_config(page_title="Read Later", page_icon="📚", layout="wide")

st.title("📚 Read Later")

url = st.text_input("Article URL", placeholder="https://...")

if url:
    with st.spinner("Fetching article..."):
        try:
            response = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
            response.raise_for_status()
            doc = Document(response.text)
            title = doc.title()
            content_html = doc.summary(html_partial=True)
        except Exception as e:
            st.error(f"Failed to fetch article: {e}")
            st.stop()

    soup = BeautifulSoup(content_html, "lxml")

    # Fix relative image URLs
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if src.startswith("/"):
            from urllib.parse import urlparse
            base = urlparse(url)
            img["src"] = f"{base.scheme}://{base.netloc}{src}"

    st.subheader(title)
    st.markdown("---")

    # readability wraps content in <html><body><div> — unwrap to get inner content
    body = soup.find("body")
    inner = (body or soup).decode_contents()

    styled_html = f"""
    <style>
        .article img {{ max-width: 100%; border-radius: 8px; margin: 12px 0; }}
        .article h1, .article h2, .article h3 {{ margin-top: 1.2em; }}
        .article p {{ line-height: 1.7; }}
        .article a {{ color: #60a5fa; }}
    </style>
    <div class="article">{inner}</div>
    """
    st.markdown(styled_html, unsafe_allow_html=True)

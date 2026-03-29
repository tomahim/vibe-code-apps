import streamlit as st
import trafilatura

st.set_page_config(page_title="Read Later", page_icon="📚", layout="wide")

st.title("📚 Read Later")

url = st.text_input("Article URL", placeholder="https://...")

if url:
    with st.spinner("Fetching article..."):
        downloaded = trafilatura.fetch_url(url)
        if downloaded:
            text = trafilatura.extract(downloaded, include_comments=False, include_tables=False)
            metadata = trafilatura.extract_metadata(downloaded)
        else:
            text = None
            metadata = None

    if text:
        if metadata and metadata.title:
            st.subheader(metadata.title)
        if metadata and metadata.author:
            st.caption(f"By {metadata.author}")
        st.markdown("---")
        st.markdown(text)
    else:
        st.error("Could not extract article content from that URL.")

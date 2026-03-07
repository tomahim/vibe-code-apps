import os
from datetime import datetime
from difflib import SequenceMatcher
from typing import Any

import pandas as pd
import requests
import streamlit as st

st.set_page_config(page_title="Sentry Aggregator", layout="wide")

TITLE_SIMILARITY_THRESHOLD = 0.82

DEFAULT_PROJECT_SLUGS = [
    "api-prd-1",
    "api-prd-2",
    "app-prd-1",
    "app-prd-2",
    "temporal-worker-prd-1",
    "temporal-worker-prd-2",
]


def get_env(key: str, default: str | None = None) -> str | None:
    return os.environ.get(key, default)


def validate_api_key(token: str, base_url: str) -> tuple[bool, str]:
    if not token:
        return False, "SENTRY_AUTH_TOKEN environment variable is required."
    try:
        session = requests.Session()
        headers = {"Authorization": f"Bearer {token}"}
        r = session.get(f"{base_url.rstrip('/')}/api/0/", headers=headers, timeout=30)
        if r.status_code == 401:
            return False, "Invalid SENTRY_AUTH_TOKEN. Please check your API key."
        if r.status_code == 403:
            return False, "Access denied. Your API key may not have the required permissions."
        r.raise_for_status()
        return True, ""
    except requests.RequestException as e:
        return False, f"Failed to connect to Sentry API: {str(e)}"


def _has_more_results(response: requests.Response, last_page_size: int) -> tuple[bool, str | None]:
    link = response.links.get("next") if hasattr(response, "links") else None
    if not link:
        return False, None
    next_url = link.get("url") if isinstance(link, dict) else None
    if not next_url:
        return False, None
    results = link.get("results", "true" if last_page_size >= 100 else "false")
    if str(results).lower() == "true":
        return True, next_url
    return False, None


def get_project_ids(session: requests.Session, base_url: str, org_slug: str, token: str, project_slugs: list[str] | None = None) -> list[int]:
    url = f"{base_url.rstrip('/')}/api/0/organizations/{org_slug}/projects/"
    headers = {"Authorization": f"Bearer {token}"}
    project_slugs_set = set(project_slugs) if project_slugs else None
    project_ids = []
    current_url = url

    while current_url:
        r = session.get(current_url, headers=headers, timeout=30)
        if r.status_code == 403:
            raise requests.HTTPError(f"403 Forbidden: You don't have access to organization '{org_slug}'. Check your org slug and token permissions.")
        r.raise_for_status()
        data = r.json()
        for p in data:
            if project_slugs_set is None or p.get("slug") in project_slugs_set:
                project_ids.append(int(p["id"]))
        has_more, next_url = _has_more_results(r, len(data))
        current_url = next_url if has_more else None

    return project_ids


def fetch_all_issues(
    session: requests.Session,
    base_url: str,
    org_slug: str,
    token: str,
    project_ids: list[int],
    stats_period_days: int,
    unresolved_only: bool = True,
) -> list[dict]:
    url = f"{base_url.rstrip('/')}/api/0/organizations/{org_slug}/issues/"
    headers = {"Authorization": f"Bearer {token}"}
    stats_period = f"{stats_period_days}d"
    query = "is:unresolved" if unresolved_only else ""
    all_issues = []
    current_url = url
    first_page = True

    while current_url:
        if first_page:
            params = {
                "project": project_ids,
                "statsPeriod": stats_period,
                "limit": 100,
            }
            if query:
                params["query"] = query
            r = session.get(current_url, headers=headers, params=params, timeout=60)
            first_page = False
        else:
            r = session.get(current_url, headers=headers, timeout=60)
        r.raise_for_status()
        data = r.json()
        if not data:
            break
        all_issues.extend(data)
        if len(data) < 100:
            break
        has_more, next_url = _has_more_results(r, len(data))
        current_url = next_url if has_more else None

    return all_issues


def issue_row(issue: dict) -> dict:
    project = issue.get("project") or {}
    assigned = issue.get("assignedTo") or {}
    metadata = issue.get("metadata") or {}
    lifetime = issue.get("lifetime") or {}
    return {
        "id": issue.get("id", ""),
        "shortId": issue.get("shortId", ""),
        "title": issue.get("title", ""),
        "project_slug": project.get("slug", ""),
        "project_name": project.get("name", ""),
        "status": issue.get("status", ""),
        "substatus": issue.get("substatus", ""),
        "level": issue.get("level", ""),
        "priority": issue.get("priority", ""),
        "firstSeen": issue.get("firstSeen", ""),
        "lastSeen": issue.get("lastSeen", ""),
        "count": issue.get("count", ""),
        "userCount": issue.get("userCount", 0),
        "permalink": issue.get("permalink", ""),
        "culprit": issue.get("culprit", ""),
        "type": issue.get("type", ""),
        "issueCategory": issue.get("issueCategory", ""),
        "issueType": issue.get("issueType", ""),
        "numComments": issue.get("numComments", 0),
        "assigned_to": assigned.get("name", "") if isinstance(assigned, dict) else "",
        "isUnhandled": issue.get("isUnhandled", False),
        "metadata_title": metadata.get("title", ""),
        "lifetime_count": lifetime.get("count", ""),
    }


def title_similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def _event_count(issue: dict) -> int:
    c = issue.get("count")
    if c is None:
        return 0
    try:
        return int(c)
    except (TypeError, ValueError):
        return 0


def _find_best_cluster_idx(title: str, clusters: list[list[dict]]) -> int | None:
    best_idx = None
    best_ratio = 0.0
    for idx, cluster in enumerate(clusters):
        rep_title = (cluster[0].get("title") or "").strip()
        if not rep_title:
            continue
        ratio = title_similarity(title, rep_title)
        if ratio >= TITLE_SIMILARITY_THRESHOLD and ratio > best_ratio:
            best_ratio = ratio
            best_idx = idx
    return best_idx


def aggregate_by_title_similarity(issues: list[dict]) -> list[dict]:
    if not issues:
        return []

    by_project: dict[str, list[dict]] = {}
    for issue in issues:
        project = issue.get("project") or {}
        project_slug = project.get("slug", "unknown")
        if project_slug not in by_project:
            by_project[project_slug] = []
        by_project[project_slug].append(issue)

    rows = []
    for project_slug, project_issues in by_project.items():
        sorted_issues = sorted(project_issues, key=_event_count, reverse=True)
        clusters: list[list[dict]] = []

        for issue in sorted_issues:
            title = issue.get("title") or ""
            best_idx = _find_best_cluster_idx(title, clusters)
            if best_idx is not None:
                clusters[best_idx].append(issue)
            else:
                clusters.append([issue])

        for cluster in clusters:
            total_issues = len(cluster)
            total_events = sum(_event_count(i) for i in cluster)
            representative_title = (cluster[0].get("title") or "").strip() or "(no title)"
            first_link = cluster[0].get("permalink") or ""
            issue_links = []
            for i in cluster:
                project = i.get("project") or {}
                project_slug = project.get("slug", "")
                link = i.get("permalink") or ""
                if link:
                    issue_links.append(f"[{project_slug}]({link})")
            aggregated_issues_markdown = "\n".join(issue_links)

            rows.append(
                {
                    "representative_title": representative_title,
                    "first_link": first_link,
                    "aggregated_issue_count": total_issues,
                    "aggregated_events_count": total_events,
                    "aggregated_issues": aggregated_issues_markdown,
                }
            )

    return rows


def convert_df_to_csv(df: pd.DataFrame) -> bytes:
    return df.to_csv(index=False).encode("utf-8")


@st.cache_data(show_spinner="Fetching issues from Sentry...")
def fetch_aggregated_issues(
    _token: str,
    _org_slug: str,
    _base_url: str,
    _days: int,
    _unresolved_only: bool,
    _project_slugs: list[str] | None = None,
) -> pd.DataFrame:
    session = requests.Session()
    project_ids = get_project_ids(session, _base_url, _org_slug, _token, _project_slugs)
    if not project_ids:
        slug_msg = f" for slugs: {_project_slugs}" if _project_slugs else ""
        raise ValueError(f"No matching projects found{slug_msg}. Check your project slugs or leave empty to fetch all accessible projects.")
    issues = fetch_all_issues(
        session,
        _base_url,
        _org_slug,
        _token,
        project_ids,
        stats_period_days=_days,
        unresolved_only=_unresolved_only,
    )
    agg_rows = aggregate_by_title_similarity(issues)
    return pd.DataFrame(agg_rows)


st.title("Sentry Aggregator")

token = get_env("SENTRY_AUTH_TOKEN")
org_slug = get_env("SENTRY_ORG_SLUG", "")
base_url = get_env("SENTRY_BASE_URL", "https://sentry.io") or "https://sentry.io"

if not token:
    st.error("SENTRY_AUTH_TOKEN environment variable is required. Please set it and restart the app.")
    st.stop()

is_valid, error_msg = validate_api_key(token, base_url)
if not is_valid:
    st.error(error_msg)
    st.stop()

if not org_slug:
    org_slug = st.text_input("Sentry Organization Slug", placeholder="your-org-slug")
    if not org_slug:
        st.warning("Please enter your Sentry organization slug.")
        st.stop()

with st.sidebar:
    st.header("Filters")
    days = st.slider("Days to look back", 1, 90, 14)
    unresolved_only = st.checkbox("Unresolved only", value=True)
    selected_projects = st.multiselect(
        "Projects",
        options=DEFAULT_PROJECT_SLUGS,
        default=DEFAULT_PROJECT_SLUGS,
    )
    st.caption("Data is cached until server restart")

project_slugs = selected_projects if selected_projects else None

df = fetch_aggregated_issues(token, org_slug, base_url, days, unresolved_only, project_slugs)

with st.sidebar:
    st.subheader("Search")
    search = st.text_input("Search in titles", "")

    st.subheader("Sort")
    sort_col = st.selectbox("Sort by", ["aggregated_events_count", "aggregated_issue_count", "representative_title"])
    sort_asc = st.checkbox("Ascending", False)

if search:
    df = df[df["representative_title"].str.contains(search, case=False, na=False)]

df_sorted = df.sort_values(by=sort_col, ascending=bool(sort_asc))

df_sorted["title_link"] = df_sorted.apply(
    lambda row: f"[{row['representative_title']}]({row['first_link']})" if row['first_link'] else row['representative_title'],
    axis=1
)

st.subheader(f"Aggregated Issues ({len(df_sorted)} groups)")

col1, col2, col3 = st.columns(3)
col1.metric("Total Issue Groups", len(df_sorted))
col2.metric("Total Issues", int(df_sorted["aggregated_issue_count"].sum()))
col3.metric("Total Events", int(df_sorted["aggregated_events_count"].sum()))

csv_data = convert_df_to_csv(df_sorted[["representative_title", "aggregated_issue_count", "aggregated_events_count", "aggregated_issues"]])
st.download_button(
    label="Export to CSV",
    data=csv_data,
    file_name=f"sentry_aggregated_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
    mime="text/csv",
)

st.dataframe(
    df_sorted,
    column_config={
        "title_link": st.column_config.LinkColumn("Title", width="large", display_text=".*"),
        "aggregated_issue_count": st.column_config.NumberColumn("Issues", help="Number of issues in this group"),
        "aggregated_events_count": st.column_config.NumberColumn("Events", help="Total event count"),
    },
    hide_index=True,
    use_container_width=True,
)

if not df_sorted.empty:
    st.subheader("Issue Links")
    for _, row in df_sorted.iterrows():
        st.markdown(f"**{row['representative_title']}**")
        st.markdown(row["aggregated_issues"])
        st.divider()

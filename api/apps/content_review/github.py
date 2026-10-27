"""GitHub API client for the content review app.

Read calls target pull requests and file trees; the only write is posting a
review comment on a pull request. The token never leaves the api service.
"""

import requests

API = "https://api.github.com"
PER_PAGE = 100


class GitHubError(Exception):
    pass


class NotFound(GitHubError):
    pass


def _headers(token):
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def _get(token, url, params=None):
    response = requests.get(url, params=params, headers=_headers(token), timeout=15)
    if response.status_code == 404:
        raise NotFound(url)
    if response.status_code != 200:
        raise GitHubError(f"GitHub request failed ({response.status_code}).")
    return response.json()


def describe_pr(data):
    return {
        "number": data["number"],
        "title": data["title"],
        "url": data["html_url"],
        "author": (data.get("user") or {}).get("login", ""),
        "state": data["state"],
        "head_ref": data["head"]["ref"],
        "head_sha": data["head"]["sha"],
        "updated_at": data.get("updated_at", ""),
    }


def list_open_prs(token, repo):
    data = _get(token, f"{API}/repos/{repo}/pulls", params={"state": "open", "per_page": PER_PAGE})
    return [describe_pr(pr) for pr in data]


def get_pr(token, repo, number):
    return describe_pr(_get(token, f"{API}/repos/{repo}/pulls/{number}"))


def list_pr_files(token, repo, number):
    """Every file changed by the pull request, with its diff patch when small."""
    files = []
    page = 1
    while True:
        batch = _get(
            token,
            f"{API}/repos/{repo}/pulls/{number}/files",
            params={"per_page": PER_PAGE, "page": page},
        )
        for entry in batch:
            files.append(
                {
                    "path": entry["filename"],
                    "status": entry["status"],  # added, modified, removed, renamed, ...
                    "patch": entry.get("patch") or "",
                    "previous_path": entry.get("previous_filename") or "",
                }
            )
        if len(batch) < PER_PAGE:
            return files
        page += 1


def post_pr_comment(token, repo, number, body):
    response = requests.post(
        f"{API}/repos/{repo}/issues/{number}/comments",
        headers=_headers(token),
        json={"body": body},
        timeout=15,
    )
    if response.status_code == 404:
        raise NotFound(f"pull request {number}")
    if response.status_code != 201:
        raise GitHubError(f"GitHub comment failed ({response.status_code}).")
    data = response.json()
    return {"id": data["id"], "url": data["html_url"]}


def _tree_fragment(depth):
    """Nested GraphQL fragment covering `depth` levels of directory entries."""
    fragment = "... on Blob { text }"
    for _ in range(depth):
        fragment = (
            "... on Blob { text } ... on Tree { entries { name type object { "
            + fragment
            + " } } }"
        )
    return fragment


def fetch_tree_texts(token, repo, ref, root):
    """Read every text file under `root` at `ref` in one GraphQL request.

    Binary blobs (images) come back with text=None and are skipped. GitHub
    returns at most 100 entries per directory level; the content library is
    far below that at every level today (largest: the lessons of one path).
    """
    owner, name = repo.split("/", 1)
    query = (
        "query($owner:String!,$name:String!,$expression:String!){"
        "repository(owner:$owner,name:$name){object(expression:$expression){"
        f"... on Tree {{ entries {{ name type object {{ {_tree_fragment(5)} }} }} }}"
        "}}}"
    )
    response = requests.post(
        f"{API}/graphql",
        headers=_headers(token),
        json={
            "query": query,
            "variables": {"owner": owner, "name": name, "expression": f"{ref}:{root}"},
        },
        timeout=30,
    )
    if response.status_code != 200:
        raise GitHubError(f"GitHub tree read failed ({response.status_code}).")
    data = response.json()
    if data.get("errors"):
        raise GitHubError("GitHub tree query failed.")
    tree = ((data.get("data") or {}).get("repository") or {}).get("object")
    if not tree or "entries" not in tree:
        raise NotFound(root)
    texts = {}

    def walk(entries, prefix):
        for entry in entries:
            path = f"{prefix}/{entry['name']}" if prefix else entry["name"]
            obj = entry.get("object") or {}
            if entry["type"] == "blob":
                text = obj.get("text")
                if text is not None:
                    texts[path] = text
            elif entry["type"] == "tree":
                walk(obj.get("entries") or [], path)

    walk(tree["entries"], root)
    return texts

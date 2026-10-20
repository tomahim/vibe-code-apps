import base64

import requests

API = "https://api.github.com"


class GitHubError(Exception):
    pass


class Conflict(GitHubError):
    """The file changed between read and write (HTTP 409 or 422 sha mismatch)."""


class NotFound(GitHubError):
    pass


def _headers(token):
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def read_file(token, repo, branch, path):
    response = requests.get(
        f"{API}/repos/{repo}/contents/{path}",
        params={"ref": branch}, headers=_headers(token), timeout=15,
    )
    if response.status_code == 404:
        raise NotFound(path)
    if response.status_code != 200:
        raise GitHubError(f"GitHub read failed ({response.status_code}).")
    data = response.json()
    return base64.b64decode(data["content"]).decode("utf-8"), data["sha"]


def write_file(token, repo, branch, path, text, sha, message):
    response = requests.put(
        f"{API}/repos/{repo}/contents/{path}",
        headers=_headers(token), timeout=15,
        json={
            "message": message,
            "content": base64.b64encode(text.encode("utf-8")).decode("ascii"),
            "sha": sha,
            "branch": branch,
        },
    )
    if response.status_code in (409, 422):
        raise Conflict(path)
    if response.status_code not in (200, 201):
        raise GitHubError(f"GitHub write failed ({response.status_code}).")


def read_ratings(token, repo, branch, directory):
    """Read all idea ratings in one GitHub request, at one branch snapshot.

    Do not cache: a successful vote must be visible on the next page load.
    The token and markdown bodies never leave the API service.
    """
    from .frontmatter import get_rating

    owner, name = repo.split("/", 1)
    response = requests.post(
        f"{API}/graphql", headers=_headers(token), timeout=15,
        json={
            "query": """query($owner:String!,$name:String!,$expression:String!){
              repository(owner:$owner,name:$name){object(expression:$expression){
                ... on Tree {entries{name type object{... on Blob{text}}}}
              }}
            }""",
            "variables": {"owner": owner, "name": name, "expression": f"{branch}:{directory}"},
        },
    )
    if response.status_code != 200:
        raise GitHubError(f"GitHub ratings read failed ({response.status_code}).")
    data = response.json()
    if data.get("errors"):
        raise GitHubError("GitHub ratings query failed.")
    tree = ((data.get("data") or {}).get("repository") or {}).get("object")
    if not tree or "entries" not in tree:
        raise GitHubError("Idea directory not found.")
    ratings = {}
    for entry in tree["entries"]:
        if entry["type"] == "blob" and entry["name"].endswith(".md"):
            text = (entry.get("object") or {}).get("text")
            if text is None:
                raise GitHubError("Idea text not available.")
            ratings[entry["name"][:-3]] = get_rating(text)
    return ratings

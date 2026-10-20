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

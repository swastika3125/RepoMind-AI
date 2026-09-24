import os
import requests
import base64
from dotenv import load_dotenv

load_dotenv()

GITHUB_API_BASE = "https://api.github.com"

def get_headers():
    token = os.getenv("GITHUB_TOKEN", "").strip()
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "RepoMind-AI/1.0"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers

def parse_github_error(response, endpoint=""):
    status = response.status_code
    try:
        data = response.json()
        message = data.get("message", response.text)
    except Exception:
        message = response.text or "Unknown GitHub error"
    
    print(f"[GitHub API Error] Endpoint: {endpoint} | Status: {status} | Message: {message}")
    
    if status == 401:
        return f"GitHub Authentication failed (Status 401): {message}. Check your GITHUB_TOKEN."
    elif status == 403:
        if "rate limit" in message.lower():
            return "GitHub API rate limit exceeded (Status 403). Please add or verify GITHUB_TOKEN in backend/.env."
        return f"Access forbidden (Status 403): {message}"
    elif status == 404:
        return f"Repository or resource not found (Status 404): {message}. Check owner/repo name or verify it is public."
    elif status == 409:
        return f"Repository is empty or Git tree conflict (Status 409): {message}."
    else:
        return f"GitHub API Error (Status {status}): {message}"

def get_repository(owner: str, repo: str):
    """
    Retrieves repository metadata from GitHub.
    Returns: (dict, None) on success, or (None, error_str) on error.
    """
    endpoint = f"/repos/{owner}/{repo}"
    url = f"{GITHUB_API_BASE}{endpoint}"
    
    try:
        response = requests.get(url, headers=get_headers(), timeout=15)
    except requests.exceptions.RequestException as e:
        print(f"[Network Error] {e}")
        return None, f"Network error connecting to GitHub: {str(e)}"
    
    if response.status_code != 200:
        err = parse_github_error(response, endpoint)
        return None, err
        
    data = response.json()
    repo_info = {
        "name": data.get("name", repo),
        "full_name": data.get("full_name", f"{owner}/{repo}"),
        "description": data.get("description") or "No description provided.",
        "language": data.get("language") or "Not specified",
        "stars": data.get("stargazers_count", 0),
        "forks": data.get("forks_count", 0),
        "open_issues": data.get("open_issues_count", 0),
        "default_branch": data.get("default_branch", "main"),
        "url": data.get("html_url", f"https://github.com/{owner}/{repo}"),
        "owner": {
            "login": data.get("owner", {}).get("login", owner),
            "avatar_url": data.get("owner", {}).get("avatar_url", ""),
            "html_url": data.get("owner", {}).get("html_url", "")
        },
        "created_at": data.get("created_at"),
        "updated_at": data.get("updated_at"),
        "size_kb": data.get("size", 0),
        "is_private": data.get("private", False)
    }
    return repo_info, None

def get_repository_tree(owner: str, repo: str, default_branch: str = None):
    """
    Retrieves the recursive Git tree for the repository's default branch.
    Returns: (tree_items_list, None) on success, or (None, error_str) on error.
    """
    if not default_branch:
        repo_data, err = get_repository(owner, repo)
        if err:
            return None, err
        default_branch = repo_data.get("default_branch", "main")
        
    endpoint = f"/repos/{owner}/{repo}/git/trees/{default_branch}"
    url = f"{GITHUB_API_BASE}{endpoint}"
    
    try:
        response = requests.get(url, headers=get_headers(), params={"recursive": "1"}, timeout=20)
    except requests.exceptions.RequestException as e:
        print(f"[Network Error] {e}")
        return None, f"Network error retrieving repository tree: {str(e)}"
        
    if response.status_code != 200:
        err = parse_github_error(response, endpoint)
        return None, err
        
    data = response.json()
    raw_tree = data.get("tree", [])
    truncated = data.get("truncated", False)
    
    tree_items = []
    for item in raw_tree:
        tree_items.append({
            "path": item.get("path"),
            "mode": item.get("mode"),
            "type": item.get("type"),
            "size": item.get("size", 0),
            "sha": item.get("sha")
        })
        
    return {
        "tree": tree_items,
        "default_branch": default_branch,
        "truncated": truncated
    }, None

def get_file_content(owner: str, repo: str, path: str, ref: str = None):
    """
    Retrieves the content of a single file in the repository.
    Returns: (file_dict, None) or (None, error_str)
    """
    endpoint = f"/repos/{owner}/{repo}/contents/{path}"
    url = f"{GITHUB_API_BASE}{endpoint}"
    params = {}
    if ref:
        params["ref"] = ref
        
    try:
        response = requests.get(url, headers=get_headers(), params=params, timeout=15)
    except requests.exceptions.RequestException as e:
        return None, f"Network error reading file: {str(e)}"
        
    if response.status_code != 200:
        err = parse_github_error(response, endpoint)
        return None, err
        
    data = response.json()
    if data.get("type") != "file":
        return None, f"Path '{path}' is not a regular file (type: {data.get('type')})"
        
    raw_content = data.get("content", "")
    encoding = data.get("encoding", "")
    
    decoded_text = ""
    if encoding == "base64" and raw_content:
        try:
            decoded_text = base64.b64decode(raw_content).decode("utf-8", errors="replace")
        except Exception as e:
            return None, f"Could not decode file content: {str(e)}"
    else:
        decoded_text = raw_content
        
    return {
        "path": data.get("path", path),
        "name": data.get("name"),
        "size": data.get("size", 0),
        "content": decoded_text
    }, None

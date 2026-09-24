import re

def parse_github_url(url: str):
    """
    Extracts owner and repo from a GitHub repository URL or string like 'owner/repo'.
    Supports:
      - https://github.com/owner/repo
      - https://github.com/owner/repo.git
      - http://github.com/owner/repo/
      - github.com/owner/repo
      - owner/repo
    Returns (owner, repo) tuple or (None, None) if invalid.
    """
    if not url or not isinstance(url, str):
        return None, None
    
    url = url.strip()
    
    # Remove trailing slash and .git suffix
    if url.endswith(".git"):
        url = url[:-4]
    url = url.rstrip("/")
    
    # Pattern for https://github.com/owner/repo or github.com/owner/repo
    pattern = r"^(?:https?://)?(?:www\.)?github\.com/([a-zA-Z0-9_\-\.]+)/([a-zA-Z0-9_\-\.]+)/?$"
    match = re.match(pattern, url)
    if match:
        return match.group(1), match.group(2)
    
    # Pattern for shorthand owner/repo
    short_pattern = r"^([a-zA-Z0-9_\-\.]+)/([a-zA-Z0-9_\-\.]+)$"
    short_match = re.match(short_pattern, url)
    if short_match:
        return short_match.group(1), short_match.group(2)
        
    return None, None

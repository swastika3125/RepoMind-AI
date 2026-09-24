import os

IMPORTANT_FILES = [
    "README.md",
    "package.json",
    "requirements.txt",
    "pyproject.toml",
    "setup.py",
    "Dockerfile",
    "docker-compose.yml",
    "app.py",
    "main.py",
    "server.js",
    "index.js",
    "index.html",
    "vite.config.js",
    "webpack.config.js",
    "Cargo.toml",
    "go.mod",
    "pom.xml",
    "build.gradle"
]

IGNORED_DIRECTORIES = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "__pycache__",
    ".next",
    ".nuxt",
    ".venv",
    "venv",
    "env",
    "coverage",
    ".idea",
    ".vscode",
    ".pytest_cache",
    ".mypy_cache",
    "vendor",
    "target"
}

BINARY_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".ico", ".svg",
    ".mp4", ".mp3", ".wav", ".avi", ".mov",
    ".zip", ".tar", ".gz", ".rar", ".7z",
    ".exe", ".dll", ".so", ".dylib", ".bin",
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    ".pyc", ".pyo", ".pyd", ".class", ".o", ".a",
    ".lock", ".wasm", ".sqlite", ".sqlite3", ".db"
}

SOURCE_EXTENSIONS = {
    ".py", ".js", ".jsx", ".ts", ".tsx",
    ".html", ".css", ".scss", ".sass", ".less",
    ".json", ".md", ".txt", ".sql",
    ".java", ".c", ".cpp", ".h", ".hpp",
    ".go", ".rs", ".php", ".rb", ".sh",
    ".yaml", ".yml", ".toml", ".xml"
}

MAX_FILE_SIZE_BYTES = 100 * 1024  # 100 KB limit for AI processing

def is_ignored_path(path: str) -> bool:
    normalized = path.replace("\\", "/").strip("/")
    parts = normalized.split("/")
    
    # Check directory names
    for part in parts[:-1]:
        if part.lower() in IGNORED_DIRECTORIES or part.startswith("."):
            return True
            
    # Check filename
    filename = parts[-1].lower()
    if filename.startswith(".env") or filename == ".ds_store" or filename == "thumbs.db":
        return True
        
    return False

def get_file_extension(path: str) -> str:
    _, ext = os.path.splitext(path)
    return ext.lower()

def is_binary_file(path: str) -> bool:
    ext = get_file_extension(path)
    return ext in BINARY_EXTENSIONS

def select_files(tree_items: list, max_files: int = 40):
    """
    Filters repository tree items to find key architectural and source code files.
    Prioritizes important configuration/entry files, then source files.
    """
    selected = []
    seen = set()
    
    # 1. First priority: Important configuration & entry files
    for item in tree_items:
        if item.get("type") != "blob":
            continue
        path = item.get("path", "")
        if is_ignored_path(path) or is_binary_file(path):
            continue
            
        filename = path.split("/")[-1]
        if filename in IMPORTANT_FILES:
            if path not in seen and len(selected) < max_files:
                selected.append(path)
                seen.add(path)
                
    # 2. Second priority: Source code files up to max_files
    for item in tree_items:
        if len(selected) >= max_files:
            break
        if item.get("type") != "blob":
            continue
            
        path = item.get("path", "")
        if path in seen:
            continue
            
        if is_ignored_path(path) or is_binary_file(path):
            continue
            
        ext = get_file_extension(path)
        if ext in SOURCE_EXTENSIONS:
            size = item.get("size", 0)
            if size <= MAX_FILE_SIZE_BYTES:
                selected.append(path)
                seen.add(path)
                
    return selected

def build_tree_structure(tree_items: list):
    """
    Converts a flat list of GitHub git tree items into a nested JSON hierarchy
    for collapsible rendering in the React frontend.
    """
    root = {"name": "root", "type": "folder", "children": {}}
    
    for item in tree_items:
        path = item.get("path", "")
        if not path:
            continue
        parts = path.split("/")
        current = root
        
        for i, part in enumerate(parts):
            is_last = (i == len(parts) - 1)
            item_type = item.get("type", "blob")
            
            if is_last:
                if item_type == "tree":
                    if part not in current["children"]:
                        current["children"][part] = {"name": part, "path": path, "type": "folder", "children": {}}
                else:
                    current["children"][part] = {
                        "name": part,
                        "path": path,
                        "type": "file",
                        "size": item.get("size", 0),
                        "extension": get_file_extension(part)
                    }
            else:
                if part not in current["children"]:
                    current["children"][part] = {
                        "name": part,
                        "path": "/".join(parts[:i+1]),
                        "type": "folder",
                        "children": {}
                    }
                current = current["children"][part]
                
    def format_node(node):
        if node.get("type") == "file":
            return {
                "name": node["name"],
                "path": node.get("path"),
                "type": "file",
                "size": node.get("size", 0),
                "extension": node.get("extension", "")
            }
        children_list = [format_node(child) for child in node.get("children", {}).values()]
        children_list.sort(key=lambda x: (0 if x["type"] == "folder" else 1, x["name"].lower()))
        return {
            "name": node["name"],
            "path": node.get("path", ""),
            "type": "folder",
            "children": children_list
        }
        
    return format_node(root)["children"]

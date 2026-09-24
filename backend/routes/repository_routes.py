from flask import Blueprint, request, jsonify
from utils.parser import parse_github_url
from utils.helpers import api_error
from services.github_service import get_repository, get_repository_tree, get_file_content
from services.repository_service import build_tree_structure, select_files

repository_bp = Blueprint('repository_bp', __name__)

def resolve_owner_and_repo():
    url = request.args.get('url')
    owner = request.args.get('owner')
    repo = request.args.get('repo')
    
    if url:
        p_owner, p_repo = parse_github_url(url)
        if p_owner and p_repo:
            return p_owner, p_repo, None
        return None, None, "Invalid GitHub URL format. Example: https://github.com/facebook/react"
        
    if owner and repo:
        return owner.strip(), repo.strip(), None
        
    return None, None, "Provide either a 'url' query parameter or both 'owner' and 'repo'."

@repository_bp.route('/api/repository', methods=['GET'])
def get_repo_details():
    owner, repo, err = resolve_owner_and_repo()
    if err:
        return api_error(err, status_code=400)
        
    repo_data, error_msg = get_repository(owner, repo)
    if error_msg:
        status_code = 404 if "404" in error_msg else 400
        if "403" in error_msg:
            status_code = 403
        return api_error(error_msg, status_code=status_code)
        
    return jsonify(repo_data), 200

@repository_bp.route('/api/repository/tree', methods=['GET'])
def get_repo_tree():
    owner, repo, err = resolve_owner_and_repo()
    if err:
        return api_error(err, status_code=400)
        
    tree_result, error_msg = get_repository_tree(owner, repo)
    if error_msg:
        return api_error(error_msg, status_code=404)
        
    flat_tree = tree_result.get('tree', [])
    nested_tree = build_tree_structure(flat_tree)
    
    return jsonify({
        "owner": owner,
        "repository": repo,
        "default_branch": tree_result.get('default_branch'),
        "total_files": len(flat_tree),
        "truncated": tree_result.get('truncated', False),
        "tree": nested_tree,
        "raw_items": flat_tree
    }), 200

@repository_bp.route('/api/repository/file', methods=['GET'])
def get_file():
    owner, repo, err = resolve_owner_and_repo()
    if err:
        return api_error(err, status_code=400)
        
    path = request.args.get('path')
    if not path:
        return api_error("File path is required ('path' parameter).", status_code=400)
        
    file_data, error_msg = get_file_content(owner, repo, path)
    if error_msg:
        return api_error(error_msg, status_code=404)
        
    return jsonify(file_data), 200

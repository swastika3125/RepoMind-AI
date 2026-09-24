from flask import Blueprint, request, jsonify
from utils.parser import parse_github_url
from utils.helpers import api_error, api_response
from services.github_service import get_repository, get_repository_tree, get_file_content
from services.repository_service import select_files, build_tree_structure
from services.rag_service import index_repository_files
from services.ai_service import (
    generate_repository_summary,
    analyze_repository_code,
    generate_repository_architecture,
    generate_readme,
    generate_documentation
)

analysis_bp = Blueprint('analysis_bp', __name__)

def extract_owner_repo_from_body(data):
    if not data:
        return None, None, "Request body must be valid JSON."
        
    url = data.get('url')
    owner = data.get('owner')
    repo = data.get('repo')
    
    if url:
        p_owner, p_repo = parse_github_url(url)
        if p_owner and p_repo:
            return p_owner, p_repo, None
        return None, None, "Invalid GitHub URL format."
        
    if owner and repo:
        return owner.strip(), repo.strip(), None
        
    return None, None, "Please provide 'url' or both 'owner' and 'repo'."

@analysis_bp.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json(silent=True)
    owner, repo, err = extract_owner_repo_from_body(data)
    if err:
        return api_error(err, status_code=400)
        
    # 1. Fetch Repository Metadata
    repo_data, error_msg = get_repository(owner, repo)
    if error_msg:
        status = 404 if "404" in error_msg else 400
        if "403" in error_msg:
            status = 403
        return api_error(error_msg, status_code=status)
        
    # 2. Fetch Recursive Git Tree
    tree_result, error_msg = get_repository_tree(owner, repo, repo_data.get('default_branch'))
    if error_msg:
        return api_error(error_msg, status_code=404)
        
    flat_tree = tree_result.get('tree', [])
    nested_tree = build_tree_structure(flat_tree)
    
    # 3. Filter files for RAG & AI analysis
    selected_paths = select_files(flat_tree, max_files=35)
    
    # 4. Fetch content for selected files
    retrieved_files = []
    for path in selected_paths:
        file_data, f_err = get_file_content(owner, repo, path)
        if file_data and not f_err:
            retrieved_files.append(file_data)
            
    # 5. Index into ChromaDB vector database
    indexing_stats = {}
    try:
        indexing_stats = index_repository_files(owner, repo, retrieved_files)
    except Exception as e:
        print(f"[ChromaDB Warning] {e}")
        indexing_stats = {"warning": f"Vector indexing encountered an issue: {str(e)}"}
        
    # 6. Generate AI Summary, Code Analysis & Architecture
    summary, s_err = generate_repository_summary(repo_data, flat_tree)
    code_insights, c_err = analyze_repository_code(repo_data, retrieved_files)
    architecture, a_err = generate_repository_architecture(repo_data, retrieved_files)
    
    ai_errors = []
    if s_err:
        ai_errors.append(s_err)
    if c_err:
        ai_errors.append(c_err)
    if a_err:
        ai_errors.append(a_err)
        
    return jsonify({
        "success": True,
        "repository": repo_data,
        "tree": nested_tree,
        "stats": {
            "total_files": len(flat_tree),
            "analyzed_files": len(retrieved_files),
            "default_branch": repo_data.get('default_branch'),
            "vector_chunks": indexing_stats.get('total_chunks', 0)
        },
        "summary": summary,
        "code_insights": code_insights,
        "architecture": architecture,
        "ai_errors": ai_errors if ai_errors else None
    }), 200

@analysis_bp.route('/api/generate-readme', methods=['POST'])
def handle_generate_readme():
    data = request.get_json(silent=True)
    owner, repo, err = extract_owner_repo_from_body(data)
    if err:
        return api_error(err, status_code=400)
        
    repo_data, error_msg = get_repository(owner, repo)
    if error_msg:
        return api_error(error_msg, status_code=404)
        
    tree_result, error_msg = get_repository_tree(owner, repo, repo_data.get('default_branch'))
    if error_msg:
        return api_error(error_msg, status_code=404)
        
    flat_tree = tree_result.get('tree', [])
    selected_paths = select_files(flat_tree, max_files=20)
    
    retrieved_files = []
    for path in selected_paths:
        file_data, f_err = get_file_content(owner, repo, path)
        if file_data and not f_err:
            retrieved_files.append(file_data)
            
    readme_content, ai_err = generate_readme(repo_data, flat_tree, retrieved_files)
    if ai_err:
        return api_error(ai_err, status_code=500)
        
    return jsonify({
        "success": True,
        "readme": readme_content
    }), 200

@analysis_bp.route('/api/generate-documentation', methods=['POST'])
def handle_generate_documentation():
    data = request.get_json(silent=True)
    owner, repo, err = extract_owner_repo_from_body(data)
    if err:
        return api_error(err, status_code=400)
        
    repo_data, error_msg = get_repository(owner, repo)
    if error_msg:
        return api_error(error_msg, status_code=404)
        
    tree_result, error_msg = get_repository_tree(owner, repo, repo_data.get('default_branch'))
    if error_msg:
        return api_error(error_msg, status_code=404)
        
    flat_tree = tree_result.get('tree', [])
    selected_paths = select_files(flat_tree, max_files=20)
    
    retrieved_files = []
    for path in selected_paths:
        file_data, f_err = get_file_content(owner, repo, path)
        if file_data and not f_err:
            retrieved_files.append(file_data)
            
    doc_content, ai_err = generate_documentation(repo_data, flat_tree, retrieved_files)
    if ai_err:
        return api_error(ai_err, status_code=500)
        
    return jsonify({
        "success": True,
        "documentation": doc_content
    }), 200

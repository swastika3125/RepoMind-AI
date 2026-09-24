from flask import Blueprint, request, jsonify
from utils.helpers import api_error
from utils.parser import parse_github_url
from services.github_service import get_repository
from services.rag_service import query_repository_context
from services.ai_service import chat_with_repository

chat_bp = Blueprint('chat_bp', __name__)

@chat_bp.route('/api/chat', methods=['POST'])
def handle_chat():
    data = request.get_json(silent=True)
    if not data:
        return api_error("Request body must be valid JSON.", status_code=400)
        
    query = data.get('message', '').strip()
    if not query:
        return api_error("Chat message is required.", status_code=400)
        
    owner = data.get('owner')
    repo = data.get('repo')
    url = data.get('url')
    
    if url and (not owner or not repo):
        p_owner, p_repo = parse_github_url(url)
        if p_owner and p_repo:
            owner, repo = p_owner, p_repo
            
    if not owner or not repo:
        return api_error("Repository owner and repo name are required.", status_code=400)
        
    history = data.get('history', [])
    
    # 1. Fetch basic repository metadata
    repo_data, err = get_repository(owner, repo)
    if err:
        repo_data = {"full_name": f"{owner}/{repo}", "language": "Unknown", "description": ""}
        
    # 2. Retrieve relevant code chunks from ChromaDB RAG
    context_chunks = []
    try:
        context_chunks = query_repository_context(owner, repo, query, top_k=6)
    except Exception as e:
        print(f"[RAG Retrieval Warning] {e}")
        
    # 3. Call AI with retrieved context
    response_data, ai_err = chat_with_repository(
        query=query,
        repo_metadata=repo_data,
        context_chunks=context_chunks,
        conversation_history=history
    )
    
    if ai_err:
        return api_error(ai_err, status_code=500)
        
    return jsonify({
        "success": True,
        "answer": response_data.get("answer"),
        "sources": response_data.get("sources", [])
    }), 200

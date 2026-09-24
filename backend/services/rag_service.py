import os
import re
import chromadb
from chromadb.config import Settings

CHROMA_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "chroma")
os.makedirs(CHROMA_DATA_DIR, exist_ok=True)

_chroma_client = None

def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(path=CHROMA_DATA_DIR)
    return _chroma_client

def chunk_text(text: str, chunk_size: int = 1200, overlap: int = 200):
    """
    Splits text or code into overlapping chunks respecting line boundaries.
    """
    if not text:
        return []
    lines = text.splitlines(keepends=True)
    chunks = []
    current_chunk = []
    current_len = 0
    
    for line in lines:
        current_chunk.append(line)
        current_len += len(line)
        if current_len >= chunk_size:
            chunk_str = "".join(current_chunk)
            chunks.append(chunk_str)
            overlap_chunk = []
            overlap_len = 0
            for prev_line in reversed(current_chunk):
                overlap_chunk.insert(0, prev_line)
                overlap_len += len(prev_line)
                if overlap_len >= overlap:
                    break
            current_chunk = overlap_chunk
            current_len = overlap_len
            
    if current_chunk:
        chunk_str = "".join(current_chunk)
        if not chunks or chunks[-1] != chunk_str:
            chunks.append(chunk_str)
            
    return chunks

def sanitize_collection_name(name: str) -> str:
    """ChromaDB collection names must be 3-63 chars, alphanumeric, dots, dashes, underscores."""
    clean = re.sub(r'[^a-zA-Z0-9_\-]', '_', name)
    if len(clean) < 3:
        clean = f"repo_{clean}"
    return clean[:63]

def index_repository_files(owner: str, repo: str, files: list):
    """
    Indexes retrieved repository files into a ChromaDB vector collection.
    files: list of dicts with {'path': ..., 'content': ..., 'size': ...}
    """
    client = get_chroma_client()
    collection_name = sanitize_collection_name(f"{owner}_{repo}")
    
    # Delete existing collection to refresh
    try:
        client.delete_collection(name=collection_name)
    except Exception:
        pass
        
    collection = client.create_collection(
        name=collection_name,
        metadata={"owner": owner, "repo": repo, "hnsw:space": "cosine"}
    )
    
    documents = []
    metadatas = []
    ids = []
    
    doc_id_counter = 0
    for f in files:
        path = f.get('path', 'unknown')
        content = f.get('content', '')
        if not content:
            continue
            
        chunks = chunk_text(content)
        for i, chunk in enumerate(chunks):
            doc_id = f"{path}#chunk_{i}_{doc_id_counter}"
            documents.append(f"File: {path}\n\n{chunk}")
            metadatas.append({"path": path, "chunk_index": i, "owner": owner, "repo": repo})
            ids.append(doc_id)
            doc_id_counter += 1
            
    if documents:
        batch_size = 100
        for i in range(0, len(documents), batch_size):
            collection.add(
                documents=documents[i:i+batch_size],
                metadatas=metadatas[i:i+batch_size],
                ids=ids[i:i+batch_size]
            )
            
    return {
        "indexed_files": len(files),
        "total_chunks": len(documents),
        "collection_name": collection_name
    }

def query_repository_context(owner: str, repo: str, query: str, top_k: int = 5):
    """
    Retrieves the most relevant code chunks for a given user question or task.
    """
    client = get_chroma_client()
    collection_name = sanitize_collection_name(f"{owner}_{repo}")
    
    try:
        collection = client.get_collection(name=collection_name)
    except Exception:
        return []
        
    results = collection.query(
        query_texts=[query],
        n_results=min(top_k, max(1, collection.count()))
    )
    
    retrieved = []
    if results and "documents" in results and results["documents"]:
        docs = results["documents"][0]
        metas = results["metadatas"][0] if "metadatas" in results and results["metadatas"] else [{}] * len(docs)
        distances = results["distances"][0] if "distances" in results and results["distances"] else [0] * len(docs)
        
        for doc, meta, dist in zip(docs, metas, distances):
            retrieved.append({
                "document": doc,
                "path": meta.get("path", ""),
                "distance": dist
            })
            
    return retrieved

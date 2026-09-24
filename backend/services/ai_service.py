import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return None
    return OpenAI(api_key=api_key)

def get_model_name():
    return os.getenv("OPENAI_MODEL", "gpt-4o-mini")

def check_ai_availability():
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return False, "OPENAI_API_KEY is not configured in backend/.env. Please add your API key to enable AI features."
    return True, None

def generate_repository_summary(repo_metadata: dict, files_summary_list: list):
    is_ready, err = check_ai_availability()
    if not is_ready:
        return None, err
        
    client = get_openai_client()
    model = get_model_name()
    
    files_context = "\n".join([f"- {f['path']} ({f.get('size', 0)} bytes)" for f in files_summary_list[:50]])
    
    system_prompt = """You are an expert software architect and code reviewer.
Analyze the provided GitHub repository metadata and file list.
Generate a structured, insightful summary of the project.
Do NOT invent files or technologies that are not present.

Your response must be in valid JSON format with the following keys:
{
  "overview": "High-level explanation of what this repository does",
  "main_purpose": "The primary problem this software solves",
  "major_features": ["Feature 1", "Feature 2"],
  "tech_stack": {
    "languages": ["Language 1"],
    "frameworks": ["Framework 1"],
    "tools_and_libraries": ["Tool 1"],
    "build_and_deploy": ["Tool 1"]
  },
  "architecture_type": "e.g. Microservices, Monolith, Full-Stack SPA, Library, CLI Tool, etc.",
  "important_components": [
    {"name": "Component/File", "description": "Role in the system"}
  ]
}
"""
    
    user_prompt = f"""Repository Name: {repo_metadata.get('full_name')}
Description: {repo_metadata.get('description')}
Primary Language: {repo_metadata.get('language')}
Stars: {repo_metadata.get('stars')}, Forks: {repo_metadata.get('forks')}

Repository Structure / Relevant Files:
{files_context}
"""

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=1500
        )
        content = response.choices[0].message.content
        return json.loads(content), None
    except Exception as e:
        return None, f"OpenAI API Error: {str(e)}"

def analyze_repository_code(repo_metadata: dict, sample_code_files: list):
    is_ready, err = check_ai_availability()
    if not is_ready:
        return None, err
        
    client = get_openai_client()
    model = get_model_name()
    
    code_snippets = ""
    for f in sample_code_files[:8]:
        code_snippets += f"\n--- File: {f['path']} ---\n{f['content'][:1500]}\n"
        
    system_prompt = """You are a principal engineer performing a thorough codebase analysis.
Analyze the provided code snippets and repository structure.
Clearly distinguish between WHAT WAS FOUND in the repository and SUGGESTED IMPROVEMENTS.
Be accurate and ground your findings strictly in the provided code.

Return a valid JSON object with the following schema:
{
  "code_organization": {"found": "...", "suggestions": "..."},
  "architecture": {"found": "...", "suggestions": "..."},
  "separation_of_concerns": {"found": "...", "suggestions": "..."},
  "reusability": {"found": "...", "suggestions": "..."},
  "error_handling": {"found": "...", "suggestions": "..."},
  "documentation": {"found": "...", "suggestions": "..."},
  "testing": {"found": "...", "suggestions": "..."},
  "configuration": {"found": "...", "suggestions": "..."},
  "api_and_data": {"found": "...", "suggestions": "..."},
  "security_and_auth": {"found": "...", "suggestions": "..."}
}
"""

    user_prompt = f"""Repository: {repo_metadata.get('full_name')}
Description: {repo_metadata.get('description')}
Language: {repo_metadata.get('language')}

Code Samples:
{code_snippets}
"""

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=2000
        )
        content = response.choices[0].message.content
        return json.loads(content), None
    except Exception as e:
        return None, f"OpenAI API Error: {str(e)}"

def generate_repository_architecture(repo_metadata: dict, sample_code_files: list):
    is_ready, err = check_ai_availability()
    if not is_ready:
        return None, err
        
    client = get_openai_client()
    model = get_model_name()
    
    file_list = "\n".join([f["path"] for f in sample_code_files[:30]])
    
    system_prompt = """You are a systems architect.
Analyze the repository components and generate an architecture breakdown and data flow.
Return valid JSON with:
{
  "frontend": "Description of frontend components or 'None found'",
  "backend": "Description of backend components or 'None found'",
  "database": "Description of database / storage or 'None found'",
  "external_apis": "Description of third-party APIs used or 'None found'",
  "authentication": "Description of auth mechanisms or 'None found'",
  "ai_components": "Description of any AI/ML models/services or 'None found'",
  "data_flow": "Step-by-step data flow from user request to response",
  "mermaid_diagram": "graph TD\\n..."
}
Ensure mermaid_diagram uses valid Mermaid flowchart syntax without markdown code blocks.
"""

    user_prompt = f"""Repository: {repo_metadata.get('full_name')}
Language: {repo_metadata.get('language')}
Files:
{file_list}
"""

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=1500
        )
        content = response.choices[0].message.content
        return json.loads(content), None
    except Exception as e:
        return None, f"OpenAI API Error: {str(e)}"

def chat_with_repository(query: str, repo_metadata: dict, context_chunks: list, conversation_history: list = None):
    is_ready, err = check_ai_availability()
    if not is_ready:
        return None, err
        
    client = get_openai_client()
    model = get_model_name()
    
    context_str = ""
    if context_chunks:
        for idx, item in enumerate(context_chunks):
            doc = item.get('document', '')
            path = item.get('path', '')
            context_str += f"\n--- Context [{idx+1}] File: {path} ---\n{doc}\n"
    else:
        context_str = "No specific code files matched the query in the vector store."
        
    system_prompt = f"""You are RepoMind AI, an intelligent coding assistant specifically grounded in the GitHub repository: {repo_metadata.get('full_name')}.
Primary Language: {repo_metadata.get('language')}.
Description: {repo_metadata.get('description')}.

Rules:
1. Ground your answers strictly on the repository context and files provided below.
2. When referencing files, functions, or configurations, mention their exact paths.
3. If the answer cannot be determined or found in the provided context or repository knowledge, clearly reply:
   "I couldn't find enough information about this in the repository."
4. Do NOT hallucinate dependencies, endpoints, or files that do not exist.
5. Provide clear, professional, developer-friendly explanations with relevant code examples if helpful.

Retrieved Repository Context:
{context_str}
"""

    messages = [{"role": "system", "content": system_prompt}]
    
    if conversation_history:
        for msg in conversation_history[-6:]:
            role = "assistant" if msg.get("sender") == "ai" else "user"
            messages.append({"role": role, "content": msg.get("text", "")})
            
    messages.append({"role": "user", "content": query})
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.2,
            max_tokens=1200
        )
        answer = response.choices[0].message.content
        return {"answer": answer, "sources": [c.get('path') for c in context_chunks if c.get('path')]}, None
    except Exception as e:
        return None, f"OpenAI API Error: {str(e)}"

def generate_readme(repo_metadata: dict, files_summary: list, sample_code_files: list):
    is_ready, err = check_ai_availability()
    if not is_ready:
        return None, err
        
    client = get_openai_client()
    model = get_model_name()
    
    files_str = "\n".join([f["path"] for f in sample_code_files[:25]])
    
    system_prompt = """You are a technical documentation specialist.
Generate a comprehensive, production-ready README.md for this repository.
The README must include:
# Project Title
## Overview
## Features
## Tech Stack
## Installation
## Configuration (Environment Variables)
## Project Structure
## Usage
## API Documentation (if applicable)
## Future Improvements
## Author & License

Use GitHub-flavored markdown with badges, code blocks, and structured lists.
Only mention technologies, scripts, and endpoints that actually exist in the codebase.
Return ONLY markdown content.
"""

    user_prompt = f"""Repository: {repo_metadata.get('full_name')}
Description: {repo_metadata.get('description')}
Primary Language: {repo_metadata.get('language')}
Files in repository:
{files_str}
"""

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=2500
        )
        return response.choices[0].message.content, None
    except Exception as e:
        return None, f"OpenAI API Error: {str(e)}"

def generate_documentation(repo_metadata: dict, files_summary: list, sample_code_files: list):
    is_ready, err = check_ai_availability()
    if not is_ready:
        return None, err
        
    client = get_openai_client()
    model = get_model_name()
    
    files_str = "\n".join([f["path"] for f in sample_code_files[:25]])
    
    system_prompt = """You are a lead software architect writing technical system documentation.
Generate detailed technical documentation for this repository covering:
# Technical Architecture & System Documentation
1. Project Overview & Business Value
2. Architecture & Design Decisions
3. Core Features Breakdown
4. Technology Stack & Dependencies
5. Folder & Module Hierarchy
6. Setup, Local Installation & Build Pipeline
7. Environment Configuration
8. API Endpoints & Interfaces
9. How the Application Works (End-to-End Execution Flow)
10. Testing, Quality & Security Considerations
11. Recommended Future Improvements

Ground everything in the actual repository files.
Return markdown formatted documentation.
"""

    user_prompt = f"""Repository: {repo_metadata.get('full_name')}
Description: {repo_metadata.get('description')}
Primary Language: {repo_metadata.get('language')}
Files in repository:
{files_str}
"""

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=3000
        )
        return response.choices[0].message.content, None
    except Exception as e:
        return None, f"OpenAI API Error: {str(e)}"

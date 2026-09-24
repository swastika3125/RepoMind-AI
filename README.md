# RepoMind AI — AI-Powered GitHub Repository Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![Flask: 3.x](https://img.shields.io/badge/Flask-3.x-green.svg)](https://flask.palletsprojects.com/)
[![React: 19.x](https://img.shields.io/badge/React-19.x-cyan.svg)](https://react.dev/)
[![Vite: 8.x](https://img.shields.io/badge/Vite-8.x-purple.svg)](https://vitejs.dev/)
[![ChromaDB](https://img.shields.io/badge/RAG-ChromaDB-orange.svg)](https://www.trychroma.com/)

**RepoMind AI** is an intelligent, full-stack GitHub repository comprehension engine. Powered by the GitHub REST API, ChromaDB vector indexing (RAG), and Large Language Models, RepoMind AI converts any public repository into an interactive, structured dashboard with architectural breakdowns, deep code insights, and an AI chat grounded in the repository's files.

---

## 🌟 Key Features

1. **Repository Intelligence & Stats**:
   - Fetches live repository metadata, stars, forks, open issues, default branch, and file counts dynamically via GitHub API.
2. **Interactive File Tree Explorer**:
   - Collapsible hierarchical tree view with instantaneous file search and in-browser code viewer modal.
3. **AI Project Summary**:
   - Generates high-level project overviews, primary purposes, detected tech stacks, and core components.
4. **Code Quality & Architecture Analysis**:
   - Evaluates code organization, separation of concerns, reusability, error handling, documentation, and security.
   - Strictly separates **What Was Found** from **Suggested Improvements**.
5. **RAG-Powered Repository Chat**:
   - Vectorizes source code using ChromaDB to answer user questions grounded strictly in the codebase without hallucinations.
6. **Automated README Generator**:
   - Single-click production-grade Markdown README generator with copy and download functionality.
7. **System Documentation Generator**:
   - Generates comprehensive technical documentation covering data flow, APIs, and module hierarchies.

---

## 🏗️ Architecture

```text
                  ┌──────────────────────┐
                  │      React UI        │
                  │   Vite + CSS3        │
                  └──────────┬───────────┘
                             │
                             │ REST API (JSON)
                             ↓
                  ┌──────────────────────┐
                  │     Flask Backend    │
                  │       Python 3       │
                  └───────┬───────┬──────┘
                          │       │
                          │       │
                          ↓       ↓
                 ┌──────────┐   ┌──────────┐
                 │ GitHub   │   │ GenAI    │
                 │ API v3   │   │ OpenAI   │
                 └────┬─────┘   └────┬─────┘
                      │              │
                      ↓              │
               Repository Code       │
                      │              │
                      ↓              │
                 ┌──────────────────┐│
                 │    ChromaDB      ││
                 │   Vector Store   ││
                 └────────┬─────────┘│
                          │          │
                          ↓          ↓
                  RAG Retrieved Context
                          │
                          ↓
                  AI Repository Chat
```

---

## 📁 Project Structure

```text
RepoMind-AI/
│
├── backend/
│   ├── app.py                     # Flask application entry point & CORS
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # Local secrets (ignored by Git)
│   ├── .env.example               # Environment template
│   ├── .gitignore                 # Backend-specific ignore rules
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── repository_routes.py   # /api/repository, /tree, /file
│   │   ├── analysis_routes.py     # /api/analyze, /generate-readme, /generate-docs
│   │   └── chat_routes.py         # /api/chat
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── github_service.py      # GitHub REST API client & error handling
│   │   ├── ai_service.py          # LLM completions for summary, code, & chat
│   │   ├── rag_service.py         # ChromaDB chunking, indexing, & retrieval
│   │   └── repository_service.py  # File filtering & hierarchy tree builder
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── parser.py              # GitHub URL parser & normalizer
│   │   └── helpers.py             # Response helpers & error formatters
│   │
│   └── data/                      # Persistent ChromaDB storage (ignored)
│
├── frontend/
│   ├── package.json               # Frontend dependencies & scripts
│   ├── vite.config.js             # Vite configuration
│   ├── index.html                 # HTML template with Google Fonts
│   ├── .env.example               # Frontend environment template
│   │
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx         # Header & backend status monitor
│       │   ├── Footer.jsx         # Footer
│       │   ├── LoadingScreen.jsx  # Multi-step progress animation
│       │   ├── StatCard.jsx       # Glassmorphic statistic cards
│       │   ├── TreeViewer.jsx     # Expandable file tree viewer
│       │   ├── CodeViewerModal.jsx# File source code modal viewer
│       │   └── dashboard/
│       │       ├── OverviewTab.jsx
│       │       ├── CodeAnalysisTab.jsx
│       │       ├── ArchitectureTab.jsx
│       │       ├── ChatTab.jsx
│       │       ├── ReadmeTab.jsx
│       │       └── DocumentationTab.jsx
│       ├── pages/
│       │   ├── Home.jsx           # Landing page with hero & input
│       │   ├── Dashboard.jsx      # Main analysis dashboard
│       │   └── About.jsx          # Project documentation & architecture
│       ├── services/
│       │   └── api.js             # Centralized Axios API client
│       ├── App.jsx                # React Router routing
│       ├── main.jsx               # React entry point
│       └── index.css              # Dark-mode glassmorphic design system
│
├── README.md                      # Project documentation
├── .gitignore                     # Git ignore rules
└── LICENSE                        # MIT License
```

---

## 🚀 Quickstart Guide (Windows PowerShell)

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**
- **Git**

---

### 2. Backend Setup

Open a PowerShell terminal and navigate to the project directory:

```powershell
cd "C:\Users\KIIT0001\OneDrive\Desktop\FullStackProject\RepoMind-AI\backend"
```

Create and activate the virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install backend dependencies:

```powershell
pip install -r requirements.txt
```

Configure your environment file:

```powershell
Copy-Item .env.example .env
```

Edit `backend/.env` with your API keys:

```env
GITHUB_TOKEN=your_personal_access_token_optional_but_recommended
OPENAI_API_KEY=your_openai_api_key_here
```

Start the Flask backend server:

```powershell
python app.py
```

The backend server runs at `http://127.0.0.1:5000`.

---

### 3. Frontend Setup

Open a second PowerShell terminal:

```powershell
cd "C:\Users\KIIT0001\OneDrive\Desktop\FullStackProject\RepoMind-AI\frontend"
```

Install frontend dependencies:

```powershell
npm install
```

Configure frontend environment (optional):

```powershell
Copy-Item .env.example .env
```

Start the Vite development server:

```powershell
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Backend index & status check |
| `GET` | `/api/health` | Health check & configured service status |
| `GET` | `/api/repository?owner={owner}&repo={repo}` | Fetches repository metadata |
| `GET` | `/api/repository/tree?owner={owner}&repo={repo}` | Retrieves recursive file tree |
| `GET` | `/api/repository/file?owner={owner}&repo={repo}&path={path}` | Retrieves source code of a file |
| `POST` | `/api/analyze` | Full repository ingestion, RAG indexing & analysis |
| `POST` | `/api/chat` | RAG-grounded AI chat with repository context |
| `POST` | `/api/generate-readme` | Generates comprehensive README.md |
| `POST` | `/api/generate-documentation` | Generates full technical system documentation |

---

## 🔒 Security Principles

1. **No Code Execution**: RepoMind AI is an analyzer; it never executes downloaded repository files or scripts.
2. **Secret Isolation**: `GITHUB_TOKEN` and `OPENAI_API_KEY` reside exclusively in `backend/.env` and are never exposed to the browser.
3. **Safe Error Handling**: Clear HTTP error codes and diagnostic descriptions without leaking internal stack traces.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

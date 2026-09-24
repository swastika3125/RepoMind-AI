import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 60000 // 60s timeout for AI analysis
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An unexpected error occurred.";
    if (error.response && error.response.data && error.response.data.error) {
      message = error.response.data.error;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const checkHealth = async () => {
  const res = await apiClient.get("/api/health");
  return res.data;
};

export const getRepository = async ({ owner, repo, url }) => {
  const params = {};
  if (url) params.url = url;
  if (owner && repo) {
    params.owner = owner;
    params.repo = repo;
  }
  const res = await apiClient.get("/api/repository", { params });
  return res.data;
};

export const getRepositoryTree = async ({ owner, repo, url }) => {
  const params = {};
  if (url) params.url = url;
  if (owner && repo) {
    params.owner = owner;
    params.repo = repo;
  }
  const res = await apiClient.get("/api/repository/tree", { params });
  return res.data;
};

export const getFileContent = async ({ owner, repo, path }) => {
  const res = await apiClient.get("/api/repository/file", {
    params: { owner, repo, path }
  });
  return res.data;
};

export const analyzeRepository = async (payload) => {
  const res = await apiClient.post("/api/analyze", payload);
  return res.data;
};

export const sendChatMessage = async ({ owner, repo, message, history }) => {
  const res = await apiClient.post("/api/chat", {
    owner,
    repo,
    message,
    history
  });
  return res.data;
};

export const generateReadme = async ({ owner, repo }) => {
  const res = await apiClient.post("/api/generate-readme", { owner, repo });
  return res.data;
};

export const generateDocumentation = async ({ owner, repo }) => {
  const res = await apiClient.post("/api/generate-documentation", { owner, repo });
  return res.data;
};

export default apiClient;

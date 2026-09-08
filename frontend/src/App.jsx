import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [backendMessage, setBackendMessage] = useState("Connecting...");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/health")
      .then((response) => {
        setBackendMessage(response.data.message);
      })
      .catch(() => {
        setBackendMessage("Backend connection failed");
      });
  }, []);

  return (
    <div>
      <h1>RepoMind AI</h1>
      <p>AI-Powered GitHub Repository Intelligence Platform</p>

      <hr />

      <h2>Backend Status</h2>
      <p>{backendMessage}</p>
    </div>
  );
}

export default App;
import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from routes.repository_routes import repository_bp
from routes.analysis_routes import analysis_bp
from routes.chat_routes import chat_bp

def create_app():
    app = Flask(__name__)
    
    # Configure CORS for React frontend
    CORS(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register blueprints
    app.register_blueprint(repository_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(chat_bp)
    
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "name": "RepoMind AI Backend",
            "message": "RepoMind AI Backend is running!",
            "status": "online",
            "version": "1.0.0"
        }), 200

    @app.route("/api/health", methods=["GET"])
    def health():
        has_gh = bool(os.getenv("GITHUB_TOKEN", "").strip())
        has_ai = bool(os.getenv("OPENAI_API_KEY", "").strip())
        return jsonify({
            "status": "healthy",
            "service": "RepoMind-AI",
            "version": "1.0.0",
            "configured_services": {
                "github_token": has_gh,
                "ai_configured": has_ai
            }
        }), 200

    @app.errorhandler(404)
    def handle_404(e):
        return jsonify({
            "success": False,
            "error": "Resource or endpoint not found."
        }), 404

    @app.errorhandler(500)
    def handle_500(e):
        return jsonify({
            "success": False,
            "error": "An internal server error occurred."
        }), 500

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

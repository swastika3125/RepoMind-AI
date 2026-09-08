from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "RepoMind AI backend is running!"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "success",
        "message": "RepoMind AI API is healthy"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
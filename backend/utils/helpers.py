from flask import jsonify

def api_response(data=None, message="Success", status_code=200):
    response = {
        "success": True,
        "message": message
    }
    if data is not None:
        if isinstance(data, dict):
            response.update(data)
        else:
            response["data"] = data
    return jsonify(response), status_code

def api_error(message="An error occurred", status_code=400, details=None):
    payload = {
        "success": False,
        "error": message
    }
    if details:
        payload["details"] = details
    return jsonify(payload), status_code

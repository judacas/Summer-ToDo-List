from functools import wraps

from flask import current_app, g, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.security import check_password_hash, generate_password_hash

from .serialization import object_id


TOKEN_SALT = "summer-bucket-list-auth"


def hash_password(password):
    return generate_password_hash(password)


def verify_password(password_hash, password):
    return check_password_hash(password_hash, password)


def _serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"])


def create_token(user_id):
    return _serializer().dumps(str(user_id), salt=TOKEN_SALT)


def load_token(token):
    max_age = current_app.config.get("AUTH_TOKEN_MAX_AGE_SECONDS", 60 * 60 * 24 * 7)
    return _serializer().loads(token, salt=TOKEN_SALT, max_age=max_age)


def current_user_required(handler):
    @wraps(handler)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        scheme, _, token = auth_header.partition(" ")

        if scheme.lower() != "bearer" or not token:
            return jsonify({"error": "unauthorized", "message": "Bearer token required"}), 401

        try:
            user_id = object_id(load_token(token))
        except (BadSignature, SignatureExpired, ValueError):
            return jsonify({"error": "unauthorized", "message": "Invalid or expired token"}), 401

        user = current_app.db.users.find_one({"_id": user_id})
        if user is None:
            return jsonify({"error": "unauthorized", "message": "User no longer exists"}), 401

        g.current_user = user
        return handler(*args, **kwargs)

    return wrapper

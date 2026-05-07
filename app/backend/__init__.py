from flask import Flask, jsonify, send_from_directory

from .config import Config
from .db import get_database
from .routes import register_routes


def create_app(database=None, config_object=Config):
    app = Flask(__name__, static_folder="../static", static_url_path="/static")
    app.config.from_object(config_object)

    app.db = database if database is not None else get_database(config_object)
    register_routes(app)

    @app.get("/")
    def index():
        return send_from_directory(app.static_folder, "index.html")

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "not_found", "message": "Route not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(_error):
        return jsonify({"error": "method_not_allowed", "message": "Method not allowed"}), 405

    return app

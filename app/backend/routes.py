from flask import g, jsonify, request

from .auth import create_token, current_user_required, hash_password, verify_password
from .repositories import CatalogRepository, DuplicateResource, ListsRepository, NotFound, UsersRepository
from .serialization import serialize_catalog_item, serialize_list, serialize_user


def register_routes(app):
    users = UsersRepository(app.db)
    catalog = CatalogRepository(app.db)
    lists = ListsRepository(app.db)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    @app.post("/auth/signup")
    def signup():
        payload = request.get_json(silent=True) or {}
        username = (payload.get("username") or "").strip()
        password = payload.get("password") or ""

        if not username or not password:
            return jsonify({"error": "bad_request", "message": "username and password are required"}), 400

        try:
            user = users.create(username, hash_password(password))
        except DuplicateResource as exc:
            return jsonify({"error": "conflict", "message": str(exc)}), 409

        return jsonify({"user": serialize_user(user), "token": create_token(user["_id"])}), 201

    @app.post("/auth/login")
    def login():
        payload = request.get_json(silent=True) or {}
        username = (payload.get("username") or "").strip()
        password = payload.get("password") or ""

        user = users.find_by_username(username)
        if user is None or not verify_password(user["password_hash"], password):
            return jsonify({"error": "unauthorized", "message": "Invalid username or password"}), 401

        return jsonify({"user": serialize_user(user), "token": create_token(user["_id"])}), 200

    @app.get("/items")
    def get_items():
        items = catalog.all(category=request.args.get("category"))
        return jsonify({"items": [serialize_catalog_item(item) for item in items]}), 200

    @app.get("/items/<item_id>")
    def get_item(item_id):
        try:
            item = catalog.get(item_id)
        except NotFound as exc:
            return jsonify({"error": "not_found", "message": str(exc)}), 404
        return jsonify({"item": serialize_catalog_item(item)}), 200

    @app.get("/locations")
    def get_locations():
        locations = [serialize_catalog_item(item) for item in catalog.locations()]
        return jsonify({"locations": locations}), 200

    @app.get("/lists")
    @current_user_required
    def get_lists():
        user_lists = lists.all_for_user(g.current_user["_id"])
        return jsonify({"lists": [serialize_list(bucket_list) for bucket_list in user_lists]}), 200

    @app.post("/lists")
    @current_user_required
    def create_list():
        payload = request.get_json(silent=True) or {}
        name = (payload.get("name") or "").strip()
        if not name:
            return jsonify({"error": "bad_request", "message": "name is required"}), 400

        bucket_list = lists.create(g.current_user["_id"], name)
        return jsonify({"list": serialize_list(bucket_list)}), 201

    @app.delete("/lists/<list_id>")
    @current_user_required
    def delete_list(list_id):
        try:
            lists.delete_for_user(g.current_user["_id"], list_id)
        except NotFound as exc:
            return jsonify({"error": "not_found", "message": str(exc)}), 404
        return jsonify({"deleted": True}), 200

    @app.get("/lists/<list_id>/items")
    @current_user_required
    def get_list_items(list_id):
        try:
            items = lists.items_for_list(g.current_user["_id"], list_id)
        except NotFound as exc:
            return jsonify({"error": "not_found", "message": str(exc)}), 404
        return jsonify({"items": [serialize_catalog_item(item) for item in items]}), 200

    @app.post("/lists/<list_id>/items")
    @current_user_required
    def add_list_item(list_id):
        payload = request.get_json(silent=True) or {}
        item_id = payload.get("item_id") or payload.get("catalog_item_id")
        if not item_id:
            return jsonify({"error": "bad_request", "message": "item_id is required"}), 400

        try:
            item = lists.add_item(g.current_user["_id"], list_id, item_id)
        except DuplicateResource as exc:
            return jsonify({"error": "conflict", "message": str(exc)}), 409
        except NotFound as exc:
            return jsonify({"error": "not_found", "message": str(exc)}), 404

        return jsonify({"item": serialize_catalog_item(item)}), 201

    @app.delete("/lists/<list_id>/items/<item_id>")
    @current_user_required
    def remove_list_item(list_id, item_id):
        try:
            lists.remove_item(g.current_user["_id"], list_id, item_id)
        except NotFound as exc:
            return jsonify({"error": "not_found", "message": str(exc)}), 404
        return jsonify({"deleted": True}), 200

    @app.patch("/lists/<list_id>/items/<item_id>")
    @current_user_required
    def update_list_item(list_id, item_id):
        payload = request.get_json(silent=True) or {}
        if "completed" not in payload:
            return jsonify({"error": "bad_request", "message": "completed is required"}), 400

        try:
            item = lists.set_completed(g.current_user["_id"], list_id, item_id, payload["completed"])
        except NotFound as exc:
            return jsonify({"error": "not_found", "message": str(exc)}), 404
        return jsonify({"item": serialize_catalog_item(item)}), 200

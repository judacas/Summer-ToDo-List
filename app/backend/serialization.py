from datetime import datetime

from bson import ObjectId


def object_id(value):
    if isinstance(value, ObjectId):
        return value
    if not ObjectId.is_valid(value):
        raise ValueError("Invalid ObjectId")
    return ObjectId(value)


def _stringify(value):
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, dict):
        return {key: _stringify(nested) for key, nested in value.items()}
    if isinstance(value, list):
        return [_stringify(nested) for nested in value]
    return value


def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "username": user["username"],
    }


def serialize_catalog_item(item):
    payload = {
        "id": str(item["_id"]),
        "name": item.get("name"),
        "category": item.get("category"),
        "due_date": item.get("due_date"),
        "location": _stringify(item.get("location", {})),
    }
    if "completed" in item:
        payload["completed"] = item["completed"]
    if "list_item_id" in item:
        payload["list_item_id"] = str(item["list_item_id"])
    return payload


def serialize_list(bucket_list):
    return {
        "id": str(bucket_list["_id"]),
        "name": bucket_list["name"],
        "user_id": str(bucket_list["user_id"]),
    }

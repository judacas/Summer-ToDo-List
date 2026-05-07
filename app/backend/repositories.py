from datetime import datetime, timezone

from bson import ObjectId
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

from .serialization import object_id


class DuplicateResource(ValueError):
    pass


class NotFound(ValueError):
    pass


class UsersRepository:
    def __init__(self, db):
        self.collection = db.users

    def create(self, username, password_hash):
        now = datetime.now(timezone.utc)
        try:
            result = self.collection.insert_one(
                {
                    "username": username,
                    "password_hash": password_hash,
                    "created_at": now,
                    "updated_at": now,
                }
            )
        except DuplicateKeyError as exc:
            raise DuplicateResource("Username already exists") from exc
        return self.collection.find_one({"_id": result.inserted_id})

    def find_by_username(self, username):
        return self.collection.find_one({"username": username})


class CatalogRepository:
    def __init__(self, db):
        self.collection = db.catalog_items

    def all(self, category=None):
        query = {}
        if category:
            query["category"] = category
        return list(self.collection.find(query).sort("name", 1))

    def get(self, item_id):
        try:
            item = self.collection.find_one({"_id": object_id(item_id)})
        except ValueError as exc:
            raise NotFound("Item not found") from exc
        if item is None:
            raise NotFound("Item not found")
        return item

    def locations(self):
        return list(
            self.collection.find(
                {"location.latitude": {"$exists": True}, "location.longitude": {"$exists": True}}
            ).sort("name", 1)
        )


class ListsRepository:
    def __init__(self, db):
        self.db = db
        self.lists = db.lists
        self.list_items = db.list_items
        self.catalog = db.catalog_items

    def all_for_user(self, user_id):
        return list(self.lists.find({"user_id": object_id(user_id)}).sort("name", 1))

    def create(self, user_id, name):
        now = datetime.now(timezone.utc)
        result = self.lists.insert_one(
            {
                "user_id": object_id(user_id),
                "name": name,
                "created_at": now,
                "updated_at": now,
            }
        )
        return self.get_for_user(user_id, result.inserted_id)

    def get_for_user(self, user_id, list_id):
        try:
            bucket_list = self.lists.find_one({"_id": object_id(list_id), "user_id": object_id(user_id)})
        except ValueError as exc:
            raise NotFound("List not found") from exc
        if bucket_list is None:
            raise NotFound("List not found")
        return bucket_list

    def delete_for_user(self, user_id, list_id):
        bucket_list = self.get_for_user(user_id, list_id)
        self.list_items.delete_many({"list_id": bucket_list["_id"]})
        self.lists.delete_one({"_id": bucket_list["_id"]})

    def items_for_list(self, user_id, list_id):
        bucket_list = self.get_for_user(user_id, list_id)
        rows = list(self.list_items.find({"list_id": bucket_list["_id"]}))
        catalog_ids = [row["catalog_item_id"] for row in rows]
        catalog_by_id = {
            item["_id"]: item for item in self.catalog.find({"_id": {"$in": catalog_ids}})
        }

        items = []
        for row in rows:
            catalog_item = catalog_by_id.get(row["catalog_item_id"])
            if catalog_item:
                merged = dict(catalog_item)
                merged["list_item_id"] = row["_id"]
                merged["completed"] = row.get("completed", False)
                items.append(merged)
        return items

    def add_item(self, user_id, list_id, catalog_item_id):
        bucket_list = self.get_for_user(user_id, list_id)
        try:
            catalog_id = object_id(catalog_item_id)
        except ValueError as exc:
            raise NotFound("Catalog item not found") from exc
        catalog_item = self.catalog.find_one({"_id": catalog_id})
        if catalog_item is None:
            raise NotFound("Catalog item not found")

        now = datetime.now(timezone.utc)
        try:
            result = self.list_items.insert_one(
                {
                    "list_id": bucket_list["_id"],
                    "catalog_item_id": catalog_id,
                    "completed": False,
                    "created_at": now,
                    "updated_at": now,
                }
            )
        except DuplicateKeyError as exc:
            raise DuplicateResource("Item already exists in this list") from exc

        row = self.list_items.find_one({"_id": result.inserted_id})
        merged = dict(catalog_item)
        merged["list_item_id"] = row["_id"]
        merged["completed"] = row["completed"]
        return merged

    def remove_item(self, user_id, list_id, catalog_item_id):
        bucket_list = self.get_for_user(user_id, list_id)
        try:
            catalog_id = object_id(catalog_item_id)
        except ValueError as exc:
            raise NotFound("Item not found in this list") from exc
        result = self.list_items.delete_one(
            {"list_id": bucket_list["_id"], "catalog_item_id": catalog_id}
        )
        if result.deleted_count == 0:
            raise NotFound("Item not found in this list")

    def set_completed(self, user_id, list_id, catalog_item_id, completed):
        bucket_list = self.get_for_user(user_id, list_id)
        try:
            catalog_id = object_id(catalog_item_id)
        except ValueError as exc:
            raise NotFound("Item not found in this list") from exc
        result = self.list_items.find_one_and_update(
            {"list_id": bucket_list["_id"], "catalog_item_id": catalog_id},
            {"$set": {"completed": bool(completed), "updated_at": datetime.now(timezone.utc)}},
            return_document=ReturnDocument.AFTER,
        )
        if result is None:
            raise NotFound("Item not found in this list")

        catalog_item = self.catalog.find_one({"_id": result["catalog_item_id"]})
        merged = dict(catalog_item)
        merged["list_item_id"] = result["_id"]
        merged["completed"] = result["completed"]
        return merged


def ensure_indexes(db):
    db.users.create_index("username", unique=True)
    db.lists.create_index("user_id")
    db.lists.create_index([("user_id", 1), ("name", 1)])
    db.catalog_items.create_index("category")
    db.list_items.create_index("list_id")
    db.list_items.create_index("catalog_item_id")
    db.list_items.create_index([("list_id", 1), ("catalog_item_id", 1)], unique=True)

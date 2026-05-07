import os
from urllib.parse import urlparse


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    AUTH_TOKEN_MAX_AGE_SECONDS = int(os.getenv("AUTH_TOKEN_MAX_AGE_SECONDS", str(60 * 60 * 24 * 7)))
    MONGO_URI = os.getenv("MONGO_URI")
    MONGO_DATABASE = os.getenv("MONGO_DATABASE") or os.getenv("DB_NAME")

    @classmethod
    def mongo_uri(cls):
        if cls.MONGO_URI:
            return cls.MONGO_URI

        username = os.getenv("MONGO_USERNAME", "admin")
        password = os.getenv("MONGO_PASSWORD", "password")
        database = cls.mongo_database()
        return f"mongodb://{username}:{password}@mongodb:27017/{database}?authSource=admin"

    @classmethod
    def mongo_database(cls):
        if cls.MONGO_DATABASE:
            return cls.MONGO_DATABASE

        if cls.MONGO_URI:
            path = urlparse(cls.MONGO_URI).path.strip("/")
            if path:
                return path

        return "summer_bucket_list"

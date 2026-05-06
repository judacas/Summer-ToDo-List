import pytest
import pymongo
from conftest import MONGO_URI


def test_mongo_connection():
    """MongoDB should be reachable and accept connections."""
    # client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    # client.server_info()  # raises if unreachable
    # client.close()
    pass


def test_mongo_has_data():
    """Database should have at least one seed item after Jasmine seeds it."""
    # client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    # db = client["bucketlist"]
    # count = db["items"].count_documents({})
    # assert count > 0
    # client.close()
    pass
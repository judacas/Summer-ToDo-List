from pymongo import MongoClient


def get_database(config):
    client = MongoClient(config.mongo_uri())
    return client[config.mongo_database()]

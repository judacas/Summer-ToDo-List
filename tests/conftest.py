import os
import pytest

# Base URL for the running Flask app inside Docker
BASE_URL = os.getenv("FLASK_BASE_URL", "http://localhost:5000")

# MongoDB connection string — pulled from env, same as the app uses
MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:password@localhost:27017/bucketlist?authSource=admin")

# Google Maps API key — Jenkins will inject this as an env var
MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")
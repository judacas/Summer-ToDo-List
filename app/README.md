# Flask Backend

This directory contains Daniel's backend/API slice for the Summer Bucket List app. The Flask app is JSON-only: it exposes routes for authentication, seeded catalog items, user lists, list items, completion status, health checks, and map location data.


## Files

| Path | Purpose |
| --- | --- |
| `app.py` | Docker entrypoint for the Flask app |
| `requirements.txt` | Runtime Python dependencies for the Flask container |
| `backend/` | App factory, routes, auth helpers, MongoDB repositories, and serialization |
| `backend/README.md` | API path reference and request/response examples |

## Environment

For local Docker Compose use, copy the example environment file from the repo root:

```bash
cp .env.example .env
```

Backend-related variables:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | Full MongoDB connection string. Docker Compose builds this from the Mongo variables below. |
| `MONGO_DATABASE` | Application database name. Defaults to `summer_bucket_list`. |
| `MONGO_USERNAME` | MongoDB username for Docker Compose. |
| `MONGO_PASSWORD` | MongoDB password for Docker Compose. |
| `SECRET_KEY` | Flask signing secret for auth tokens. |
| `GOOGLE_MAPS_API_KEY` | Used by the frontend map, not by backend route logic. |

## Run with Docker Compose

From the repo root:

```bash
docker compose up --build
```

The API listens on:

```text
http://localhost:5000
```

Basic health check:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{"status":"ok"}
```

## Manual Real-Database Check

After Docker Compose is running, use this flow to confirm Flask can talk to MongoDB, read seeded catalog data, create a user list, add an item, mark it complete, and delete the created list data.

```bash
BASE=http://127.0.0.1:5000
USER="manual-check-$(date +%s)"

curl "$BASE/health"

SIGNUP=$(curl -s -X POST "$BASE/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USER\",\"password\":\"password123\"}")

TOKEN=$(printf '%s' "$SIGNUP" \
  | python -c "import json,sys; print(json.load(sys.stdin)['token'])")

ITEMS=$(curl -s "$BASE/items")
ITEM_ID=$(printf '%s' "$ITEMS" \
  | python -c "import json,sys; print(json.load(sys.stdin)['items'][0]['id'])")

LIST_RESPONSE=$(curl -s -X POST "$BASE/lists" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Manual Check"}')

LIST_ID=$(printf '%s' "$LIST_RESPONSE" \
  | python -c "import json,sys; print(json.load(sys.stdin)['list']['id'])")

curl -X POST "$BASE/lists/$LIST_ID/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"item_id\":\"$ITEM_ID\"}"

curl -X PATCH "$BASE/lists/$LIST_ID/items/$ITEM_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"completed":true}'

curl "$BASE/lists/$LIST_ID/items" \
  -H "Authorization: Bearer $TOKEN"

curl -X DELETE "$BASE/lists/$LIST_ID/items/$ITEM_ID" \
  -H "Authorization: Bearer $TOKEN"

curl -X DELETE "$BASE/lists/$LIST_ID" \
  -H "Authorization: Bearer $TOKEN"
```

This manual check creates a temporary user. If you want to remove those users later, delete usernames that start with `manual-check-` from the `users` collection.

## API Reference

See [backend/README.md](backend/README.md) for all API paths, auth rules, status codes, and example payloads.

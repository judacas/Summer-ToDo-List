# Backend API Reference

The Flask backend returns JSON only. It does not render HTML and it does not call Google Maps directly. Map coordinates come from MongoDB `catalog_items` documents and are returned to the frontend as JSON.

Base URL when running with Docker Compose:

```text
http://localhost:5000
```

If Flask is being run manually on another port for debugging, replace the base URL with that address, for example `http://127.0.0.1:5001`.

## Authentication

`POST /auth/signup` and `POST /auth/login` return a bearer token. Protected routes require this header:

```text
Authorization: Bearer <token>
```

The token identifies the current user. Users can only read and modify their own `lists` and `list_items`.

## Response Format

Successful collection responses are wrapped in named keys:

```json
{
  "items": []
}
```

Errors use:

```json
{
  "error": "not_found",
  "message": "Item not found"
}
```

Common status codes:

| Code | Meaning |
| --- | --- |
| `200` | Request succeeded |
| `201` | Resource created |
| `400` | Required JSON field is missing or invalid |
| `401` | Missing, invalid, or expired bearer token |
| `404` | Resource does not exist or does not belong to the current user |
| `409` | Duplicate resource, such as username or item already in list |

## Health

### `GET /health`

Used by Jenkins, Docker health checks, and local setup checks.

Response:

```json
{
  "status": "ok"
}
```

## Auth Endpoints

### `POST /auth/signup`

Creates a new user. Plain passwords are never stored; the API stores a password hash.

Request:

```json
{
  "username": "daniel",
  "password": "password123"
}
```

Response `201`:

```json
{
  "user": {
    "id": "665f0f000000000000000001",
    "username": "daniel"
  },
  "token": "<token>"
}
```

### `POST /auth/login`

Validates credentials and returns a bearer token.

Request:

```json
{
  "username": "daniel",
  "password": "password123"
}
```

Response `200`:

```json
{
  "user": {
    "id": "665f0f000000000000000001",
    "username": "daniel"
  },
  "token": "<token>"
}
```

## Catalog Endpoints

Catalog items are seeded globally in MongoDB. Users choose from this catalog; they do not create arbitrary custom activities through the API.

### `GET /items`

Returns all seeded catalog items.

Optional query parameter:

| Parameter | Description |
| --- | --- |
| `category` | Filters by exact category value |

Response `200`:

```json
{
  "items": [
    {
      "id": "665f10000000000000000001",
      "name": "Watch sunset at Tampa Riverwalk",
      "category": "Outdoor",
      "due_date": "2026-06-15",
      "location": {
        "latitude": 27.9475,
        "longitude": -82.4584
      }
    }
  ]
}
```

### `GET /items/<item_id>`

Returns one catalog item by MongoDB ObjectId.

Response `200`:

```json
{
  "item": {
    "id": "665f10000000000000000001",
    "name": "Watch sunset at Tampa Riverwalk",
    "category": "Outdoor",
    "due_date": "2026-06-15",
    "location": {
      "latitude": 27.9475,
      "longitude": -82.4584
    }
  }
}
```

### `GET /locations`

Returns catalog items that have latitude and longitude. This endpoint feeds the map visualization.

Response `200`:

```json
{
  "locations": [
    {
      "id": "665f10000000000000000001",
      "name": "Watch sunset at Tampa Riverwalk",
      "category": "Outdoor",
      "due_date": "2026-06-15",
      "location": {
        "latitude": 27.9475,
        "longitude": -82.4584
      }
    }
  ]
}
```

## List Endpoints

All list endpoints require `Authorization: Bearer <token>`.

### `GET /lists`

Returns the authenticated user's lists.

Response `200`:

```json
{
  "lists": [
    {
      "id": "665f20000000000000000001",
      "name": "Summer 2026",
      "user_id": "665f0f000000000000000001"
    }
  ]
}
```

### `POST /lists`

Creates a new list for the authenticated user.

Request:

```json
{
  "name": "Summer 2026"
}
```

Response `201`:

```json
{
  "list": {
    "id": "665f20000000000000000001",
    "name": "Summer 2026",
    "user_id": "665f0f000000000000000001"
  }
}
```

### `DELETE /lists/<list_id>`

Deletes one user-owned list and its related `list_items` join records.

Response `200`:

```json
{
  "deleted": true
}
```

## List Item Endpoints

List item endpoints also require `Authorization: Bearer <token>`. `item_id` is the catalog item id, not the join row id.

### `GET /lists/<list_id>/items`

Returns all catalog items currently attached to a user-owned list. Each item includes per-list completion state.

Response `200`:

```json
{
  "items": [
    {
      "id": "665f10000000000000000001",
      "list_item_id": "665f30000000000000000001",
      "name": "Watch sunset at Tampa Riverwalk",
      "category": "Outdoor",
      "due_date": "2026-06-15",
      "completed": false,
      "location": {
        "latitude": 27.9475,
        "longitude": -82.4584
      }
    }
  ]
}
```

### `POST /lists/<list_id>/items`

Adds a catalog item to a user-owned list.

Request:

```json
{
  "item_id": "665f10000000000000000001"
}
```

`catalog_item_id` is also accepted as an alias for `item_id`.

Response `201`:

```json
{
  "item": {
    "id": "665f10000000000000000001",
    "list_item_id": "665f30000000000000000001",
    "name": "Watch sunset at Tampa Riverwalk",
    "category": "Outdoor",
    "due_date": "2026-06-15",
    "completed": false,
    "location": {
      "latitude": 27.9475,
      "longitude": -82.4584
    }
  }
}
```

### `PATCH /lists/<list_id>/items/<item_id>`

Marks or unmarks a catalog item as complete for one user-owned list.

Request:

```json
{
  "completed": true
}
```

Response `200`:

```json
{
  "item": {
    "id": "665f10000000000000000001",
    "list_item_id": "665f30000000000000000001",
    "name": "Watch sunset at Tampa Riverwalk",
    "category": "Outdoor",
    "due_date": "2026-06-15",
    "completed": true,
    "location": {
      "latitude": 27.9475,
      "longitude": -82.4584
    }
  }
}
```

### `DELETE /lists/<list_id>/items/<item_id>`

Removes a catalog item from one user-owned list.

Response `200`:

```json
{
  "deleted": true
}
```

## Example Curl Flow

This assumes Docker Compose is running and the API is available at `http://localhost:5000`. The same flow works with another base URL if Flask is running manually.

```bash
TOKEN=$(curl -s -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"daniel","password":"password123"}' \
  | python -c "import json,sys; print(json.load(sys.stdin)['token'])")

ITEM_ID=$(curl -s http://localhost:5000/items \
  | python -c "import json,sys; print(json.load(sys.stdin)['items'][0]['id'])")

LIST_ID=$(curl -s -X POST http://localhost:5000/lists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Summer 2026"}' \
  | python -c "import json,sys; print(json.load(sys.stdin)['list']['id'])")

curl -X POST "http://localhost:5000/lists/$LIST_ID/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"item_id\":\"$ITEM_ID\"}"

curl -X PATCH "http://localhost:5000/lists/$LIST_ID/items/$ITEM_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"completed":true}'
```

## Code Organization

| Path | Purpose |
| --- | --- |
| `__init__.py` | App factory and JSON error handlers |
| `routes.py` | HTTP route definitions |
| `repositories.py` | MongoDB query and persistence layer |
| `auth.py` | Password hashing and bearer-token handling |
| `config.py` | Environment-driven app configuration |
| `serialization.py` | MongoDB ObjectId/date JSON serialization |

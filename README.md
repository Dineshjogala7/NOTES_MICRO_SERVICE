# 📝 Notes Microservices

A production-ready microservices backend for a Notes application built with **Node.js/Express**, **MongoDB**, **Redis Pub/Sub**, and **Docker Compose**.

---

## Architecture
![Architecture Diagram](./docs/Screenshot%202026-03-01%20224504.png)


> **Client → API Gateway → Internal Services**
> Services communicate via **HTTP** (sync) and **Redis Pub/Sub** (async events).

---

## Services

| Service | Port | Responsibility |
|---|---|---|
| `api-gateway` | 5003 | Single entry point, request routing, auth middleware |
| `user-service` | 5001 | Authentication & user management |
| `category-service` | 5002 | Category CRUD operations |
| `notes-service` | 5004 | Notes CRUD operations |
| `redis` | 6379 | Async event bus (Pub/Sub) |
| `mongo` | 27017 | Persistent storage |

---

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Messaging:** Redis Pub/Sub
- **Auth:** JWT + HTTP-only Cookies
- **Infrastructure:** Docker + Docker Compose

---

## Project Structure
```
Notes-Micro-Service/
├── api-gateway/
│   └── src/
│       ├── index.js
│       ├── routes/
│       ├── middleware/
│       └── proxies/
├── user-service/
│   └── src/
│       ├── index.js
│       ├── models/
│       └── routes/
├── category-service/
│   └── src/
│       ├── index.js
│       ├── models/
│       ├── routes/
│       └── controllers/
├── notes-service/
│   └── src/
│       ├── index.js
│       ├── models/
│       ├── routes/
│       └── subscribers/
├── docker-compose.yml
└── .env
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) (for local development)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/notes-micro-service.git
cd notes-micro-service
```

### 2. Configure Environment Variables

Create a `.env` file at the project root:
```env
# General
NODE_ENV=development

# API Gateway
GATEWAY_PORT=5003
JWT_SECRET=your_jwt_secret_here

# Redis
REDIS_URL=redis://redis:6379

# Service URLs (internal Docker networking)
USER_SERVICE_URL=http://user-service:5001
CATEGORY_SERVICE_URL=http://category-service:5002
NOTES_SERVICE_URL=http://notes-service:5004

# MongoDB
MONGO_URI_USER=mongodb://mongo:27017/userDB
MONGO_URI_CATEGORY=mongodb://mongo:27017/categoryDB
MONGO_URI_NOTES=mongodb://mongo:27017/notesDB
```

### 3. Run with Docker Compose
```bash
# Build and start all services
docker compose up --build

# Run in detached (background) mode
docker compose up -d --build
```

The API Gateway will be available at: **`http://localhost:5003`**

---

## API Reference

All requests go through the **API Gateway** at `http://localhost:5003`.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users/auth/register` | Register a new user |
| `POST` | `/api/users/auth/login` | Login and receive auth cookie |
| `POST` | `/api/users/auth/logout` | Logout and clear cookie |
| `GET` | `/api/users/auth/me` | Get current user profile |

### Categories

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/categories` | Create a category |
| `GET` | `/api/categories` | Get all categories |
| `PUT` | `/api/categories/:id` | Update a category |
| `DELETE` | `/api/categories/:id` | Delete a category |

### Notes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/notes` | Create a note |
| `GET` | `/api/notes` | Get all notes |
| `GET` | `/api/notes/category/:categoryId` | Get notes by category |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |

---

## Async Events (Redis Pub/Sub)

### `CATEGORY_DELETED`

| | |
|---|---|
| **Published by** | `category-service` |
| **Consumed by** | `notes-service` |

**Payload:**
```json
{
  "categoryId": "65f...",
  "userId": "65a..."
}
```

**Behavior:** When a category is deleted, `notes-service` automatically removes all notes associated with that `categoryId` and `userId`.

---

## Frontend Integration

Your frontend should **only communicate with the API Gateway**, never directly with internal services.
```js
// Axios config (e.g., React/Vite frontend)
axios.defaults.baseURL = 'http://localhost:5003';
axios.defaults.withCredentials = true; // Required for cookie-based auth
```

**CORS requirements on the gateway:**
```js
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true,
}));
```

---

## Docker Networking

| Context | URL Format |
|---|---|
| Between containers | `http://service-name:port` (e.g., `http://notes-service:5004`) |
| From browser/host | `http://localhost:5003` |

> ⚠️ Never use `localhost` inside Docker containers — it refers to the container itself.

---

## Useful Commands
```bash
# View logs for a specific service
docker compose logs -f api-gateway
docker compose logs -f notes-service

# Restart a single service
docker compose restart api-gateway

# Inspect MongoDB data
docker exec -it <mongo_container_name> mongosh
> show dbs
> use notesDB
> db.notes.find().pretty()

# Stop all services
docker compose down
```

---

## Troubleshooting

**`400 Bad Request`**
- Verify request body keys match the expected schema
- Confirm `Content-Type: application/json` is being forwarded by the gateway
- Check validation rules on the target service

**Cookie not being saved or sent**
- Frontend must set `withCredentials: true`
- Gateway must have `credentials: true` in CORS config
- Avoid `sameSite: 'strict'` or `secure: true` in local development

**Redis events not firing**
- Confirm the `redis` container is running: `docker compose ps`
- Verify the publisher and subscriber use the **exact same channel name**
- Add `console.log` to your subscriber to debug incoming payloads

---

## Roadmap

- [ ] Complete UPDATE APIs for notes and categories
- [ ] Add `/health` endpoints for each service
- [ ] Centralized logging with request ID correlation
- [ ] Observability: metrics and distributed tracing
- [ ] Frontend integration (React + Vite)
- [ ] Rate limiting on the API Gateway

---


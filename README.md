# Express + Mongoose starter

## Setup

1) Install deps

```bash
npm install
```

2) Create `.env`

Copy `.env.example` to `.env` and set your MongoDB connection string:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/backend_assignment
PORT=5000
```

## Run

```bash
npm run dev
```

## Routes

- `GET /api/health`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users` body: `{ "name": "A", "email": "a@example.com" }`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`



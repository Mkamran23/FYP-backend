# SkillSwap

SkillSwap is a React, Express, MongoDB, and Socket.io application for matching people who want to teach and learn complementary skills.

## Project structure

- `sever/` — Express API, Mongoose models, JWT authentication, Socket.io chat, and seed scripts.
- `client/` — React + Vite frontend using Tailwind CSS.
- `database/demo-users.json` — 20 matching-ready demo user records used by the database seeder.

## Prerequisites

- Node.js 20 or later
- MongoDB running locally or a MongoDB Atlas connection string

## 1. Configure the API

```bash
cd sever
npm install
copy .env.example .env
```

Set these required values in `sever/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/skillswap
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
SESSION_SECRET=replace-with-another-long-random-secret
FRONTEND_URL=http://localhost:5173
```

Optional features use these values:

```env
# Password reset email
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
```

For OAuth, register the callback URLs above with Google and GitHub.

## 2. Seed the database

First create or promote an administrator; this account owns the shared skill catalog.

```bash
npm run bootstrap:admin -- --email=admin@example.com
npm run seed:skills
npm run seed:demo-users
```

The final command is idempotent: it creates or updates the 20 records in `database/demo-users.json` without deleting existing users. Every demo user uses the password `DemoPass123!`. The email range is `demo.user01@skillswap.test` through `demo.user20@skillswap.test`.

## 3. Start the API

```bash
npm run dev
```

The API starts on `http://localhost:5000`.

## 4. Configure and start the frontend

Open another terminal:

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

The frontend opens at `http://localhost:5173`.

## Frontend environment values

`client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Production build

```bash
npm run lint
npm run build
```

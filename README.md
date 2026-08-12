# User Authentication System (Node.js + Express + MongoDB + JWT)

A complete, secure authentication backend featuring registration, login, password hashing, JWT access/refresh tokens, and protected routes.

## Project Structure

```
auth-system/
├── config/
│   ├── db.js          # MongoDB connection
│   └── jwt.js         # JWT helper functions
├── controllers/
│   └── authController.js
├── middleware/
│   ├── auth.js          # protect & authorize middleware
│   ├── errorHandler.js
│   └── validators.js
├── models/
│   └── User.js          # Mongoose schema with password hashing
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally, or a MongoDB Atlas connection string

### 2. Install dependencies
```bash
cd auth-system
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your own values:
```bash
cp .env.example .env
```

Generate strong secrets for JWT (run twice for two different secrets):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth_system
JWT_SECRET=<your generated secret>
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=<your other generated secret>
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Run the server
```bash
# development (auto-restart)
npm run dev

# production
npm start
```

Server runs at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint              | Access        | Description                       |
|--------|-----------------------|---------------|-----------------------------------|
| POST   | `/api/auth/register`  | Public        | Register a new user               |
| POST   | `/api/auth/login`     | Public        | Login and receive tokens          |
| POST   | `/api/auth/refresh`   | Public        | Get a new access token            |
| POST   | `/api/auth/logout`    | Private       | Invalidate refresh token          |
| GET    | `/api/auth/me`        | Private       | Get current user profile          |
| GET    | `/api/users/dashboard`| Private       | Example protected route           |
| GET    | `/api/users/admin`    | Private/Admin | Example role-restricted route     |
| GET    | `/api/health`         | Public        | Health check                      |

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"password123"}'
```
Response includes `accessToken` and `refreshToken`.

### Access a protected route
```bash
curl http://localhost:5000/api/users/dashboard \
  -H "Authorization: Bearer <accessToken>"
```

### Refresh token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <accessToken>"
```

## Security Features
- Passwords hashed with bcrypt (12 salt rounds), never returned in API responses
- JWT access tokens (short-lived) + refresh tokens (long-lived, stored server-side, rotated on use)
- Rate limiting on `/register` and `/login` to mitigate brute-force attacks
- `helmet` for secure HTTP headers, `cors` enabled
- Input validation via `express-validator`
- Centralized error handling, including Mongo duplicate-key and validation errors
- Role-based access control (`user` / `admin`) via `authorize()` middleware

## Notes / Next Steps
- To promote a user to admin, manually update their `role` field to `"admin"` in MongoDB.
- For production: set `NODE_ENV=production`, use HTTPS, store refresh tokens in `httpOnly` cookies instead of JSON response if building a browser frontend, and consider adding email verification / password reset flows.

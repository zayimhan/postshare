# 🔐 Reusable Auth Module (Express + MySQL + JWT)

A clean, reusable authentication module built with **Node.js**, **Express**, **MySQL**, **JWT**, and **bcrypt**.

This repository contains a **production-ready auth core** that can be plugged into any backend project with minimal setup.

---

## ✨ Features

- User registration
- User login
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- Clean layered architecture
- Environment-safe configuration
- Reusable across multiple projects

---

## 🧱 Architecture

```

src/
├── config/
│   ├── db.js
│   └── auth.config.js
│
├── modules/
│   └── auth/
│       ├── auth.routes.js
│       ├── auth.controller.js
│       ├── auth.service.js
│       ├── auth.model.js
│       └── auth.middleware.js
│
└── app.js

````

---

## 🛠 Tech Stack

- Node.js
- Express
- MySQL
- bcrypt
- jsonwebtoken
- dotenv

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database

JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
````

---

## 🗄 Database Schema

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Installation & Run

```bash
npm install
npm run dev
```

Server will start on:

```
http://localhost:3000
```

---

## 🔑 API Endpoints

### Register

```
POST /auth/register
```

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

---

### Login

```
POST /auth/login
```

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "JWT_TOKEN"
}
```

---

### Get Current User (Protected)

```
GET /auth/me
```

Headers:

```
Authorization: Bearer JWT_TOKEN
```

---

## 🔒 JWT Payload

```json
{
  "userId": 1
}
```

The decoded user is available as:

```js
req.user.id
```

---

## ♻️ Reusability

This module is designed to be reused across different projects.

To reuse:

1. Copy the `auth` module
2. Configure `.env`
3. Create `users` table
4. Mount routes

```js
app.use("/auth", authRoutes);
```

---

## 📌 Notes

* Business logic is isolated from HTTP layer
* Database access is fully abstracted
* JWT & DB configs are environment-driven
* Safe for production & containerized environments

---

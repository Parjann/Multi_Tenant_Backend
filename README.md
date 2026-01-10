🚀 Multi-Tenant SaaS Backend

A production-style multi-tenant SaaS backend built with Node.js, Redis, and Docker, demonstrating real-world backend architecture including authentication, tenant isolation, RBAC, rate limiting, and audit logging.

This project is designed to showcase scalable backend engineering practices used in modern SaaS applications.

✨ Key Highlights

🏢 Multi-Tenant Architecture with strict data isolation

🔐 JWT Authentication with secure password hashing

🛂 Role-Based Access Control (RBAC) (Admin / Member)

👥 Admin-driven User Invitation System

🚦 Redis-based Rate Limiting to prevent API abuse

📜 Audit & Activity Logs for critical system actions

🐳 Docker & Docker Compose for local orchestration

🔁 Live reload using nodemon (polling mode) for Windows + Docker

🛠️ Tech Stack
Category	Technology
Backend	Node.js, Express.js
Database	Redis
Auth	JWT, bcrypt
DevOps	Docker, Docker Compose
Tooling	Nodemon, dotenv
🏗️ Architecture Overview

Each tenant (company) has isolated data

Tenant context is derived from JWT claims

Authorization is enforced using middleware

Redis is used for:

Entity storage

Relationship mapping

Rate limiting

Audit logs

📂 Project Structure
src/
├── app.js
├── server.js
├── config/
│   └── redis.js
├── middleware/
│   ├── auth.middleware.js
│   ├── tenant.middleware.js
│   ├── role.middleware.js
│   └── rateLimit.middleware.js
├── modules/
│   ├── auth/
│   ├── project/
│   ├── user/
│   └── audit/
└── utils/
    └── auditLogger.js

⚙️ Environment Setup

Create a .env file in the project root:

PORT=5000
JWT_SECRET=your_secret_key
REDIS_URL=redis://redis:6379


🔒 The .env file is excluded from version control for security.

🐳 Running the Project with Docker
1️⃣ Start the services
docker-compose up --build

2️⃣ Application URLs

Backend API:

http://localhost:5000

Response:

{ "status": "OK" }

🔐 API Endpoints
Authentication

POST /api/auth/register

POST /api/auth/login

Projects

POST /api/projects → Admin only

GET /api/projects → Admin & Member

Users

POST /api/users/invite → Admin only

Audit Logs

GET /api/audit → Admin only

🚦 Rate Limiting

Implemented using Redis INCR + EXPIRE

Default limit: 100 requests per 60 seconds

Exceeding the limit returns:

{
  "message": "Too many requests. Please try again later."
}


HTTP Status:

429 Too Many Requests

📜 Audit & Activity Logs

The system records critical actions such as:

Project creation

User invitations

Administrative operations

Audit logs are:

Tenant-scoped

Stored in Redis

Accessible only to admins

🧪 Development Notes

Uses nodemon -L for reliable file watching in Docker on Windows

Code changes do not require rebuilding Docker images

Redis data persists using Docker volumes

🧠 What This Project Demonstrates

SaaS backend system design

Secure authentication & authorization

Scalable Redis usage patterns

Middleware-based architecture

Dockerized development workflow

🔮 Future Improvements

Email-based user invitations

Per-route rate limits (e.g. stricter login limits)

CI/CD pipeline (GitHub Actions)

Cloud deployment (AWS / GCP)

Monitoring & metrics

👨‍💻 Author

Parjan Annaffi Hussain
Full Stack / Backend Developer

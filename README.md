# Dunia Futbolu (dunyafutbolu.az)

Azerbaijan sports news portal with Admin Panel, Backend API, and Frontend.

## Project Structure

- **backend/**: NestJS API with PostgreSQL (Docker).
- **frontend/**: React/Vite public portal.
- **admin/**: React/Vite administration dashboard.

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Docker (for database)

### 2. Setup Database
Navigate to `backend` and start the database:
```bash
cd backend
docker-compose up -d
```

### 3. Install Dependencies
Run `npm install` in each directory:
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# Admin
cd admin && npm install
```

### 4. Running the Applications
Start each application in a separate terminal:

**Backend:**
```bash
cd backend
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Admin:**
```bash
cd admin
npm run dev
```

## Environment Variables
Copy `.env.example` to `.env` in the `backend` folder and configure your database credentials.

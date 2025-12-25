# DIA Project Deployment Guide

## 1. Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (installed and running locally)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DIA_AGENTATHON
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure Environment Variables**

   Create or update `backend/.env`:
   ```env
   # Local MongoDB (Recommended for development)
   MONGODB_URI=mongodb://localhost:27017/dia-lawyers
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ADMIN_PASSWORD=admin123
   ```

4. **Seed the Database (Optional)**
   Populate the local database with initial test data:
   ```bash
   cd backend
   node seed.js
   ```

5. **Start the Application**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 2. Production Deployment (Vercel + MongoDB Atlas)

### MongoDB Atlas Setup
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Network Access**: Add `0.0.0.0/0` to the IP Whitelist (Critical for Vercel).
3. **Database Access**: Create a database user (e.g., `dia_app`).
4. Get the Connection String (e.g., `mongodb+srv://<user>:<password>@cluster...`).

### Vercel Deployment

1. **Backend Deployment**:
   - Import the `backend` folder as a project in Vercel.
   - Add Environment Variables:
     - `MONGODB_URI`: Your Atlas connection string.
     - `ADMIN_PASSWORD`: Secure password.
     - `NODE_ENV`: `production`.

2. **Frontend Deployment**:
   - Import the `frontend` folder as a project.
   - Add Environment Variable:
     - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://dia-backend.vercel.app`).

### Troubleshooting

- **Connection Timeouts**: Ensure MongoDB Atlas IP Whitelist includes `0.0.0.0/0`.
- **CORS Issues**: Check `allowedOrigins` in `backend/server.js` matching your frontend domain.

## 3. Verification

Run the included verification script to test database connectivity:
```bash
cd backend
node scripts/verify-mongo.js
```

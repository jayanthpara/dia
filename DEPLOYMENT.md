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

   Create `backend/.env` (use `.env.example` as template):
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

### Step 1: MongoDB Atlas Setup

1. **Create a Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster

2. **Create Database User**
   - Database Access → Add New Database User
   - Choose password authentication
   - Save username and password

3. **Configure Network Access** ⚠️ **CRITICAL**
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere)
   - This is required for Vercel serverless functions

4. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<database>` with `dia-lawyers`
   
   Example:
   ```
   mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/dia-lawyers
   ```

### Step 2: Deploy Backend to Vercel

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - New Project → Import Git Repository
   - Select your repository

2. **Configure Project**
   - Root Directory: `backend`
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

3. **Set Environment Variables** ⚠️ **REQUIRED**
   
   Settings → Environment Variables → Add:

   | Name | Value | Example |
   |------|-------|---------|
   | `MONGODB_URI` | Your Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dia-lawyers` |
   | `NODE_ENV` | `production` | `production` |
   | `FRONTEND_URL` | Your frontend URL | `https://your-app.vercel.app` |
   | `ADMIN_PASSWORD` | Secure password | `your-secure-password` |

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### Step 3: Deploy Frontend

1. **Import Frontend Project**
   - New Project → Import same repository
   - Root Directory: `frontend`
   - Framework Preset: Vite

2. **Set Environment Variables**
   
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | Your backend URL (e.g., `https://dia-backend.vercel.app`) |

3. **Deploy**
   - Click "Deploy"

4. **Update Backend CORS**
   - After frontend is deployed, update `FRONTEND_URL` in backend environment variables
   - Redeploy backend if needed

---

## 3. Verification & Troubleshooting

### Test MongoDB Connection Locally

Before deploying, test your MongoDB connection:

```bash
cd backend
node scripts/check-mongo.js
```

Expected output:
```
✅ ALL CHECKS PASSED - MongoDB is working correctly!
```

### Check Production Health

Visit: `https://your-backend.vercel.app/health`

**Successful Response:**
```json
{
  "status": "healthy",
  "dataMode": "MONGO",
  "mongodb": "connected",
  "timestamp": "2025-12-26T..."
}
```

**Failed Response:**
```json
{
  "status": "healthy",
  "dataMode": "JSON",
  "mongodb": "disconnected",
  "timestamp": "2025-12-26T..."
}
```

### Common Issues & Solutions

#### ❌ MongoDB Not Connecting in Production

**Check Deployment Logs:**
- Vercel Dashboard → Deployments → Your deployment → Logs
- Look for MongoDB connection messages

**Common Error Messages:**

| Error | Cause | Solution |
|-------|-------|----------|
| `MONGODB_URI is not set` | Missing environment variable | Add `MONGODB_URI` in Vercel settings |
| `DNS resolution failed` | Wrong hostname | Verify MongoDB connection string |
| `Authentication failed` | Wrong credentials | Check username/password in connection string |
| `Connection timeout` | Network/firewall issue | Add `0.0.0.0/0` to MongoDB Atlas IP whitelist |
| `ECONNREFUSED` | MongoDB not running | Check MongoDB Atlas cluster status |

**Troubleshooting Steps:**

1. **Verify Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Ensure `MONGODB_URI` is set for Production environment
   - Click "Redeploy" after adding variables

2. **Check MongoDB Atlas Network Access**
   - MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is in IP Access List
   - Status should be "Active"

3. **Test Connection String Locally**
   ```bash
   # Set your production MongoDB URI temporarily
   MONGODB_URI="your-production-uri" node backend/scripts/check-mongo.js
   ```

4. **Check Deployment Logs**
   - Look for `[MONGO] ✅ Connected successfully`
   - Or `[MONGO] ❌ Connection failed`

#### ❌ CORS Errors

- Update `FRONTEND_URL` in backend environment variables
- Ensure frontend URL matches exactly (no trailing slash)
- Redeploy backend after changing environment variables

#### ❌ 404 Errors on API Routes

- Verify `backend/vercel.json` exists and is configured correctly
- Check deployment logs for build errors
- Ensure routes are defined in `server.js`

---

## 4. Environment Variables Reference

### Backend (.env)

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dia-lawyers

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://your-frontend.vercel.app

# Admin Authentication
ADMIN_PASSWORD=your-secure-password
```

### Frontend (.env)

```env
# Backend API URL
VITE_API_URL=https://your-backend.vercel.app
```

---

## 5. Quick Reference Commands

```bash
# Test MongoDB connection
node backend/scripts/check-mongo.js

# Check environment variables
node -e "require('dotenv').config(); console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'MISSING')"

# Seed database
node backend/seed.js

# Run verification script
node backend/scripts/verify-mongo.js
```

---

## 6. Production Checklist

Before deploying to production:

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network Access set to `0.0.0.0/0`
- [ ] Connection string tested locally with `check-mongo.js`
- [ ] `MONGODB_URI` set in Vercel environment variables
- [ ] `NODE_ENV=production` set in Vercel
- [ ] `FRONTEND_URL` set in backend environment variables
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] `/health` endpoint shows `"mongodb": "connected"`
- [ ] API endpoints returning data from MongoDB
- [ ] CORS working correctly between frontend and backend

---

## Support

If you encounter issues:
1. Run `node backend/scripts/check-mongo.js` to test connection
2. Check Vercel deployment logs
3. Verify all environment variables are set correctly
4. Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`


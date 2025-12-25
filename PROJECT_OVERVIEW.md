# DIA Lawyer Recommendation System - Complete Project Overview

## Project Summary
**DIA** is a full-stack lawyer recommendation and management platform that connects clients with lawyers based on case types, location, experience, and other criteria. The system includes lawyer registration, authentication, admin management, appointment booking, and real-time notifications.

---

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** bcrypt for password hashing
- **Environment:** dotenv for configuration
- **Dev Tools:** nodemon for hot-reloading

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React icons
- **Maps:** Leaflet & React Leaflet
- **Charts:** Recharts
- **HTTP Client:** Fetch API (custom apiClient wrapper)

---

## Project Structure

```
DIA_AGENTATHON/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection logic
│   ├── controllers/
│   │   ├── lawyerAuthController.js  # Lawyer registration/login
│   │   └── [other controllers]
│   ├── middleware/
│   │   └── mongodbConnection.js     # Ensure DB connection middleware
│   ├── models/
│   │   └── Lawyer.js                # Mongoose schema for lawyers
│   ├── routes/
│   │   ├── lawyerAuth.js            # Auth routes
│   │   ├── lawyers.js               # Lawyer CRUD
│   │   ├── bookings.js              # Booking management
│   │   ├── admin.js                 # Admin endpoints
│   │   ├── appointments.js          # Appointments
│   │   └── notifications.js         # Notifications
│   ├── scripts/
│   │   └── verify-mongo.js          # MongoDB verification script
│   ├── data/                        # JSON fallback data
│   ├── seed.js                      # Database seeding script
│   ├── server.js                    # Main Express server
│   ├── .env                         # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Route pages
│   │   │   ├── LawyersPage.tsx      # Browse lawyers
│   │   │   ├── LawyerRegisterPage.tsx
│   │   │   ├── LawyerLoginPage.tsx
│   │   │   ├── LawyerDashboard.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminCredentials.tsx # View all lawyer credentials
│   │   │   └── [other pages]
│   │   ├── utils/
│   │   │   └── apiClient.ts         # Centralized API client
│   │   ├── context/                 # React context providers
│   │   ├── App.tsx                  # Main app with routing
│   │   └── main.tsx                 # Entry point
│   ├── vite.config.ts               # Vite configuration with proxy
│   └── package.json
│
├── DEPLOYMENT.md                    # Deployment instructions
├── MONGODB_SETUP.md                 # MongoDB integration guide
└── DEPLOYMENT_NOTES.md              # Production deployment notes
```

---

## Core Features

### 1. **Lawyer Management**
- **Registration:** Lawyers can register with email, password, phone, case types, languages, experience, location
- **Authentication:** Secure login with bcrypt-hashed passwords
- **Profile:** Lawyers have profiles with bio, case types, pro bono status, etc.

### 2. **Client Features**
- **Search & Filter:** Find lawyers by case type, language, experience, gender, location
- **Booking:** Book appointments with lawyers
- **Notifications:** Real-time updates on bookings and appointments

### 3. **Admin Features**
- **Dashboard:** View all bookings, appointments, notifications
- **Credentials Management:** View all registered lawyers with their credentials (email/password)
- **Search & Export:** Search lawyers and export credentials as CSV

### 4. **Database**
- **Primary:** MongoDB for persistent storage
- **Fallback:** JSON files for development/offline mode
- **Verification:** Built-in script to test CRUD operations

---

## API Endpoints

### Lawyer Authentication
- `POST /api/lawyer-auth/register` - Register new lawyer
- `POST /api/lawyer-auth/login` - Login with email/password
- `GET /api/lawyer-auth/all` - Get all registered lawyers (with filters)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/credentials` - Fetch all lawyer credentials
- `GET /api/admin/credentials/search?query=term` - Search credentials

### Lawyers
- `GET /api/lawyers` - Get all lawyers
- `GET /api/lawyers/:id` - Get lawyer by ID
- `PATCH /api/lawyers/:id` - Update lawyer profile

### Bookings & Appointments
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get appointments

### Notifications
- `GET /api/notifications` - Get all notifications
- `PATCH /api/notifications/:id` - Mark notification as read

---

## Environment Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/dia-lawyers
PORT=5000
NODE_ENV=development
ADMIN_PASSWORD=admin123
```

### Frontend
- Uses Vite proxy to route `/api` requests to backend
- No explicit env file needed for local development
- For production: Set `VITE_API_URL` to backend URL

---

## Development Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally
```bash
# Terminal 1: Start backend
cd backend
npm run dev    # Runs on http://localhost:5000

# Terminal 2: Start frontend
cd frontend
npm run dev    # Runs on http://localhost:5173
```

### Database Setup
```bash
# Option 1: Use local MongoDB
# Ensure MongoDB is running on localhost:27017

# Option 2: Seed database with test data
cd backend
node seed.js

# Option 3: Verify MongoDB connection
node scripts/verify-mongo.js
```

---

## Key Technical Decisions

### 1. **CORS Handling**
- Backend allows `localhost:5173`, `localhost:3000`, `127.0.0.1` variants
- In development mode, CORS is fully permissive
- Frontend uses Vite proxy to avoid CORS issues entirely

### 2. **MongoDB Integration**
- Mongoose 9+ with modern async/await syntax
- Automatic fallback to JSON files if MongoDB unavailable
- Connection pooling optimized for serverless deployment

### 3. **Password Security**
- bcrypt with 10 salt rounds
- Passwords never returned in API responses (except admin credentials endpoint)
- Email uniqueness enforced at database level

### 4. **Frontend Architecture**
- TypeScript for type safety
- Centralized API client (`apiClient.ts`) for all HTTP requests
- React Router for client-side routing
- Tailwind CSS for responsive design

---

## Deployment

### Local Development
1. Start MongoDB locally or use MongoDB Atlas
2. Configure `backend/.env` with MongoDB URI
3. Run `npm run dev` in both backend and frontend

### Production (Vercel)
1. **MongoDB Atlas:**
   - Create cluster
   - Whitelist IP: `0.0.0.0/0` (for Vercel)
   - Get connection string

2. **Backend Deployment:**
   - Deploy `backend/` folder to Vercel
   - Set environment variables: `MONGODB_URI`, `NODE_ENV=production`, `ADMIN_PASSWORD`

3. **Frontend Deployment:**
   - Deploy `frontend/` folder to Vercel
   - Set `VITE_API_URL` to backend URL

---

## Testing & Verification

### MongoDB Verification
```bash
cd backend
node scripts/verify-mongo.js
```
This script:
- Connects to MongoDB (or falls back to in-memory)
- Creates a test lawyer record
- Reads the record
- Deletes the record
- Confirms all CRUD operations work

### Health Check
```bash
curl http://localhost:5000/health
```
Returns MongoDB connection status and server health.

---

## Common Issues & Solutions

### Port Already in Use (EADDRINUSE)
```bash
# Windows: Kill process on port 5000
netstat -ano | findstr :5000
taskkill /F /PID <PID>

# Or use PowerShell
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

### CORS Errors
- Ensure `vite.config.ts` has proxy configured
- Verify `apiClient.ts` uses relative URLs (empty base URL)
- Check backend CORS configuration allows your frontend origin

### MongoDB Connection Failed
- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For Atlas: Ensure IP whitelist includes `0.0.0.0/0`

---

## AI Assistant Prompt

Use this prompt to help any AI understand and work with this project:

```
You are working with the DIA Lawyer Recommendation System, a full-stack MERN application.

**Architecture:**
- Backend: Node.js + Express + MongoDB (Mongoose)
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Database: MongoDB with JSON fallback

**Key Files:**
- Backend entry: `backend/server.js`
- MongoDB config: `backend/config/db.js`
- Lawyer model: `backend/models/Lawyer.js`
- Frontend entry: `frontend/src/main.tsx`
- API client: `frontend/src/utils/apiClient.ts`
- Vite config: `frontend/vite.config.ts`

**Core Features:**
1. Lawyer registration/login with bcrypt authentication
2. Client search & filter lawyers by case type, location, experience
3. Booking & appointment management
4. Admin dashboard with credentials management
5. Real-time notifications

**API Endpoints:**
- `/api/lawyer-auth/*` - Registration, login, get all lawyers
- `/api/admin/*` - Admin login, credentials management
- `/api/lawyers/*` - Lawyer CRUD operations
- `/api/bookings/*` - Booking management
- `/api/appointments/*` - Appointment scheduling
- `/api/notifications/*` - Notification system

**Environment:**
- Backend runs on port 5000
- Frontend runs on port 5173 (Vite dev server)
- MongoDB: `mongodb://localhost:27017/dia-lawyers` (local) or MongoDB Atlas (production)
- Frontend uses Vite proxy to route `/api` to backend

**Development Commands:**
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`
- Seed DB: `cd backend && node seed.js`
- Verify MongoDB: `cd backend && node scripts/verify-mongo.js`

**Common Tasks:**
1. Adding new API endpoint: Create route in `backend/routes/`, add controller logic, import in `server.js`
2. Adding new page: Create component in `frontend/src/pages/`, add route in `App.tsx`
3. Database changes: Modify schema in `backend/models/`, run seed script
4. Fixing CORS: Check `vite.config.ts` proxy and `server.js` CORS config

**Important Notes:**
- Mongoose 9+ uses modern async/await (no `next()` callback in pre-save hooks)
- Frontend uses relative URLs to leverage Vite proxy
- Backend has automatic MongoDB fallback to JSON files
- All passwords are bcrypt-hashed (10 rounds)
- Admin can view all lawyer credentials via `/api/admin/credentials`

When helping with this project, always consider the full-stack context and maintain consistency between frontend and backend implementations.
```

---

## License
MIT

## Author
DIA Development Team

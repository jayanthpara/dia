# DIA Lawyer Assistant - Quick Start Guide

## Local Development Setup

### Prerequisites
- Node.js v14+ 
- MongoDB (local or Atlas)
- npm or yarn

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
```

For local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/dia-lawyers
```

For MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dia-lawyers?retryWrites=true&w=majority
```

#### Frontend (.env)
```bash
cd frontend
# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env
```

### 3. Start MongoDB (if local)

```bash
mongod
```

### 4. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm start
```

Backend runs on `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

## Testing the Application

### 1. Register as Lawyer
1. Open http://localhost:5173
2. Click "Register as Lawyer"
3. Fill form and submit
4. Should redirect to lawyers page

### 2. Login
1. Click "Lawyer Login"
2. Use registered credentials
3. Should see dashboard

### 3. Admin Panel
1. Go to http://localhost:5173/admin
2. Click login (no password needed for open access)
3. Should see registered lawyers list
4. Should see lawyer credentials

### 4. Check MongoDB
```bash
# MongoDB Shell
mongosh
use dia-lawyers
db.lawyers.find()
```

## API Endpoints

### Lawyer Authentication
- `POST /api/lawyer-auth/register` - Register new lawyer
- `POST /api/lawyer-auth/login` - Login lawyer
- `GET /api/lawyer-auth/all` - Get all registered lawyers

### Admin
- `GET /api/admin/credentials` - Get all lawyer credentials
- `POST /api/admin/login` - Admin login

### Appointments
- `GET /api/appointments` - Get appointments
- `PATCH /api/appointments/{id}` - Update appointment

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/{id}/read` - Mark as read

## File Structure

```
DIA_AGENTATHON/
├── backend/
│   ├── config/
│   │   └── db.js          # MongoDB configuration
│   ├── controllers/       # Request handlers
│   ├── models/            # Database schemas
│   ├── routes/            # API routes
│   ├── data/              # JSON fallback data
│   ├── .env              # Environment variables
│   ├── .env.example      # Example env file
│   └── server.js         # Main server file
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utility functions
│   │   ├── context/      # React context
│   │   └── App.tsx       # Main app component
│   ├── .env              # Environment variables
│   ├── .env.example      # Example env file
│   └── vite.config.ts    # Vite configuration
│
├── DEPLOYMENT.md         # Deployment guide
└── README.md            # This file
```

## Database Schema

### Lawyer
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "password": "String (hashed)",
  "phone": "String",
  "location": "String",
  "yearsExperience": "Number",
  "caseTypes": ["String"],
  "languages": ["String"],
  "isProBono": "Boolean",
  "bio": "String",
  "registeredAt": "Date"
}
```

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI is correct
- For Atlas, verify IP whitelist

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -i :5000
kill -9 <PID>

# Kill process on port 5173 (frontend)
lsof -i :5173
kill -9 <PID>
```

### CORS Error
- Check `VITE_API_URL` in frontend .env
- Ensure it matches backend URL
- Check backend CORS configuration

### Data Not Saving
- Check MongoDB connection
- Verify database user has write permissions
- Check browser console for errors

## Next Steps

1. For local development, follow steps above
2. For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)
3. Read MongoDB documentation for advanced queries
4. Customize admin password for security

## Support

- MongoDB: https://docs.mongodb.com/
- Vercel: https://vercel.com/docs
- Vite: https://vitejs.dev/
- Express: https://expressjs.com/

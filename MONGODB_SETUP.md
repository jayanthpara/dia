# MongoDB Integration - Lawyer Registration & Credentials System

## Overview
This system now uses MongoDB to store lawyer registration and login credentials. Admin can view all registered lawyers with their credentials in real-time.

## What Was Updated

### 1. **Backend MongoDB Setup**
- **Database Connection** (`config/db.js`): Connects to MongoDB with proper configuration
- **Lawyer Model** (`models/Lawyer.js`): Mongoose schema for storing lawyer data with bcrypt password hashing
- **Authentication Controller** (`controllers/lawyerAuthController.js`): Handles registration, login, and retrieval of registered lawyers
- **Auth Routes** (`routes/lawyerAuth.js`): 
  - `POST /api/lawyer-auth/register` - Register a new lawyer
  - `POST /api/lawyer-auth/login` - Login with email and password
  - `GET /api/lawyer-auth/all` - Get all registered lawyers (with filters)
- **Admin Routes** (`routes/admin.js`): 
  - `GET /api/admin/credentials` - Fetch all lawyer credentials
  - `GET /api/admin/credentials/search?query=searchterm` - Search credentials

### 2. **Frontend Updates**
- **LawyersPage** (`pages/LawyersPage.tsx`): Now fetches only registered lawyers from MongoDB via `/api/lawyer-auth/all`
- **AdminCredentials** (`pages/AdminCredentials.tsx`): New admin panel to view all lawyer credentials with search and export features
- **AdminDashboard** (`pages/AdminDashboard.tsx`): Added link to Credentials manager
- **App.tsx**: Added route `/admin/credentials` for admin credentials page

### 3. **Database Seeding**
- **seed.js**: Script to populate MongoDB with initial lawyer data from JSON file
- Automatically generates email and password for each lawyer

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running locally or connection string available
- npm packages installed

### Step 1: Install Dependencies
```bash
cd backend
npm install
cd ../frontend
npm install
```

### Step 2: Configure MongoDB
Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/dia-lawyers
PORT=5000
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

Or use MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dia-lawyers
```

### Step 3: Seed the Database
```bash
cd backend
node seed.js
```

This will:
- Connect to MongoDB
- Clear existing lawyers
- Create 6 registered lawyers from JSON data
- Display their credentials for reference

### Step 4: Start the Servers

**Backend:**
```bash
cd backend
npm start
# or for development
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Generated Lawyer Credentials

After seeding, the following lawyers will be registered:

| Name | Email | Password | Phone |
|------|-------|----------|-------|
| Aisha Khan | aisha.khan@lawyer.com | AishaPass123! | +92-300-1234567 |
| Bilal Ahmed | bilal.ahmed@lawyer.com | BilalPass123! | +92-21-33334444 |
| Chen Li | chen.li@lawyer.com | ChenPass123! | +86-10-88889999 |
| Dina Rodriguez | dina.rodriguez@lawyer.com | DinaPass123! | +34-91-555666 |
| Ethan Smith | ethan.smith@lawyer.com | EthanPass123! | +44-20-77778888 |
| Fatima Noor | fatima.noor@lawyer.com | FatimaPass123! | +92-51-4445556 |

## Features

### Public Features
- **Lawyers Page** (`/lawyers`): View all registered lawyers with filters
  - Filter by case type (criminal, civil, family, corporate, cyber)
  - Filter by language
  - Filter by gender
  - Filter by minimum experience
  - Only shows registered lawyers from MongoDB

### Admin Features
- **Admin Dashboard** (`/admin/dashboard`): View bookings, notifications, and appointments
- **Admin Credentials** (`/admin/credentials`): 
  - View all registered lawyers and their credentials
  - Search by name or email
  - Copy credentials with one click
  - View full details in a modal
  - Download credentials as CSV file
  - Real-time updates from MongoDB

## API Endpoints

### Lawyer Registration & Login
- `POST /api/lawyer-auth/register` - Register new lawyer
- `POST /api/lawyer-auth/login` - Login with email/password
- `GET /api/lawyer-auth/all` - Get all registered lawyers

### Admin Endpoints
- `GET /api/admin/credentials` - Fetch all credentials
- `GET /api/admin/credentials/search?query=term` - Search credentials
- `POST /api/admin/login` - Admin login

## Request/Response Examples

### Register a Lawyer
```bash
POST /api/lawyer-auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@lawyer.com",
  "password": "SecurePass123!",
  "phone": "+1-555-0000",
  "caseTypes": ["criminal", "civil"],
  "languages": ["English", "Spanish"],
  "yearsExperience": 5,
  "location": "New York, USA",
  "isProBono": false
}
```

### Login a Lawyer
```bash
POST /api/lawyer-auth/login
Content-Type: application/json

{
  "email": "aisha.khan@lawyer.com",
  "password": "AishaPass123!"
}
```

### Get Registered Lawyers
```bash
GET /api/lawyer-auth/all?type=criminal&language=English&minExperience=5
```

Response:
```json
{
  "success": true,
  "count": 2,
  "lawyers": [
    {
      "_id": "...",
      "name": "Aisha Khan",
      "email": "aisha.khan@lawyer.com",
      "phone": "+92-300-1234567",
      "caseTypes": ["criminal", "family"],
      "yearsExperience": 8,
      "location": "Lahore, Pakistan",
      "isProBono": true,
      "registeredAt": "2024-06-15T10:30:00Z"
    }
  ]
}
```

### Get Admin Credentials
```bash
GET /api/admin/credentials
```

Response:
```json
{
  "success": true,
  "count": 6,
  "credentials": [
    {
      "id": "...",
      "name": "Aisha Khan",
      "email": "aisha.khan@lawyer.com",
      "password": "$2b$10$...", // hashed
      "phone": "+92-300-1234567",
      "caseTypes": ["criminal", "family"],
      "yearsExperience": 8,
      "registeredAt": "2024-06-15T10:30:00Z",
      "isProBono": true
    }
  ]
}
```

## Real-time Updates

The system now provides:
- ✅ Real-time lawyer registration and login
- ✅ Immediate availability in the lawyers search
- ✅ Live admin credential viewing
- ✅ Instant search and filtering
- ✅ No file system dependencies (pure MongoDB)

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- Email unique constraint
- Input validation
- Secure password storage (never returned in API responses except to admin)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in `.env`
- Verify network connectivity for MongoDB Atlas

### Seeding Error
- Ensure MongoDB is running
- Clear any existing data: `node -e "const Lawyer = require('./models/Lawyer'); Lawyer.deleteMany({});"`
- Run seed again: `node seed.js`

### Lawyers Not Appearing
- Verify database seeding completed
- Check browser console for API errors
- Ensure backend is running on port 5000

## Next Steps

- [ ] Add lawyer profile edit functionality
- [ ] Implement password reset
- [ ] Add admin user management
- [ ] Add appointment scheduling
- [ ] Implement payment integration
- [ ] Add email notifications

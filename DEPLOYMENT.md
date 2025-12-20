# DIA Lawyer Assistant - Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account** - https://www.mongodb.com/cloud/atlas (Free tier available)
2. **Vercel Account** - https://vercel.com (Free tier available)
3. **Git Repository** - GitHub, GitLab, or Bitbucket

## Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new project
4. Create a cluster (M0 free tier is sufficient)
5. Create a database user with a strong password
6. Whitelist IP address (allow all: 0.0.0.0/0)

### 1.2 Get Connection String

1. In Atlas, go to "Database" → Click "Connect"
2. Copy the connection string
3. Replace `<username>` and `<password>` with your database credentials
4. Replace `<database-name>` with `dia-lawyers`

**Format:** `mongodb+srv://username:password@cluster.mongodb.net/dia-lawyers?retryWrites=true&w=majority`

## Step 2: Prepare Backend for Deployment

### 2.1 Backend Environment Variables

Create `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dia-lawyers?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
ADMIN_PASSWORD=your-secure-password-here
FRONTEND_URL=https://your-frontend.vercel.app
```

### 2.2 Ensure package.json has correct scripts

The backend `package.json` should have:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  }
}
```

## Step 3: Deploy Backend to Vercel

### 3.1 Push Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3.2 Deploy Backend

1. Go to https://vercel.com/new
2. Select your Git repository
3. Set project name (e.g., `dia-backend`)
4. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `ADMIN_PASSWORD` - Your admin password
   - `FRONTEND_URL` - Your frontend Vercel URL
   - `NODE_ENV` - Set to `production`

5. Deploy!

### 3.3 Note Backend URL

After deployment, you'll get a URL like: `https://dia-backend.vercel.app`

Save this URL - you'll need it for the frontend.

## Step 4: Prepare Frontend for Deployment

### 4.1 Frontend Environment Variables

Update `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend.vercel.app
```

Replace with the actual backend URL from Step 3.3

### 4.2 Ensure frontend build script exists

Check `frontend/package.json` has:

```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview"
  }
}
```

### 4.3 Frontend Routing Configuration

The frontend includes a `vercel.json` file that automatically handles client-side routing. This ensures:
- `/admin` → Serves index.html → React Router handles the route
- `/admin/dashboard` → Serves index.html → React Router handles the route
- `/admin/credentials` → Serves index.html → React Router handles the route
- All other routes → Serves index.html → React Router handles the route

**This allows users to:**
- Access `/admin` directly from the URL bar
- Access `/admin/dashboard` directly from the URL bar
- Access `/admin/credentials` directly from the URL bar
- Share admin panel links with other users
- Bookmark admin panel pages

**No additional configuration needed** - the `vercel.json` is already set up correctly.

## Step 5: Deploy Frontend to Vercel

### 5.1 Create Frontend Project

1. Go to https://vercel.com/new
2. Select your Git repository again
3. Change "Root Directory" to `frontend`
4. Set project name (e.g., `dia-frontend`)
5. Add environment variable:
   - `VITE_API_URL` - Your backend Vercel URL

6. Deploy!

## Step 6: Update Backend CORS Settings

Once frontend is deployed, update backend `.env`:

```env
FRONTEND_URL=https://your-frontend.vercel.app
```

Then redeploy the backend on Vercel by:

1. Go to Vercel project settings
2. Update environment variable `FRONTEND_URL`
3. Redeploy

## Step 7: Test Deployment

### 7.1 Test Lawyer Registration

1. Go to your frontend URL
2. Click "Register as Lawyer"
3. Fill out the form
4. Submit
5. Check if it creates in MongoDB

### 7.2 Test Admin Panel

1. Go to `https://your-frontend.vercel.app/admin`
2. Login with your `ADMIN_PASSWORD`
3. Check if registered lawyers appear

### 7.3 Check MongoDB

1. Go to MongoDB Atlas
2. Open Database → Collections
3. Look for `lawyers` collection
4. Verify data is being stored

## Troubleshooting

### Issue: "MongoDB connection failed"

**Solution:** 
- Check MONGODB_URI is correct
- Ensure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- Verify database user has correct password

### Issue: "CORS error when fetching from frontend"

**Solution:**
- Update `FRONTEND_URL` environment variable in backend
- Redeploy backend
- Check that frontend URL matches exactly

### Issue: "API returns 404"

**Solution:**
- Ensure backend is deployed and running
- Check API URL in frontend is correct
- Verify routes are properly defined in backend

### Issue: "Vercel Function timed out"

**Solution:**
- This might happen if MongoDB connection is slow
- Ensure MongoDB Atlas cluster is active
- Consider upgrading from M0 tier if needed

### Issue: "Cannot access /admin directly from URL - Get 404 error"

**Solution:**
The `frontend/vercel.json` file is already configured to handle this:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration ensures:
- All routes (including `/admin`, `/admin/dashboard`, `/admin/credentials`) are rewritten to `/index.html`
- React Router then handles the route on the client side
- Users can access admin panel directly from URL bar
- Users can bookmark admin panel links
- Users can share admin panel URLs

**Verify it's working:**
1. Deploy frontend to Vercel
2. Try accessing: `https://your-frontend.vercel.app/admin` directly
3. Should load without 404 error
4. React Router redirects to AdminPanel component

### Issue: "Routes work on localhost but not on Vercel"

**Causes & Solutions:**

1. **Missing vercel.json in frontend directory**
   - Solution: Ensure `frontend/vercel.json` exists with rewrites configuration

2. **Wrong root directory selected**
   - When deploying frontend, Vercel root directory should be `frontend`
   - Settings → Framework Override → should be "Other"

3. **Build directory mismatch**
   - Frontend build output should be in `dist` folder
   - Vercel automatically detects this for Vite projects

## Environment Variables Summary

### Backend (.env)

| Variable | Example | Description |
|----------|---------|-------------|
| MONGODB_URI | `mongodb+srv://...` | MongoDB Atlas connection string |
| PORT | 5000 | Server port (Vercel sets this) |
| NODE_ENV | production | Environment mode |
| ADMIN_PASSWORD | your-password | Admin dashboard password |
| FRONTEND_URL | https://dia-frontend.vercel.app | Frontend URL for CORS |

### Frontend (.env.production)

| Variable | Example | Description |
|----------|---------|-------------|
| VITE_API_URL | https://dia-backend.vercel.app | Backend API URL |

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database credentials set
- [ ] Backend `.env` configured with MongoDB URI
- [ ] Backend deployed to Vercel
- [ ] Backend URL noted
- [ ] Frontend `vercel.json` checked (routing configuration)
- [ ] Frontend `.env.production` updated with backend URL
- [ ] Frontend deployed to Vercel
- [ ] Frontend root directory set to `frontend` folder
- [ ] Backend environment variable `FRONTEND_URL` updated
- [ ] Backend redeployed
- [ ] Tested lawyer registration
- [ ] Tested direct URL access to `/admin`
- [ ] Tested direct URL access to `/admin/dashboard`
- [ ] Tested direct URL access to `/admin/credentials`
- [ ] Tested admin panel
- [ ] Verified data in MongoDB

## Support

For issues with:
- **MongoDB**: https://docs.mongodb.com/atlas
- **Vercel**: https://vercel.com/docs
- **Application**: Check error logs in Vercel dashboard

## Notes

- Keep MongoDB credentials secure
- Use strong passwords for admin
- Regularly backup important data
- Monitor Vercel usage (free tier limits apply)

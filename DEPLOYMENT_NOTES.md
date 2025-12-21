# Deployment Notes for DIA Project

## Production Deployment Issues & Solutions

### MongoDB Connection Timeout on Vercel

**Issue**: `Operation 'lawyers.findOne()' buffering timed out after 10000ms`

**Cause**: 
- MongoDB Atlas IP whitelist might not include Vercel's dynamic IP addresses
- Serverless functions have stricter connection pooling requirements

**Solution**:
1. **MongoDB Atlas Whitelist** (CRITICAL):
   - Go to MongoDB Atlas Dashboard → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - OR add specific Vercel IP ranges
   - This is required for Vercel serverless functions

2. **Fallback Mechanism**:
   - System now has automatic JSON fallback for timeout/connection errors
   - Registrations will work even if MongoDB is temporarily unavailable
   - Data will be stored in JSON files until MongoDB is accessible

3. **Timeout Settings**:
   - Increased `serverSelectionTimeoutMS` to 30000ms
   - Increased `socketTimeoutMS` to 60000ms
   - Added connection pool optimization for serverless

### Registration & Login Strategy

**Registration**:
- ✅ Primary: MongoDB (required for new registrations)
- ✅ Fallback: JSON files (if MongoDB unavailable)
- Ensures registrations always work

**Login**:
- ✅ Primary: MongoDB (for new registrations)
- ✅ Fallback: JSON files (for default lawyers)
- Works with both MongoDB and JSON data

**Get All Lawyers**:
- ✅ Primary: MongoDB
- ✅ Fallback: JSON (default data)
- Combines both sources

### Environment Variables Required

For Vercel deployment, ensure these are set:

```env
MONGODB_URI=mongodb+srv://proctor:123456proctor@cluster0.df5u4vr.mongodb.net/dia-lawyers?retryWrites=true&w=majority
NODE_ENV=production
ADMIN_PASSWORD=admin123
FRONTEND_URL=https://your-frontend-domain.vercel.app
PORT=5000
```

### Testing Registration on Vercel

If you get a timeout error:

1. **Check MongoDB Atlas IP Whitelist** (Most Common Issue)
   - Whitelist `0.0.0.0/0` or Vercel IPs
   
2. **Check MongoDB Connection String**
   - Ensure username/password are correct
   - Test in MongoDB Atlas shell

3. **Monitor Backend Logs**
   - Check Vercel Function logs
   - Look for "MongoDB connected" or fallback messages

4. **Fallback Works**
   - If MongoDB is down, JSON fallback will store data
   - Data will sync to MongoDB when it comes back online

### Image Issues

The placeholder image errors (`via.placeholder.com`) are non-critical:
- Replace with actual images from your public folder
- No functional impact on the application

### Next Steps for Production

1. ✅ Verify MongoDB Atlas IP whitelist includes Vercel
2. ✅ Deploy frontend to Vercel/Netlify
3. ✅ Deploy backend to Vercel
4. ✅ Test registration and login flows
5. ✅ Monitor error logs for any timeouts

// Simple admin auth middleware - checks header 'x-admin-password' against ADMIN_PASSWORD env var
// Modified: allow access when no password is provided (so admin panel can be opened without entering password)
module.exports = function adminAuth(req, res, next) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const provided = req.headers['x-admin-password'] || req.body?.password || req.query?.password;

  // If no password provided, allow access (open admin mode)
  if (!provided) {
    console.warn('Admin auth: no password provided — allowing access in open mode');
    return next();
  }

  if (provided !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized (invalid admin password)' });
  }

  next();
};
const jwt = require('jsonwebtoken');
function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Access denied. No token provided.' });
  try { req.user = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET || 'safe-route-secret'); next(); }
  catch (error) { return res.status(401).json({ message: 'Invalid token.' }); }
}
module.exports = auth;

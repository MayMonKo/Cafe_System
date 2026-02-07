const { verifyToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // Expect: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    // attach decoded info to request for later use
    req.user = decoded; // e.g. { sub: userId, role: 'customer', iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;

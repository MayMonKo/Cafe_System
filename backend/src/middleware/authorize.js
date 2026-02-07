function authorize(allowedRoles = []) {
  return (req, res, next) => {
    // requireAuth must run BEFORE this
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Forbidden: insufficient permissions',
      });
    }

    next();
  };
}

module.exports = authorize;

const verifyRole = (...allowedRoles) => (req, res, next) => {
  if (!req.auth) return res.status(401).json({ success: false, error: { code: "UNAUTHENTICATED", message: "Authentication is required" } });
  if (!allowedRoles.includes(req.auth.role)) {
    return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "You do not have permission to access this resource" } });
  }
  return next();
};

export default verifyRole;

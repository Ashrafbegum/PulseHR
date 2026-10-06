import { verifyToken as verifyJwt } from "../services/tokenService.js";

const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ success: false, error: { code: "UNAUTHENTICATED", message: "Authentication is required" } });

  try {
    req.auth = verifyJwt(token, "access");
    return next();
  } catch (error) {
    return next(error);
  }
};

export default verifyToken;

import jwt from "jsonwebtoken";
import { getAuthConfig } from "../../config/auth.config.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { jwt: jwtConfig } = getAuthConfig();
    const decoded = jwt.verify(token, jwtConfig.secret);

    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

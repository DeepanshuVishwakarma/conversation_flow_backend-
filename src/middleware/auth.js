const jwt = require("jsonwebtoken");
const AppError = require("../utils/errors/error");
const { status_code } = require("../utils/statics/statics");

module.exports = (req, res, next) => {
  // Support both:
  // 1) Authorization: <token>
  // 2) Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

// const token = authHeader && authHeader.split(' ')[1];
// console.log("Extracted Token:", token)
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  
  if (!token) {
    return next(new AppError("No token", status_code.UNAUTHORIZED));
  }

  try {
    const jwtSecret = process.env.JWT_SECRET?.trim();
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    next(new AppError("Invalid token", status_code.UNAUTHORIZED));
  }
};

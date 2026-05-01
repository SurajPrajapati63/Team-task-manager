const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

async function protect(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      throw new ApiError(401, "Authentication token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.is_active === false) {
      throw new ApiError(401, "User is not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.name === "JsonWebTokenError" ? new ApiError(401, "Invalid token") : error);
  }
}

function authorize(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    next();
  };
}

module.exports = { protect, authorize };

const ApiError = require("../utils/apiError");

function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Internal server error",
    details: error.details || undefined
  });
}

module.exports = { notFound, errorHandler };

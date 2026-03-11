export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
};

export const logger = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};
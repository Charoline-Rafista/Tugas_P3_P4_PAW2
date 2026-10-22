function notFoundHandler(req, res, next) {
  const error = new Error(`Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Terjadi kesalahan pada server";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((item) => item.message).join(", ");
  } else if (err.name === "CastError" || err.name === "BSONError") {
    statusCode = 400;
    message = "Format ID atau nilai data tidak valid";
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Data duplikat";
  } else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Format JSON pada request body tidak valid";
  }

  if (statusCode >= 500) console.error(err);
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {})
  });
}

module.exports = { notFoundHandler, errorHandler };

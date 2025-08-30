// src/middlewares/errorHandler.js
export function notFound(req, res, next) {
  res.status(404).json({ error: "Not Found", path: req.originalUrl });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV !== "production") console.error(err);
  res.status(status).json({ error: message });
}

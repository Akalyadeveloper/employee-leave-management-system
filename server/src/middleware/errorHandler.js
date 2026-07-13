export const notFound = (req, res, next) => {
  res.status(404)
  next(new Error(`Route not found - ${req.originalUrl}`))
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode || 500
  res.status(statusCode)
  res.json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}

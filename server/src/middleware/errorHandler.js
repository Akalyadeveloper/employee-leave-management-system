import logger from '../utils/logger.js'

export const notFound = (req, res, next) => {
  logger.warn('Router', `Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404)
  next(new Error(`Route not found - ${req.originalUrl}`))
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode || 500
  logger.error('Error', err.message, {
    statusCode,
    method: req.method,
    path: req.originalUrl,
    stack: process.env.NODE_ENV !== 'production' ? err.stack?.split('\n')[1]?.trim() : undefined,
  })
  res.status(statusCode)
  res.json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}

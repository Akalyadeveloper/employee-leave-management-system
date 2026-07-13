/**
 * Simple logger utility for consistent logging across the backend
 * Logs include timestamps and are formatted for easy reading in Vercel logs
 */

const getTimestamp = () => new Date().toISOString()

const formatMessage = (level, context, message, meta = {}) => {
  const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : ''
  return `[${getTimestamp()}] [${level}] [${context}] ${message}${metaStr}`
}

export const logger = {
  info: (context, message, meta = {}) => {
    console.log(formatMessage('INFO', context, message, meta))
  },

  warn: (context, message, meta = {}) => {
    console.warn(formatMessage('WARN', context, message, meta))
  },

  error: (context, message, meta = {}) => {
    console.error(formatMessage('ERROR', context, message, meta))
  },

  debug: (context, message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatMessage('DEBUG', context, message, meta))
    }
  },

  // Log HTTP requests
  request: (req, message = 'Incoming request') => {
    console.log(formatMessage('HTTP', 'Request', message, {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent')?.substring(0, 50),
    }))
  },

  // Log HTTP responses
  response: (req, res, message = 'Response sent') => {
    console.log(formatMessage('HTTP', 'Response', message, {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
    }))
  },
}

export default logger

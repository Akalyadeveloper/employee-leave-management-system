import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import logger from '../utils/logger.js'

const getTokenFromRequest = (req) => {
  if (req.cookies?.token) return req.cookies.token
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    return header.split(' ')[1]
  }
  return null
}

export const protect = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      logger.debug('Auth', 'No token provided', { path: req.originalUrl })
      return res.status(401).json({ message: 'Not authorized' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      logger.warn('Auth', 'Token valid but user not found', { userId: decoded.id })
      return res.status(401).json({ message: 'User not found' })
    }
    req.user = user
    logger.debug('Auth', 'User authenticated', { userId: user._id, role: user.role })
    next()
  } catch (error) {
    logger.warn('Auth', 'Authentication failed', { error: error.message })
    res.status(401).json({ message: 'Not authorized' })
  }
}

export const requireManager = (req, res, next) => {
  if (req.user?.role !== 'manager') {
    logger.warn('Auth', 'Manager access denied', { userId: req.user?._id, role: req.user?.role })
    return res.status(403).json({ message: 'Managers only' })
  }
  next()
}

export const requireEmployee = (req, res, next) => {
  if (req.user?.role !== 'employee') {
    logger.warn('Auth', 'Employee access denied', { userId: req.user?._id, role: req.user?.role })
    return res.status(403).json({ message: 'Employees only' })
  }
  next()
}

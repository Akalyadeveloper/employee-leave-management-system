import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

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
      return res.status(401).json({ message: 'Not authorized' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    req.user = user
    next()
  } catch (error) {
    console.error('Auth error', error.message)
    res.status(401).json({ message: 'Not authorized' })
  }
}

export const requireManager = (req, res, next) => {
  if (req.user?.role !== 'manager') {
    return res.status(403).json({ message: 'Managers only' })
  }
  next()
}

export const requireEmployee = (req, res, next) => {
  if (req.user?.role !== 'employee') {
    return res.status(403).json({ message: 'Employees only' })
  }
  next()
}

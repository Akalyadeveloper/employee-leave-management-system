import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { validate, registerSchema, loginSchema } from '../utils/validators.js'
import { DEFAULT_LEAVE_BALANCE } from '../utils/constants.js'

const cookieConfig = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  leaveBalance: user.leaveBalance,
})

const issueToken = (res, user, statusCode = 200) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
  res.cookie('token', token, cookieConfig)
  return res.status(statusCode).json({ user: formatUser(user) })
}

export const register = async (req, res, next) => {
  try {
    const data = validate(registerSchema, req.body)
    const existing = await User.findOne({ email: data.email })
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' })
    }
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      leaveBalance: { ...DEFAULT_LEAVE_BALANCE },
    })
    issueToken(res, user, 201)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const data = validate(loginSchema, req.body)
    const user = await User.findOne({ email: data.email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const match = await bcrypt.compare(data.password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    issueToken(res, user)
  } catch (error) {
    next(error)
  }
}

export const me = async (req, res) => {
  res.json({ user: formatUser(req.user) })
}

export const logout = (req, res) => {
  res.clearCookie('token', cookieConfig)
  res.json({ message: 'Logged out' })
}

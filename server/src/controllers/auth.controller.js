import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { validate, registerSchema, loginSchema } from '../utils/validators.js'
import { DEFAULT_LEAVE_BALANCE } from '../utils/constants.js'
import logger from '../utils/logger.js'

// For cross-domain cookies (frontend and backend on different domains)
const cookieConfig = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  leaveBalance: user.leaveBalance,
  phone: user.phone || '',
  department: user.department || '',
  designation: user.designation || '',
  dateOfBirth: user.dateOfBirth || null,
  address: user.address || '',
  city: user.city || '',
  state: user.state || '',
  zipCode: user.zipCode || '',
  employeeId: user.employeeId || '',
  joinDate: user.joinDate || null,
  emergencyContact: user.emergencyContact || '',
  emergencyPhone: user.emergencyPhone || '',
  bio: user.bio || '',
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
    logger.info('Auth', 'Registration attempt', { email: req.body.email, role: req.body.role })
    const data = validate(registerSchema, req.body)
    const existing = await User.findOne({ email: data.email })
    if (existing) {
      logger.warn('Auth', 'Registration failed - email exists', { email: data.email })
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
    logger.info('Auth', 'Registration successful', { userId: user._id, email: user.email, role: user.role })
    issueToken(res, user, 201)
  } catch (error) {
    logger.error('Auth', 'Registration error', { error: error.message })
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    logger.info('Auth', 'Login attempt', { email: req.body.email })
    const data = validate(loginSchema, req.body)
    const user = await User.findOne({ email: data.email })
    if (!user) {
      logger.warn('Auth', 'Login failed - user not found', { email: data.email })
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const match = await bcrypt.compare(data.password, user.password)
    if (!match) {
      logger.warn('Auth', 'Login failed - wrong password', { email: data.email })
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    logger.info('Auth', 'Login successful', { userId: user._id, email: user.email })
    issueToken(res, user)
  } catch (error) {
    logger.error('Auth', 'Login error', { error: error.message })
    next(error)
  }
}

export const me = async (req, res) => {
  logger.debug('Auth', 'User info requested', { userId: req.user._id })
  res.json({ user: formatUser(req.user) })
}

export const updateProfile = async (req, res, next) => {
  try {
    logger.info('Auth', 'Profile update attempt', { userId: req.user._id })
    const { name, phone, department, designation, dateOfBirth, address, city, state, zipCode, emergencyContact, emergencyPhone, bio } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        phone: phone || req.user.phone,
        department: department || req.user.department,
        designation: designation || req.user.designation,
        dateOfBirth: dateOfBirth || req.user.dateOfBirth,
        address: address || req.user.address,
        city: city || req.user.city,
        state: state || req.user.state,
        zipCode: zipCode || req.user.zipCode,
        emergencyContact: emergencyContact || req.user.emergencyContact,
        emergencyPhone: emergencyPhone || req.user.emergencyPhone,
        bio: bio || req.user.bio,
      },
      { new: true, runValidators: true },
    )

    logger.info('Auth', 'Profile updated successfully', { userId: req.user._id })
    res.json({ user: formatUser(updatedUser), message: 'Profile updated successfully' })
  } catch (error) {
    logger.error('Auth', 'Profile update error', { error: error.message })
    next(error)
  }
}

export const logout = (req, res) => {
  logger.info('Auth', 'User logged out', { userId: req.user._id })
  res.clearCookie('token', cookieConfig)
  res.json({ message: 'Logged out' })
}

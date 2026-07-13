import { z } from 'zod'
import { ALLOWED_ROLES, LEAVE_TYPES } from './constants.js'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(ALLOWED_ROLES).default('employee'),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

export const leaveSchema = z.object({
  leaveType: z.enum(LEAVE_TYPES),
  startDate: z.string().nonempty('Start date is required'),
  endDate: z.string().nonempty('End date is required'),
  reason: z.string().min(5, 'Reason helps managers decide'),
})

export const statusSchema = z.object({
  managerComment: z.string().optional(),
})

export const validate = (schema, payload) => {
  const result = schema.safeParse(payload)
  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(', ')
    const error = new Error(message)
    error.statusCode = 400
    throw error
  }
  return result.data
}

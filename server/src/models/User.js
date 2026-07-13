import mongoose from 'mongoose'
import { DEFAULT_LEAVE_BALANCE } from '../utils/constants.js'

const leaveBalanceSchema = new mongoose.Schema(
  {
    sick: { type: Number, default: DEFAULT_LEAVE_BALANCE.sick },
    casual: { type: Number, default: DEFAULT_LEAVE_BALANCE.casual },
    vacation: { type: Number, default: DEFAULT_LEAVE_BALANCE.vacation },
  },
  { _id: false },
)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
    leaveBalance: { type: leaveBalanceSchema, default: () => ({ ...DEFAULT_LEAVE_BALANCE }) },
  },
  { timestamps: true },
)

userSchema.methods.hasEnoughLeave = function hasEnoughLeave(type, days) {
  return this.leaveBalance?.[type] >= days
}

userSchema.methods.useLeave = function useLeave(type, days) {
  if (!this.hasEnoughLeave(type, days)) {
    throw new Error('Not enough leave balance')
  }
  this.leaveBalance[type] -= days
  return this.leaveBalance[type]
}

userSchema.methods.restoreLeave = function restoreLeave(type, days) {
  this.leaveBalance[type] += days
  return this.leaveBalance[type]
}

export const User = mongoose.model('User', userSchema)

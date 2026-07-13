import mongoose from 'mongoose'
import { createModelProxy } from '../services/demoDb.js'

const leaveRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    leaveType: { type: String, enum: ['sick', 'casual', 'vacation'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    managerComment: { type: String },
  },
  { timestamps: true },
)

const mongooseModel = mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', leaveRequestSchema)

export const LeaveRequest = createModelProxy(mongooseModel, 'leaves')

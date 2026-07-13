import mongoose from 'mongoose'

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

export const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema)

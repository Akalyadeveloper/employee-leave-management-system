import { LeaveRequest } from '../models/LeaveRequest.js'
import { User } from '../models/User.js'
import { calculateTotalDays } from '../utils/date.js'
import { validate, leaveSchema, statusSchema } from '../utils/validators.js'

export const applyLeave = async (req, res, next) => {
  try {
    const data = validate(leaveSchema, req.body)
    const totalDays = calculateTotalDays(data.startDate, data.endDate)

    if (!req.user.hasEnoughLeave(data.leaveType, totalDays)) {
      return res.status(400).json({ message: 'Not enough leave balance' })
    }

    const leave = await LeaveRequest.create({
      user: req.user._id,
      leaveType: data.leaveType,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      totalDays,
      reason: data.reason,
    })

    res.status(201).json({ leave })
  } catch (error) {
    next(error)
  }
}

export const myRequests = async (req, res, next) => {
  try {
    const requests = await LeaveRequest.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ requests })
  } catch (error) {
    next(error)
  }
}

export const deleteLeave = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findOne({ _id: req.params.id, user: req.user._id })
    if (!leave) {
      return res.status(404).json({ message: 'Request not found' })
    }
    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled' })
    }
    await leave.deleteOne()
    res.json({ message: 'Request cancelled' })
  } catch (error) {
    next(error)
  }
}

export const myBalance = async (req, res) => {
  res.json({ balance: req.user.leaveBalance })
}

export const allRequests = async (req, res, next) => {
  try {
    const requests = await LeaveRequest.find().populate('user', 'name email role').sort({ createdAt: -1 })
    res.json({ requests })
  } catch (error) {
    next(error)
  }
}

export const pendingRequests = async (req, res, next) => {
  try {
    const requests = await LeaveRequest.find({ status: 'pending' })
      .populate('user', 'name email role')
      .sort({ createdAt: 1 })
    res.json({ requests })
  } catch (error) {
    next(error)
  }
}

const finalizeRequest = async (req, res, status) => {
  const leave = await LeaveRequest.findById(req.params.id).populate('user')
  if (!leave) {
    return res.status(404).json({ message: 'Request not found' })
  }
  if (leave.status !== 'pending') {
    return res.status(400).json({ message: 'Request already processed' })
  }

  const data = validate(statusSchema, req.body)

  if (status === 'approved') {
    if (!leave.user.hasEnoughLeave(leave.leaveType, leave.totalDays)) {
      return res.status(400).json({ message: 'Employee has insufficient balance' })
    }
    leave.user.useLeave(leave.leaveType, leave.totalDays)
    await leave.user.save()
  }

  leave.status = status
  leave.managerComment = data.managerComment
  await leave.save()

  res.json({ leave })
}

export const approveLeave = async (req, res, next) => {
  try {
    await finalizeRequest(req, res, 'approved')
  } catch (error) {
    next(error)
  }
}

export const rejectLeave = async (req, res, next) => {
  try {
    await finalizeRequest(req, res, 'rejected')
  } catch (error) {
    next(error)
  }
}

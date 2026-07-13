import { LeaveRequest } from '../models/LeaveRequest.js'
import { User } from '../models/User.js'
import { calculateTotalDays } from '../utils/date.js'
import { validate, leaveSchema, statusSchema } from '../utils/validators.js'
import logger from '../utils/logger.js'

export const applyLeave = async (req, res, next) => {
  try {
    logger.info('Leave', 'Leave application started', { userId: req.user._id, type: req.body.leaveType })
    const data = validate(leaveSchema, req.body)
    const totalDays = calculateTotalDays(data.startDate, data.endDate)

    if (!req.user.hasEnoughLeave(data.leaveType, totalDays)) {
      logger.warn('Leave', 'Insufficient balance', { userId: req.user._id, type: data.leaveType, requested: totalDays })
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

    logger.info('Leave', 'Leave applied successfully', { leaveId: leave._id, userId: req.user._id, days: totalDays })
    res.status(201).json({ leave })
  } catch (error) {
    logger.error('Leave', 'Apply leave error', { error: error.message })
    next(error)
  }
}

export const myRequests = async (req, res, next) => {
  try {
    logger.debug('Leave', 'Fetching user requests', { userId: req.user._id })
    const requests = await LeaveRequest.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ requests })
  } catch (error) {
    logger.error('Leave', 'Fetch requests error', { error: error.message })
    next(error)
  }
}

export const deleteLeave = async (req, res, next) => {
  try {
    logger.info('Leave', 'Cancel request', { userId: req.user._id, leaveId: req.params.id })
    const leave = await LeaveRequest.findOne({ _id: req.params.id, user: req.user._id })
    if (!leave) {
      logger.warn('Leave', 'Request not found for cancellation', { leaveId: req.params.id })
      return res.status(404).json({ message: 'Request not found' })
    }
    if (leave.status !== 'pending') {
      logger.warn('Leave', 'Cannot cancel non-pending request', { leaveId: req.params.id, status: leave.status })
      return res.status(400).json({ message: 'Only pending requests can be cancelled' })
    }
    await leave.deleteOne()
    logger.info('Leave', 'Request cancelled', { leaveId: req.params.id })
    res.json({ message: 'Request cancelled' })
  } catch (error) {
    logger.error('Leave', 'Delete leave error', { error: error.message })
    next(error)
  }
}

export const myBalance = async (req, res) => {
  logger.debug('Leave', 'Balance check', { userId: req.user._id })
  res.json({ balance: req.user.leaveBalance })
}

export const allRequests = async (req, res, next) => {
  try {
    logger.debug('Leave', 'Manager fetching all requests')
    const requests = await LeaveRequest.find().populate('user', 'name email role').sort({ createdAt: -1 })
    res.json({ requests })
  } catch (error) {
    logger.error('Leave', 'All requests error', { error: error.message })
    next(error)
  }
}

export const pendingRequests = async (req, res, next) => {
  try {
    logger.debug('Leave', 'Manager fetching pending requests')
    const requests = await LeaveRequest.find({ status: 'pending' })
      .populate('user', 'name email role')
      .sort({ createdAt: 1 })
    res.json({ requests })
  } catch (error) {
    logger.error('Leave', 'Pending requests error', { error: error.message })
    next(error)
  }
}

const finalizeRequest = async (req, res, status) => {
  logger.info('Leave', `Manager ${status} request`, { leaveId: req.params.id, managerId: req.user._id })
  const leave = await LeaveRequest.findById(req.params.id).populate('user')
  if (!leave) {
    logger.warn('Leave', 'Request not found for finalization', { leaveId: req.params.id })
    return res.status(404).json({ message: 'Request not found' })
  }
  if (leave.status !== 'pending') {
    logger.warn('Leave', 'Request already processed', { leaveId: req.params.id, status: leave.status })
    return res.status(400).json({ message: 'Request already processed' })
  }

  const data = validate(statusSchema, req.body)

  if (status === 'approved') {
    if (!leave.user.hasEnoughLeave(leave.leaveType, leave.totalDays)) {
      logger.warn('Leave', 'Approval failed - insufficient balance', { leaveId: req.params.id, userId: leave.user._id })
      return res.status(400).json({ message: 'Employee has insufficient balance' })
    }
    leave.user.useLeave(leave.leaveType, leave.totalDays)
    await leave.user.save()
  }

  leave.status = status
  leave.managerComment = data.managerComment
  await leave.save()

  logger.info('Leave', `Request ${status}`, { leaveId: leave._id, userId: leave.user._id })
  res.json({ leave })
}

export const approveLeave = async (req, res, next) => {
  try {
    await finalizeRequest(req, res, 'approved')
  } catch (error) {
    logger.error('Leave', 'Approve error', { error: error.message })
    next(error)
  }
}

export const rejectLeave = async (req, res, next) => {
  try {
    await finalizeRequest(req, res, 'rejected')
  } catch (error) {
    logger.error('Leave', 'Reject error', { error: error.message })
    next(error)
  }
}

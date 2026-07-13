import { LeaveRequest } from '../models/LeaveRequest.js'
import { User } from '../models/User.js'

export const employeeDashboard = async (req, res, next) => {
  try {
    const requests = await LeaveRequest.find({ user: req.user._id }).sort({ updatedAt: -1 })
    const summary = requests.reduce(
      (acc, request) => {
        acc.statusCounts[request.status] += 1
        if (request.status === 'approved') {
          acc.daysUsed[request.leaveType] += request.totalDays
        }
        return acc
      },
      {
        statusCounts: { pending: 0, approved: 0, rejected: 0 },
        daysUsed: { sick: 0, casual: 0, vacation: 0 },
      },
    )

    // Get upcoming approved leaves
    const upcoming = requests
      .filter((reqItem) => reqItem.status === 'approved' && new Date(reqItem.startDate) >= new Date())
      .slice(0, 3)

    // Get recent decisions (approved or rejected) - most recent first
    const recentDecisions = requests
      .filter((reqItem) => reqItem.status === 'approved' || reqItem.status === 'rejected')
      .slice(0, 5)

    res.json({
      totalRequests: requests.length,
      statusCounts: summary.statusCounts,
      daysUsed: summary.daysUsed,
      upcoming,
      recentDecisions,
      balance: req.user.leaveBalance,
    })
  } catch (error) {
    next(error)
  }
}

export const managerDashboard = async (req, res, next) => {
  try {
    const [pendingCount, approvedCount, rejectedCount, employeeCount, recentDecisions, pendingRequests] = await Promise.all([
      LeaveRequest.countDocuments({ status: 'pending' }),
      LeaveRequest.countDocuments({ status: 'approved' }),
      LeaveRequest.countDocuments({ status: 'rejected' }),
      User.countDocuments({ role: 'employee' }),
      LeaveRequest.find({ status: { $in: ['approved', 'rejected'] } })
        .populate('user', 'name email role')
        .sort({ updatedAt: -1 })
        .limit(5),
      LeaveRequest.find({ status: 'pending' })
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .limit(5),
    ])

    res.json({
      pendingCount,
      approvedCount,
      rejectedCount,
      employeeCount,
      recentDecisions,
      pendingRequests,
    })
  } catch (error) {
    next(error)
  }
}

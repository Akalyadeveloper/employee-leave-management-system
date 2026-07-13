import { LeaveRequest } from '../models/LeaveRequest.js'
import { User } from '../models/User.js'

export const employeeDashboard = async (req, res, next) => {
  try {
    const requests = await LeaveRequest.find({ user: req.user._id }).sort({ createdAt: -1 })
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

    const upcoming = requests
      .filter((reqItem) => new Date(reqItem.startDate) >= new Date())
      .slice(0, 3)

    res.json({
      totalRequests: requests.length,
      statusCounts: summary.statusCounts,
      daysUsed: summary.daysUsed,
      upcoming,
      balance: req.user.leaveBalance,
    })
  } catch (error) {
    next(error)
  }
}

export const managerDashboard = async (req, res, next) => {
  try {
    const [pendingCount, approvedCount, employeeCount, recent] = await Promise.all([
      LeaveRequest.countDocuments({ status: 'pending' }),
      LeaveRequest.countDocuments({ status: 'approved' }),
      User.countDocuments({ role: 'employee' }),
      LeaveRequest.find().populate('user', 'name role').sort({ createdAt: -1 }).limit(5),
    ])

    res.json({
      pendingCount,
      approvedCount,
      employeeCount,
      recent,
    })
  } catch (error) {
    next(error)
  }
}

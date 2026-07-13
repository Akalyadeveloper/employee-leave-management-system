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
    // Get date range for trend data (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const [
      pendingCount,
      approvedCount,
      rejectedCount,
      employeeCount,
      recentDecisions,
      pendingRequests,
      allRequestsForTrend,
      leaveTypeStats
    ] = await Promise.all([
      LeaveRequest.countDocuments({ status: 'pending' }),
      LeaveRequest.countDocuments({ status: 'approved' }),
      LeaveRequest.countDocuments({ status: 'rejected' }),
      User.countDocuments({ role: 'employee' }),
      LeaveRequest.find({ status: { $in: ['approved', 'rejected'] } })
        .populate('user', 'name email role department')
        .sort({ updatedAt: -1 })
        .limit(10),
      LeaveRequest.find({ status: 'pending' })
        .populate('user', 'name email role department')
        .sort({ createdAt: -1 })
        .limit(10),
      // Get all requests from last 6 months for trend chart
      LeaveRequest.find({ createdAt: { $gte: sixMonthsAgo } })
        .select('status leaveType createdAt')
        .sort({ createdAt: 1 }),
      // Get leave type distribution
      LeaveRequest.aggregate([
        { $group: { _id: '$leaveType', count: { $sum: 1 } } }
      ])
    ])

    // Process trend data by month
    const trendData = allRequestsForTrend.reduce((acc, request) => {
      const date = new Date(request.createdAt)
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, approved: 0, rejected: 0, pending: 0, total: 0 }
      }
      acc[monthKey][request.status]++
      acc[monthKey].total++
      return acc
    }, {})

    // Process leave type stats
    const leaveTypeData = leaveTypeStats.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, { sick: 0, casual: 0, vacation: 0 })

    res.json({
      pendingCount,
      approvedCount,
      rejectedCount,
      employeeCount,
      recentDecisions,
      pendingRequests,
      trendData: Object.values(trendData),
      leaveTypeData,
      totalRequests: pendingCount + approvedCount + rejectedCount
    })
  } catch (error) {
    next(error)
  }
}

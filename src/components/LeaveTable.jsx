import { formatDate, formatStatus } from '../utils/format.js'

const LeaveTable = ({ requests, onCancel, onApprove, onReject }) => {
  if (!requests?.length) {
    return <p className="empty-state">No leave requests yet.</p>
  }

  return (
    <div className="table-wrapper">
      <table className="leave-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Dates</th>
            <th>Total Days</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request.user?.name || 'Me'}</td>
              <td>{formatStatus(request.leaveType)}</td>
              <td>
                {formatDate(request.startDate)} - {formatDate(request.endDate)}
              </td>
              <td>{request.totalDays}</td>
              <td>
                <span className={`badge badge--${request.status}`}>
                  {formatStatus(request.status)}
                </span>
              </td>
              <td>{request.reason}</td>
              <td>
                {onCancel && request.status === 'pending' && (
                  <button className="btn btn--ghost" onClick={() => onCancel(request._id)}>
                    Cancel
                  </button>
                )}
                {onApprove && request.status === 'pending' && (
                  <div className="action-row">
                    <button className="btn btn--success" onClick={() => onApprove(request._id)}>
                      Approve
                    </button>
                    <button className="btn btn--danger" onClick={() => onReject(request._id)}>
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LeaveTable

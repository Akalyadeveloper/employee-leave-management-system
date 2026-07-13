import { formatDate, formatStatus } from '../utils/format.js'

const LeaveCard = ({ request, showEmployee = false, onCancel, onApprove, onReject }) => {
  const isPending = request.status === 'pending'
  const isApproved = request.status === 'approved'
  const isRejected = request.status === 'rejected'

  return (
    <div className={`leave-card leave-card--${request.status}`}>
      <div className="leave-card__header">
        <div className="leave-card__type">
          <span className={`leave-card__icon leave-card__icon--${request.leaveType}`}>
            {request.leaveType === 'sick' && '🏥'}
            {request.leaveType === 'casual' && '🏠'}
            {request.leaveType === 'vacation' && '🏖️'}
          </span>
          <div>
            <h4 className="leave-card__title">{formatStatus(request.leaveType)} Leave</h4>
            {showEmployee && request.user?.name && (
              <p className="leave-card__employee">by {request.user.name}</p>
            )}
          </div>
        </div>
        <span className={`badge badge--${request.status}`}>
          {formatStatus(request.status)}
        </span>
      </div>

      <div className="leave-card__body">
        <div className="leave-card__dates">
          <div className="leave-card__date-block">
            <span className="leave-card__date-label">From</span>
            <span className="leave-card__date-value">{formatDate(request.startDate)}</span>
          </div>
          <div className="leave-card__date-arrow">→</div>
          <div className="leave-card__date-block">
            <span className="leave-card__date-label">To</span>
            <span className="leave-card__date-value">{formatDate(request.endDate)}</span>
          </div>
          <div className="leave-card__days">
            <span className="leave-card__days-value">{request.totalDays}</span>
            <span className="leave-card__days-label">day{request.totalDays > 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="leave-card__reason">
          <span className="leave-card__reason-label">Reason</span>
          <p className="leave-card__reason-text">{request.reason}</p>
        </div>

        {(isApproved || isRejected) && request.managerComment && (
          <div className={`leave-card__decision leave-card__decision--${request.status}`}>
            <span className="leave-card__decision-label">
              {isApproved ? '✓ Manager Approved' : '✗ Manager Rejected'}
            </span>
            <p className="leave-card__decision-comment">"{request.managerComment}"</p>
          </div>
        )}

        {request.updatedAt && (isApproved || isRejected) && (
          <div className="leave-card__timestamp">
            Decision made on {formatDate(request.updatedAt)}
          </div>
        )}
      </div>

      {(onCancel || onApprove || onReject) && isPending && (
        <div className="leave-card__actions">
          {onCancel && (
            <button className="btn btn--secondary btn--sm" onClick={() => onCancel(request._id)}>
              Cancel Request
            </button>
          )}
          {onApprove && (
            <button className="btn btn--success btn--sm" onClick={() => onApprove(request._id)}>
              ✓ Approve
            </button>
          )}
          {onReject && (
            <button className="btn btn--danger btn--sm" onClick={() => onReject(request._id)}>
              ✗ Reject
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default LeaveCard

import { useEffect, useState, useCallback } from 'react'
import LeaveCard from '../../components/LeaveCard.jsx'
import useLeaveStore from '../../store/leaveStore.js'
import logger from '../../utils/logger.js'

const REFRESH_INTERVAL = 10000 // 10 seconds

const PendingRequests = () => {
  const { pendingRequests, fetchPendingRequests, approveRequest, rejectRequest, loading } = useLeaveStore()
  const [error, setError] = useState('')

  const loadData = useCallback(() => {
    fetchPendingRequests()
  }, [fetchPendingRequests])

  useEffect(() => {
    loadData()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      logger.debug('Pending', 'Auto-refreshing pending requests')
      loadData()
    }, REFRESH_INTERVAL)
    
    // Also refresh when tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        logger.debug('Pending', 'Tab visible - refreshing')
        loadData()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [loadData])

  const handleApprove = async (id) => {
    setError('')
    const comment = window.prompt('Add an optional comment for the employee:', 'Approved. Have a good break!') || ''
    try {
      await approveRequest(id, comment)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReject = async (id) => {
    setError('')
    const comment = window.prompt('Reason for rejection (required):', '')
    if (!comment) {
      setError('Please provide a reason for rejection')
      return
    }
    try {
      await rejectRequest(id, comment)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="stack">
      <section className="card">
        <div className="card__header">
          <h3>⏳ Pending Approvals ({pendingRequests.length})</h3>
          {loading && <span className="badge badge--pending">Refreshing...</span>}
        </div>
        {error && <p className="form__error">{error}</p>}
        
        {pendingRequests.length ? (
          <div className="leave-cards-grid">
            {pendingRequests.map((request) => (
              <LeaveCard 
                key={request._id} 
                request={request} 
                showEmployee
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">🎉 All caught up! No pending requests to review.</p>
        )}
      </section>
    </div>
  )
}

export default PendingRequests

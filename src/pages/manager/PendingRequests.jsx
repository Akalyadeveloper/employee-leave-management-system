import { useEffect, useState, useCallback } from 'react'
import LeaveTable from '../../components/LeaveTable.jsx'
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
    const comment = window.prompt('Add an optional comment for the employee', '') || ''
    try {
      await approveRequest(id, comment)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReject = async (id) => {
    setError('')
    const comment = window.prompt('Reason for rejection', '') || ''
    try {
      await rejectRequest(id, comment)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="card">
      <div className="card__header">
        <h3>Pending approvals</h3>
        {loading && <span className="badge">Working...</span>}
      </div>
      {error && <p className="form__error">{error}</p>}
      <LeaveTable requests={pendingRequests} onApprove={handleApprove} onReject={handleReject} />
    </section>
  )
}

export default PendingRequests

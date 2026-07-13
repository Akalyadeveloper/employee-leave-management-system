import { useEffect, useState, useCallback } from 'react'
import LeaveTable from '../../components/LeaveTable.jsx'
import useLeaveStore from '../../store/leaveStore.js'
import logger from '../../utils/logger.js'

const REFRESH_INTERVAL = 10000 // 10 seconds

const MyRequests = () => {
  const { myRequests, fetchMyRequests, cancelRequest, loading } = useLeaveStore()
  const [error, setError] = useState('')

  const loadData = useCallback(() => {
    fetchMyRequests()
  }, [fetchMyRequests])

  useEffect(() => {
    loadData()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      logger.debug('MyRequests', 'Auto-refreshing requests')
      loadData()
    }, REFRESH_INTERVAL)
    
    // Also refresh when tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        logger.debug('MyRequests', 'Tab visible - refreshing')
        loadData()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [loadData])

  const handleCancel = async (id) => {
    setError('')
    try {
      await cancelRequest(id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="card">
      <div className="card__header">
        <h3>My leave requests</h3>
        {loading && <span className="badge">Refreshing...</span>}
      </div>
      {error && <p className="form__error">{error}</p>}
      <LeaveTable requests={myRequests} onCancel={handleCancel} />
    </section>
  )
}

export default MyRequests

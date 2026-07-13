import { useEffect, useState, useCallback } from 'react'
import LeaveCard from '../../components/LeaveCard.jsx'
import useLeaveStore from '../../store/leaveStore.js'
import logger from '../../utils/logger.js'

const REFRESH_INTERVAL = 10000 // 10 seconds

const MyRequests = () => {
  const { myRequests, fetchMyRequests, cancelRequest, loading } = useLeaveStore()
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

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

  const filteredRequests = myRequests.filter(request => {
    if (filter === 'all') return true
    return request.status === filter
  })

  const counts = {
    all: myRequests.length,
    pending: myRequests.filter(r => r.status === 'pending').length,
    approved: myRequests.filter(r => r.status === 'approved').length,
    rejected: myRequests.filter(r => r.status === 'rejected').length,
  }

  return (
    <div className="stack">
      <section className="card">
        <div className="card__header">
          <h3>My Leave Requests</h3>
          {loading && <span className="badge badge--pending">Refreshing...</span>}
        </div>
        
        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({counts.all})
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            ⏳ Pending ({counts.pending})
          </button>
          <button 
            className={`filter-tab ${filter === 'approved' ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            ✓ Approved ({counts.approved})
          </button>
          <button 
            className={`filter-tab ${filter === 'rejected' ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            ✗ Rejected ({counts.rejected})
          </button>
        </div>

        {error && <p className="form__error">{error}</p>}
        
        {filteredRequests.length ? (
          <div className="leave-cards-grid">
            {filteredRequests.map((request) => (
              <LeaveCard 
                key={request._id} 
                request={request} 
                onCancel={request.status === 'pending' ? handleCancel : undefined}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            {filter === 'all' 
              ? 'No leave requests yet. Apply for leave to get started!' 
              : `No ${filter} requests found.`}
          </p>
        )}
      </section>
    </div>
  )
}

export default MyRequests

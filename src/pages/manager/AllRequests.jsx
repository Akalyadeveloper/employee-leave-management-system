import { useEffect, useState, useCallback } from 'react'
import LeaveCard from '../../components/LeaveCard.jsx'
import useLeaveStore from '../../store/leaveStore.js'
import logger from '../../utils/logger.js'

const REFRESH_INTERVAL = 10000 // 10 seconds

const AllRequests = () => {
  const { allRequests, fetchAllRequests, loading } = useLeaveStore()
  const [filter, setFilter] = useState('all')

  const loadData = useCallback(() => {
    fetchAllRequests()
  }, [fetchAllRequests])

  useEffect(() => {
    loadData()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      logger.debug('AllRequests', 'Auto-refreshing')
      loadData()
    }, REFRESH_INTERVAL)
    
    // Also refresh when tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        logger.debug('AllRequests', 'Tab visible - refreshing')
        loadData()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [loadData])

  const filteredRequests = allRequests.filter(request => {
    if (filter === 'all') return true
    return request.status === filter
  })

  const counts = {
    all: allRequests.length,
    pending: allRequests.filter(r => r.status === 'pending').length,
    approved: allRequests.filter(r => r.status === 'approved').length,
    rejected: allRequests.filter(r => r.status === 'rejected').length,
  }

  return (
    <div className="stack">
      <section className="card">
        <div className="card__header">
          <h3>📋 All Leave Requests</h3>
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

        {filteredRequests.length ? (
          <div className="leave-cards-grid">
            {filteredRequests.map((request) => (
              <LeaveCard 
                key={request._id} 
                request={request} 
                showEmployee
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            {filter === 'all' 
              ? 'No leave requests found.' 
              : `No ${filter} requests found.`}
          </p>
        )}
      </section>
    </div>
  )
}

export default AllRequests

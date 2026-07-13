import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import StatsGrid from '../../components/StatsGrid.jsx'
import LeaveCard from '../../components/LeaveCard.jsx'
import LeaveStatusChart from '../../components/charts/LeaveStatusChart.jsx'
import LeavesTrendChart from '../../components/charts/LeavesTrendChart.jsx'
import { api } from '../../api/client.js'
import { formatDate } from '../../utils/format.js'
import logger from '../../utils/logger.js'

const REFRESH_INTERVAL = 10000 // 10 seconds

const ManagerDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const response = await api.get('/dashboard/manager')
      setData(response)
      logger.debug('Dashboard', 'Manager data refreshed')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => loadData(true), REFRESH_INTERVAL)
    
    // Also refresh when tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        logger.debug('Dashboard', 'Tab visible - refreshing')
        loadData(true)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [loadData])

  if (loading && !data) return <p>Loading dashboard...</p>
  if (error) return <p className="form__error">{error}</p>
  if (!data) return null

  const items = [
    { label: 'Pending Requests', value: data.pendingCount },
    { label: 'Approved', value: data.approvedCount },
    { label: 'Rejected', value: data.rejectedCount },
    { label: 'Total Employees', value: data.employeeCount },
  ]

  const statusChartData = {
    pending: data.pendingCount,
    approved: data.approvedCount,
    rejected: data.rejectedCount,
  }

  return (
    <div className="stack">
      <StatsGrid items={items} />

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h4 className="chart-card__title">📊 Overall Request Status</h4>
          <LeaveStatusChart data={statusChartData} />
        </div>
        <div className="chart-card">
          <h4 className="chart-card__title">📈 Request Trends</h4>
          <LeavesTrendChart data={[...data.recentDecisions, ...data.pendingRequests]} />
        </div>
      </div>

      {/* Pending Requests Section */}
      <section className="card">
        <div className="section-header">
          <h3>⏳ Pending Requests</h3>
          <Link to="/manager/pending" className="section-header__link">
            View all pending →
          </Link>
        </div>
        {data.pendingRequests?.length ? (
          <div className="leave-cards-grid">
            {data.pendingRequests.map((request) => (
              <LeaveCard key={request._id} request={request} showEmployee />
            ))}
          </div>
        ) : (
          <p className="empty-state">🎉 No pending requests! All caught up.</p>
        )}
      </section>

      {/* Recent Decisions Section */}
      <section className="card">
        <div className="section-header">
          <h3>📋 Recent Decisions</h3>
          <Link to="/manager/requests" className="section-header__link">
            View all requests →
          </Link>
        </div>
        {data.recentDecisions?.length ? (
          <div className="leave-cards-grid">
            {data.recentDecisions.map((request) => (
              <LeaveCard key={request._id} request={request} showEmployee />
            ))}
          </div>
        ) : (
          <p className="empty-state">No decisions made yet.</p>
        )}
      </section>
    </div>
  )
}

export default ManagerDashboard

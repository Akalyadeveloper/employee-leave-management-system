import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import StatsGrid from '../../components/StatsGrid.jsx'
import LeaveCard from '../../components/LeaveCard.jsx'
import LeaveStatusChart from '../../components/charts/LeaveStatusChart.jsx'
import LeaveBalanceChart from '../../components/charts/LeaveBalanceChart.jsx'
import { api } from '../../api/client.js'
import { formatDate } from '../../utils/format.js'
import logger from '../../utils/logger.js'

const REFRESH_INTERVAL = 10000 // 10 seconds

const EmployeeDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const response = await api.get('/dashboard/employee')
      setData(response)
      logger.debug('Dashboard', 'Employee data refreshed')
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

  if (loading) return <p>Loading dashboard...</p>
  if (error) return <p className="form__error">{error}</p>
  if (!data) return null

  const statItems = [
    { label: 'Total requests', value: data.totalRequests },
    { label: 'Pending', value: data.statusCounts.pending },
    { label: 'Approved', value: data.statusCounts.approved },
    { label: 'Rejected', value: data.statusCounts.rejected },
  ]

  return (
    <div className="stack">
      <StatsGrid items={statItems} />

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h4 className="chart-card__title">📊 Request Status</h4>
          <LeaveStatusChart data={data.statusCounts} />
        </div>
        <div className="chart-card">
          <h4 className="chart-card__title">📅 Leave Balance</h4>
          <LeaveBalanceChart data={data.balance} />
        </div>
      </div>

      {/* Recent Decisions Section */}
      <section className="card">
        <div className="section-header">
          <h3>📋 Recent Decisions</h3>
          <Link to="/my-requests" className="section-header__link">
            View all requests →
          </Link>
        </div>
        {data.recentDecisions?.length ? (
          <div className="leave-cards-grid">
            {data.recentDecisions.map((request) => (
              <LeaveCard key={request._id} request={request} />
            ))}
          </div>
        ) : (
          <p className="empty-state">No decisions yet. Your pending requests will appear here once reviewed.</p>
        )}
      </section>

      {/* Upcoming Leaves Section */}
      <section className="card">
        <div className="section-header">
          <h3>🗓️ Upcoming Approved Leaves</h3>
        </div>
        {data.upcoming?.length ? (
          <div className="leave-cards-grid">
            {data.upcoming.map((request) => (
              <LeaveCard key={request._id} request={request} />
            ))}
          </div>
        ) : (
          <p className="empty-state">No upcoming leaves scheduled.</p>
        )}
      </section>
    </div>
  )
}

export default EmployeeDashboard

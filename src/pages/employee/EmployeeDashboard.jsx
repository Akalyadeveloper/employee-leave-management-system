import { useEffect, useState, useCallback } from 'react'
import StatsGrid from '../../components/StatsGrid.jsx'
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
      <section className="card">
        <h3>Upcoming leaves</h3>
        {data.upcoming?.length ? (
          <ul className="upcoming-list">
            {data.upcoming.map((item) => (
              <li key={item._id}>
                <strong>{formatDate(item.startDate)}</strong> - {formatDate(item.endDate)} ({item.leaveType})
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No upcoming leaves.</p>
        )}
      </section>
      <section className="card">
        <h3>Leave balance</h3>
        <div className="balance-grid">
          {Object.entries(data.balance).map(([type, value]) => (
            <div key={type} className="balance-card">
              <p className="balance-card__label">{type}</p>
              <p className="balance-card__value">{value} days</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default EmployeeDashboard

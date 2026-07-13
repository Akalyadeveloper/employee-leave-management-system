import { useEffect, useState, useCallback } from 'react'
import StatsGrid from '../../components/StatsGrid.jsx'
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
    { label: 'Pending', value: data.pendingCount },
    { label: 'Approved', value: data.approvedCount },
    { label: 'Employees', value: data.employeeCount },
  ]

  return (
    <div className="stack">
      <StatsGrid items={items} />
      <section className="card">
        <h3>Latest decisions</h3>
        {data.recent?.length ? (
          <ul className="upcoming-list">
            {data.recent.map((item) => (
              <li key={item._id}>
                <strong>{item.user?.name}</strong> - {item.leaveType} leave ({formatDate(item.startDate)})
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No requests yet.</p>
        )}
      </section>
    </div>
  )
}

export default ManagerDashboard

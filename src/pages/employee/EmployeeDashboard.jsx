import { useEffect, useState } from 'react'
import StatsGrid from '../../components/StatsGrid.jsx'
import { api } from '../../api/client.js'
import { formatDate } from '../../utils/format.js'

const EmployeeDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await api.get('/dashboard/employee')
        setData(response)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

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

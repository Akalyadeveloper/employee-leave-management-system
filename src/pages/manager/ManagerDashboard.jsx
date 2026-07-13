import { useEffect, useState } from 'react'
import StatsGrid from '../../components/StatsGrid.jsx'
import { api } from '../../api/client.js'
import { formatDate } from '../../utils/format.js'

const ManagerDashboard = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setError('')
      try {
        const response = await api.get('/dashboard/manager')
        setData(response)
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [])

  if (error) return <p className="form__error">{error}</p>
  if (!data) return <p>Loading dashboard...</p>

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

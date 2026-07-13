import { useEffect, useState } from 'react'
import LeaveTable from '../../components/LeaveTable.jsx'
import useLeaveStore from '../../store/leaveStore.js'

const MyRequests = () => {
  const { myRequests, fetchMyRequests, cancelRequest, loading } = useLeaveStore()
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyRequests()
  }, [fetchMyRequests])

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

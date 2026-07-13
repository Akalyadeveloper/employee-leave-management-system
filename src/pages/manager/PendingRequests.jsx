import { useEffect, useState } from 'react'
import LeaveTable from '../../components/LeaveTable.jsx'
import useLeaveStore from '../../store/leaveStore.js'

const PendingRequests = () => {
  const { pendingRequests, fetchPendingRequests, approveRequest, rejectRequest, loading } = useLeaveStore()
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPendingRequests()
  }, [fetchPendingRequests])

  const handleApprove = async (id) => {
    setError('')
    const comment = window.prompt('Add an optional comment for the employee', '') || ''
    try {
      await approveRequest(id, comment)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReject = async (id) => {
    setError('')
    const comment = window.prompt('Reason for rejection', '') || ''
    try {
      await rejectRequest(id, comment)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="card">
      <div className="card__header">
        <h3>Pending approvals</h3>
        {loading && <span className="badge">Working...</span>}
      </div>
      {error && <p className="form__error">{error}</p>}
      <LeaveTable requests={pendingRequests} onApprove={handleApprove} onReject={handleReject} />
    </section>
  )
}

export default PendingRequests

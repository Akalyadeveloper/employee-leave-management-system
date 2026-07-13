import { useEffect } from 'react'
import LeaveTable from '../../components/LeaveTable.jsx'
import useLeaveStore from '../../store/leaveStore.js'

const AllRequests = () => {
  const { allRequests, fetchAllRequests, loading } = useLeaveStore()

  useEffect(() => {
    fetchAllRequests()
  }, [fetchAllRequests])

  return (
    <section className="card">
      <div className="card__header">
        <h3>All leave requests</h3>
        {loading && <span className="badge">Loading...</span>}
      </div>
      <LeaveTable requests={allRequests} />
    </section>
  )
}

export default AllRequests

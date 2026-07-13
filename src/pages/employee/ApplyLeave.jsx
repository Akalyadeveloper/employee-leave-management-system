import { useEffect, useState } from 'react'
import useLeaveStore from '../../store/leaveStore.js'

const defaultForm = {
  leaveType: 'sick',
  startDate: '',
  endDate: '',
  reason: '',
}

const ApplyLeave = () => {
  const { balance, applyLeave, fetchBalance, loading } = useLeaveStore()
  const [form, setForm] = useState({ ...defaultForm })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      await applyLeave(form)
      setMessage('Leave request submitted')
      setForm({ ...defaultForm })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="stack">
      <section className="card">
        <h3>Apply for leave</h3>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Leave type
            <select name="leaveType" value={form.leaveType} onChange={handleChange}>
              <option value="sick">Sick</option>
              <option value="casual">Casual</option>
              <option value="vacation">Vacation</option>
            </select>
          </label>
          <div className="form__row">
            <label>
              Start date
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
            </label>
            <label>
              End date
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
            </label>
          </div>
          <label>
            Reason
            <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="Explain the need" required />
          </label>
          {error && <p className="form__error">{error}</p>}
          {message && <p className="form__success">{message}</p>}
          <button className="btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit leave request'}
          </button>
        </form>
      </section>
      <section className="card">
        <h3>Current balance</h3>
        {balance ? (
          <div className="balance-grid">
            {Object.entries(balance).map(([type, value]) => (
              <div key={type} className="balance-card">
                <p className="balance-card__label">{type}</p>
                <p className="balance-card__value">{value} days</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Balance will appear after the first refresh.</p>
        )}
      </section>
    </div>
  )
}

export default ApplyLeave

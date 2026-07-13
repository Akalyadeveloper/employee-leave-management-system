import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const Register = () => {
  const navigate = useNavigate()
  const { register, status } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-card">
      <h2>Create an account</h2>
      <p>Pick a role (employee or manager) and fill in the basics.</p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Full name
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Jane Doe" />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="At least 6 characters"
          />
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </label>
        {error && <p className="form__error">{error}</p>}
        <button className="btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating...' : 'Register'}
        </button>
      </form>
      <p className="form__footer">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

export default Register

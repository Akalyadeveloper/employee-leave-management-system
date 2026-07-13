import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const Login = () => {
  const navigate = useNavigate()
  const { login, status } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-card">
      <h2>Welcome back</h2>
      <p>Enter your login details to open the dashboard.</p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@email.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="Your password"
          />
        </label>
        {error && <p className="form__error">{error}</p>}
        <button className="btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="form__footer">
        Need an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

export default Login

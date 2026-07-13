import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }


  const validateForm = () => {
    if (!form.name.trim()) return 'Name is required.'
    if (!form.email.trim()) return 'Email is required.'
    if (!form.password || form.password.length < 6) return 'Password must be at least 6 characters.'
    if (!['employee', 'manager'].includes(form.role)) return 'Role must be selected.'
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    setIsSubmitting(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
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
        <button className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Register'}
        </button>
      </form>
      <p className="form__footer">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

export default Register

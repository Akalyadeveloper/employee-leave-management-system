import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

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
    <div className="auth-page">
      <div className="auth-gradient-background"></div>
      <div className="auth-content">
        <div className="auth-card auth-card--register">
          <div className="auth-header">
            <div className="auth-icon auth-icon--register">✨</div>
            <h2>Create Account</h2>
            <p>Join our leave management system today</p>
          </div>

          <form onSubmit={handleSubmit} className="form form--auth">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <span className="form-label__icon">👤</span>
                Full Name
              </label>
              <div className="form-input-wrapper">
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="Jane Doe"
                  className={`form-input ${focusedField === 'name' ? 'form-input--focused' : ''}`}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="form-label__icon">✉️</span>
                Email Address
              </label>
              <div className="form-input-wrapper">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="you@example.com"
                  className={`form-input ${focusedField === 'email' ? 'form-input--focused' : ''}`}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="form-label__icon">🔐</span>
                Password
              </label>
              <div className="form-input-wrapper">
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className={`form-input ${focusedField === 'password' ? 'form-input--focused' : ''}`}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                <span className="form-label__icon">🎯</span>
                Select Your Role
              </label>
              <div className="form-select-wrapper">
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="employee">👨‍💼 Employee</option>
                  <option value="manager">👨‍💼 Manager</option>
                </select>
              </div>
            </div>

            {error && <div className="form__error form__error--animated">{error}</div>}

            <button
              type="submit"
              className="btn btn--primary btn--auth"
              disabled={isSubmitting}
            >
              <span className="btn__icon">
                {isSubmitting ? '⏳' : '✓'}
              </span>
              <span className="btn__text">
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </span>
            </button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="btn btn--secondary btn--auth btn--full">
            <span className="btn__text">Sign In Here</span>
          </Link>

          <div className="auth-footer">
            <p className="auth-footer__text">Security Note:</p>
            <p className="auth-footer__demo">Your password is securely encrypted</p>
          </div>
        </div>

        <div className="auth-side-content">
          <div className="auth-side-card">
            <div className="auth-side-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your personal data is protected with encryption</p>
          </div>
          <div className="auth-side-card">
            <div className="auth-side-icon">💼</div>
            <h3>Role-Based Access</h3>
            <p>Choose between Employee and Manager roles</p>
          </div>
          <div className="auth-side-card">
            <div className="auth-side-icon">⚙️</div>
            <h3>Easy Setup</h3>
            <p>Get started in seconds with our simple signup</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
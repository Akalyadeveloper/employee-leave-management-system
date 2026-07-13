import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const Login = () => {
  const navigate = useNavigate()
  const { login, status } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState(null)

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
    <div className="auth-page">
      <div className="auth-gradient-background"></div>
      <div className="auth-content">
        <div className="auth-card auth-card--login">
          <div className="auth-header">
            <div className="auth-icon auth-icon--login">👤</div>
            <h2>Welcome Back</h2>
            <p>Login to manage your leave requests</p>
          </div>

          <form onSubmit={handleSubmit} className="form form--auth">
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
                  required
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
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
                  required
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className={`form-input ${focusedField === 'password' ? 'form-input--focused' : ''}`}
                />
              </div>
            </div>

            {error && <div className="form__error form__error--animated">{error}</div>}

            <button 
              type="submit"
              className="btn btn--primary btn--auth" 
              disabled={status === 'loading'}
            >
              <span className="btn__icon">
                {status === 'loading' ? '⏳' : '→'}
              </span>
              <span className="btn__text">
                {status === 'loading' ? 'Signing in...' : 'Sign In'}
              </span>
            </button>
          </form>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <Link to="/register" className="btn btn--secondary btn--auth btn--full">
            <span className="btn__text">Create Account</span>
          </Link>

          <div className="auth-footer">
            <p className="auth-footer__text">Demo credentials:</p>
            <p className="auth-footer__demo">Email: employee@test.com | Pass: 123456</p>
          </div>
        </div>

        <div className="auth-side-content">
          <div className="auth-side-card">
            <div className="auth-side-icon">📊</div>
            <h3>Easy to Use</h3>
            <p>Simple and intuitive leave management system</p>
          </div>
          <div className="auth-side-card">
            <div className="auth-side-icon">⚡</div>
            <h3>Fast & Secure</h3>
            <p>Your data is protected with secure authentication</p>
          </div>
          <div className="auth-side-card">
            <div className="auth-side-icon">📈</div>
            <h3>Track & Analyze</h3>
            <p>Beautiful charts to visualize your leave data</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export const ProtectedRoute = ({ children, allowed }) => {
  const { user } = useAuthStore()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (allowed && !allowed.includes(user.role)) {
    const fallback = user.role === 'manager' ? '/manager' : '/'
    return <Navigate to={fallback} replace />
  }
  return children
}

export const PublicRoute = ({ children }) => {
  const { user } = useAuthStore()
  if (user) {
    return <Navigate to="/" replace />
  }
  return children
}

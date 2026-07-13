import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import useAuthStore from './store/authStore.js'
import { ProtectedRoute, PublicRoute } from './components/RouteGuards.jsx'
import Layout from './components/Layout.jsx'
import Loader from './components/Loader.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Home from './pages/Home.jsx'
import EmployeeDashboard from './pages/employee/EmployeeDashboard.jsx'
import ApplyLeave from './pages/employee/ApplyLeave.jsx'
import MyRequests from './pages/employee/MyRequests.jsx'
import Profile from './pages/employee/Profile.jsx'
import ManagerDashboard from './pages/manager/ManagerDashboard.jsx'
import PendingRequests from './pages/manager/PendingRequests.jsx'
import AllRequests from './pages/manager/AllRequests.jsx'

const HomeRouter = () => {
  const user = useAuthStore((state) => state.user)
  if (!user) {
    return <Home />
  }
  if (user?.role === 'manager') {
    return <Navigate to="/manager" replace />
  }
  return <Navigate to="/dashboard" replace />
}

const App = () => {
  const init = useAuthStore((state) => state.init)
  const initialized = useAuthStore((state) => state.initialized)

  useEffect(() => {
    init()
  }, [init])

  if (!initialized) {
    return <Loader />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomeRouter />}
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute allowed={['employee', 'manager']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowed={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="apply"
            element={
              <ProtectedRoute allowed={['employee']}>
                <ApplyLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-requests"
            element={
              <ProtectedRoute allowed={['employee']}>
                <MyRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowed={['employee']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="manager"
            element={
              <ProtectedRoute allowed={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="manager/pending"
            element={
              <ProtectedRoute allowed={['manager']}>
                <PendingRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="manager/requests"
            element={
              <ProtectedRoute allowed={['manager']}>
                <AllRequests />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
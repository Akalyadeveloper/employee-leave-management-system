import { NavLink, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const NAV_LINKS = {
  employee: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/apply', label: 'Apply Leave' },
    { to: '/my-requests', label: 'My Requests' },
    { to: '/profile', label: 'Profile' },
  ],
  manager: [
    { to: '/manager', label: 'Dashboard' },
    { to: '/manager/pending', label: 'Pending Requests' },
    { to: '/manager/requests', label: 'All Requests' },
  ],
}

const Layout = () => {
  const { user, logout } = useAuthStore()

  const links = NAV_LINKS[user?.role] ?? []

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="brand__logo">EL</span>
          <div>
            <p className="brand__title">Leave Manager</p>
            <p className="brand__subtitle">Simple leave tracking</p>
          </div>
        </div>
        <nav className="sidebar__nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn btn--ghost" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <header className="page-header">
          <div>
            <p className="page-header__label">Logged in as</p>
            <h3>{user?.name}</h3>
            <p className="page-header__role">{user?.role}</p>
          </div>
          <div className="balance-pill">
            <span>{user?.email}</span>
          </div>
        </header>
        <div className="page-body">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout

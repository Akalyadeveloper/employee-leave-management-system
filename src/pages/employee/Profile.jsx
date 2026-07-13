import useAuthStore from '../../store/authStore.js'

const Profile = () => {
  const { user, logout } = useAuthStore()

  return (
    <section className="card">
      <h3>Profile</h3>
      <div className="profile-grid">
        <div>
          <p className="profile-label">Name</p>
          <p>{user?.name}</p>
        </div>
        <div>
          <p className="profile-label">Email</p>
          <p>{user?.email}</p>
        </div>
        <div>
          <p className="profile-label">Role</p>
          <p>{user?.role}</p>
        </div>
      </div>
      <button className="btn btn--danger" onClick={logout}>
        Logout
      </button>
    </section>
  )
}

export default Profile

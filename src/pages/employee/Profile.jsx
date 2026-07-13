import { useState } from 'react'
import useAuthStore from '../../store/authStore.js'

const Profile = () => {
  const { user, logout, updateProfile, status } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    designation: user?.designation || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    emergencyContact: user?.emergencyContact || '',
    emergencyPhone: user?.emergencyPhone || '',
    bio: user?.bio || '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await updateProfile(formData)
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      department: user?.department || '',
      designation: user?.designation || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      emergencyContact: user?.emergencyContact || '',
      emergencyPhone: user?.emergencyPhone || '',
      bio: user?.bio || '',
    })
    setIsEditing(false)
  }

  return (
    <section className="profile-section">
      <div className="profile-header">
        <h2 className="profile-title">My Profile</h2>
        <div className="profile-actions">
          {!isEditing && (
            <button className="btn btn--primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {success && <div className="alert alert--success">{success}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-form-section">
            <h3 className="form-section-title">Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="form-input form-input--disabled"
                  placeholder="Email cannot be changed"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth" className="form-label">
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            <h3 className="form-section-title">Professional Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employeeId" className="form-label">
                  Employee ID
                </label>
                <input
                  id="employeeId"
                  type="text"
                  value={user?.employeeId || ''}
                  disabled
                  className="form-input form-input--disabled"
                  placeholder="Auto-generated"
                />
              </div>

              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <input
                  id="department"
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Engineering, HR, Sales"
                />
              </div>

              <div className="form-group">
                <label htmlFor="designation" className="form-label">
                  Designation/Job Title
                </label>
                <input
                  id="designation"
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Senior Developer"
                />
              </div>

              <div className="form-group">
                <label htmlFor="joinDate" className="form-label">
                  Join Date
                </label>
                <input
                  id="joinDate"
                  type="date"
                  value={user?.joinDate ? new Date(user.joinDate).toISOString().split('T')[0] : ''}
                  disabled
                  className="form-input form-input--disabled"
                  placeholder="Auto-generated"
                />
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            <h3 className="form-section-title">Address Information</h3>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label htmlFor="address" className="form-label">
                  Street Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="New York"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state" className="form-label">
                  State/Province
                </label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="NY"
                />
              </div>

              <div className="form-group">
                <label htmlFor="zipCode" className="form-label">
                  ZIP/Postal Code
                </label>
                <input
                  id="zipCode"
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            <h3 className="form-section-title">Emergency Contact</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="emergencyContact" className="form-label">
                  Emergency Contact Name
                </label>
                <input
                  id="emergencyContact"
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergencyPhone" className="form-label">
                  Emergency Contact Phone
                </label>
                <input
                  id="emergencyPhone"
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            <h3 className="form-section-title">Additional Information</h3>
            <div className="form-grid">
              <div className="form-group form-group--full">
                <label htmlFor="bio" className="form-label">
                  Bio/Notes
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="form-input form-textarea"
                  placeholder="Add a short bio or any additional information..."
                  rows="4"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary" disabled={status === 'loading'}>
              {status === 'loading' ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn--secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          <div className="profile-grid">
            <div className="profile-card">
              <h3 className="profile-card-title">Personal Information</h3>
              <div className="profile-item">
                <span className="profile-label">Full Name</span>
                <span className="profile-value">{user?.name || 'N/A'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Email</span>
                <span className="profile-value">{user?.email || 'N/A'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Phone</span>
                <span className="profile-value">{user?.phone || 'Not provided'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Date of Birth</span>
                <span className="profile-value">
                  {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </span>
              </div>
            </div>

            <div className="profile-card">
              <h3 className="profile-card-title">Professional Information</h3>
              <div className="profile-item">
                <span className="profile-label">Role</span>
                <span className="profile-value profile-badge">{user?.role === 'manager' ? '👔 Manager' : '👤 Employee'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Employee ID</span>
                <span className="profile-value">{user?.employeeId || 'Not assigned'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Department</span>
                <span className="profile-value">{user?.department || 'Not assigned'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Designation</span>
                <span className="profile-value">{user?.designation || 'Not assigned'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Join Date</span>
                <span className="profile-value">
                  {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Not assigned'}
                </span>
              </div>
            </div>

            <div className="profile-card">
              <h3 className="profile-card-title">Address Information</h3>
              <div className="profile-item">
                <span className="profile-label">Street Address</span>
                <span className="profile-value">{user?.address || 'Not provided'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">City</span>
                <span className="profile-value">{user?.city || 'Not provided'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">State/Province</span>
                <span className="profile-value">{user?.state || 'Not provided'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">ZIP Code</span>
                <span className="profile-value">{user?.zipCode || 'Not provided'}</span>
              </div>
            </div>

            <div className="profile-card">
              <h3 className="profile-card-title">Emergency Contact</h3>
              <div className="profile-item">
                <span className="profile-label">Contact Name</span>
                <span className="profile-value">{user?.emergencyContact || 'Not provided'}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Contact Phone</span>
                <span className="profile-value">{user?.emergencyPhone || 'Not provided'}</span>
              </div>
            </div>

            {user?.bio && (
              <div className="profile-card profile-card--full">
                <h3 className="profile-card-title">Bio</h3>
                <p className="profile-bio">{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="profile-footer">
        <button className="btn btn--danger" onClick={logout}>
          Logout
        </button>
      </div>
    </section>
  )
}

export default Profile

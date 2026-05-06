import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import instructorService from '../services/instructorService'

export default function InstructorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    hireDate: new Date().toISOString().split('T')[0],
    profile: {
      bio: '',
      officeLocation: '',
      phoneNumber: '',
      education: '',
      specialization: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEditing) {
      loadInstructor()
    }
  }, [id])

  const loadInstructor = async () => {
    try {
      setLoading(true)
      const data = await instructorService.getInstructorById(id)
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        department: data.department || '',
        hireDate: data.hireDate ? data.hireDate.split('T')[0] : new Date().toISOString().split('T')[0],
        profile: {
          bio: data.profile?.bio || '',
          officeLocation: data.profile?.officeLocation || '',
          phoneNumber: data.profile?.phoneNumber || '',
          education: data.profile?.education || '',
          specialization: data.profile?.specialization || ''
        }
      })
      setError(null)
    } catch (err) {
      setError('Failed to load instructor: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Only send profile object if it has actual data
      const submissionData = {
        ...formData,
        profile: formData.profile && (
          formData.profile.bio || 
          formData.profile.officeLocation || 
          formData.profile.phoneNumber || 
          formData.profile.education || 
          formData.profile.specialization
        ) ? formData.profile : null
      }
      
      if (isEditing) {
        await instructorService.updateInstructor(id, submissionData)
      } else {
        await instructorService.createInstructor(submissionData)
      }
      navigate('/instructors')
    } catch (err) {
      let errorMessage = 'Failed to save instructor'
      
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const errors = err.response.data.errors
        const errorMessages = []
        
        if (errors.FirstName) errorMessages.push(errors.FirstName[0])
        if (errors.LastName) errorMessages.push(errors.LastName[0])
        if (errors.Email) errorMessages.push(errors.Email[0])
        if (errors.Department) errorMessages.push(errors.Department[0])
        if (errors.HireDate) errorMessages.push(errors.HireDate[0])
        
        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join('. ')
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading instructor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>{isEditing ? 'Edit Instructor' : 'Add New Instructor'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <h3>Basic Information</h3>
        
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="hireDate">Hire Date *</label>
          <input
            type="date"
            id="hireDate"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <h3>Profile Information</h3>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="profile.bio"
            value={formData.profile.bio}
            onChange={handleChange}
            rows="3"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="officeLocation">Office Location</label>
          <input
            type="text"
            id="officeLocation"
            name="profile.officeLocation"
            value={formData.profile.officeLocation}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="profile.phoneNumber"
            value={formData.profile.phoneNumber}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="education">Education</label>
          <input
            type="text"
            id="education"
            name="profile.education"
            value={formData.profile.education}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="specialization">Specialization</label>
          <input
            type="text"
            id="specialization"
            name="profile.specialization"
            value={formData.profile.specialization}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Instructor' : 'Create Instructor')}
          </button>
          <button type="button" onClick={() => navigate('/instructors')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

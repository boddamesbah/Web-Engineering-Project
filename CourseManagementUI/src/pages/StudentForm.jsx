import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import studentService from '../services/studentService'

export default function StudentForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    enrollmentDate: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEditing) {
      loadStudent()
    }
  }, [id])

  const loadStudent = async () => {
    try {
      setLoading(true)
      const data = await studentService.getStudentById(id)
      setFormData({
        studentId: data.studentId || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        enrollmentDate: data.enrollmentDate ? data.enrollmentDate.split('T')[0] : new Date().toISOString().split('T')[0]
      })
      setError(null)
    } catch (err) {
      setError('Failed to load student: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing) {
        await studentService.updateStudent(id, formData)
      } else {
        await studentService.createStudent(formData)
      }
      navigate('/students')
    } catch (err) {
      let errorMessage = 'Failed to save student'
      
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const errors = err.response.data.errors
        const errorMessages = []
        
        if (errors.StudentId) errorMessages.push(errors.StudentId[0])
        if (errors.FirstName) errorMessages.push(errors.FirstName[0])
        if (errors.LastName) errorMessages.push(errors.LastName[0])
        if (errors.Email) errorMessages.push(errors.Email[0])
        if (errors.EnrollmentDate) errorMessages.push(errors.EnrollmentDate[0])
        
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
          <p>Loading student...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>{isEditing ? 'Edit Student' : 'Add New Student'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
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
          <label htmlFor="studentId">Student ID *</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="e.g., STU00123"
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
          <label htmlFor="enrollmentDate">Enrollment Date *</label>
          <input
            type="date"
            id="enrollmentDate"
            name="enrollmentDate"
            value={formData.enrollmentDate}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Student' : 'Create Student')}
          </button>
          <button type="button" onClick={() => navigate('/students')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import instructorService from '../services/instructorService'

export default function InstructorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [instructor, setInstructor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadInstructor()
  }, [id])

  const loadInstructor = async () => {
    try {
      setLoading(true)
      const data = await instructorService.getInstructorById(id)
      setInstructor(data)
      setError(null)
    } catch (err) {
      setError('Failed to load instructor: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await instructorService.deleteInstructor(id)
        navigate('/instructors')
      } catch (err) {
        setError('Failed to delete instructor: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading instructor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <Link to="/instructors" className="btn btn-primary">Back to Instructors</Link>
      </div>
    )
  }

  if (!instructor) {
    return (
      <div className="container">
        <div className="no-data">
          <p>Instructor not found</p>
          <Link to="/instructors" className="btn btn-primary">Back to Instructors</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Instructor Details</h2>
        <div>
          <Link to={`/instructors/${id}/edit`} className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="detail-card">
        <h3>Basic Information</h3>
        <div className="detail-row">
          <span className="detail-label">First Name:</span>
          <span className="detail-value">{instructor.firstName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Last Name:</span>
          <span className="detail-value">{instructor.lastName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{instructor.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Department:</span>
          <span className="detail-value">{instructor.department || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Hire Date:</span>
          <span className="detail-value">{new Date(instructor.hireDate).toLocaleDateString()}</span>
        </div>

        {instructor.profile && (
          <>
            <h3 style={{ marginTop: '2rem' }}>Profile Information</h3>
            <div className="detail-row">
              <span className="detail-label">Bio:</span>
              <span className="detail-value">{instructor.profile.bio || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Office Location:</span>
              <span className="detail-value">{instructor.profile.officeLocation || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone Number:</span>
              <span className="detail-value">{instructor.profile.phoneNumber || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Education:</span>
              <span className="detail-value">{instructor.profile.education || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Specialization:</span>
              <span className="detail-value">{instructor.profile.specialization || 'N/A'}</span>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/instructors" className="btn btn-primary">Back to Instructors</Link>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import enrollmentService from '../services/enrollmentService'

export default function EnrollmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadEnrollment()
  }, [id])

  const loadEnrollment = async () => {
    try {
      setLoading(true)
      const data = await enrollmentService.getEnrollmentById(id)
      setEnrollment(data)
      setError(null)
    } catch (err) {
      setError('Failed to load enrollment: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await enrollmentService.deleteEnrollment(id)
        navigate('/enrollments')
      } catch (err) {
        setError('Failed to delete enrollment: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading enrollment details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <Link to="/enrollments" className="btn btn-primary">Back to Enrollments</Link>
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="container">
        <div className="no-data">
          <p>Enrollment not found</p>
          <Link to="/enrollments" className="btn btn-primary">Back to Enrollments</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="detail-container">
        <h2>Enrollment Details</h2>
        <div>
          <div className="detail-row">
            <span className="detail-label">Student Name:</span>
            <span className="detail-value">{enrollment.student?.fullName || 'Not assigned'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Course Title:</span>
            <span className="detail-value">{enrollment.course?.title || 'Not assigned'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Enrollment Date:</span>
            <span className="detail-value">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Grade:</span>
            <span className="detail-value">{enrollment.grade ?? 'N/A'}</span>
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link to={`/enrollments/${enrollment.id}/edit`} className="btn btn-secondary">Edit Enrollment</Link>
          <button onClick={handleDelete} className="btn btn-danger">Delete Enrollment</button>
          <Link to="/enrollments" className="btn btn-secondary">Back to Enrollments</Link>
        </div>
      </div>
    </div>
  )
}

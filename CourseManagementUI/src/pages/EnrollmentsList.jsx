import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import enrollmentService from '../services/enrollmentService'

export default function EnrollmentsList() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadEnrollments()
  }, [])

  const loadEnrollments = async () => {
    try {
      setLoading(true)
      const data = await enrollmentService.getAllEnrollments()
      setEnrollments(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError('Failed to load enrollments: ' + (err.response?.data?.message || err.message))
      setEnrollments([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to unenroll this student?')) {
      try {
        await enrollmentService.deleteEnrollment(id)
        setEnrollments(enrollments.filter(e => e.id !== id))
        setError(null)
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
          <p>Loading enrollments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Enrollments</h2>
        <Link to="/enrollments/new" className="btn btn-success">New Enrollment</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {enrollments.length === 0 ? (
        <div className="no-data">
          <p>No enrollments found</p>
          <Link to="/enrollments/new" className="btn btn-primary">Create First Enrollment</Link>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Course Title</th>
              <th>Enrollment Date</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(enrollment => (
              <tr key={enrollment.id}>
                <td>{enrollment.id}</td>
                <td>{enrollment.student?.fullName || 'Not assigned'}</td>
                <td>{enrollment.course?.title || 'Not assigned'}</td>
                <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                <td>{enrollment.grade ?? 'N/A'}</td>
                <td>
                  <div className="table-actions">
                    <Link to={`/enrollments/${enrollment.id}`} className="btn btn-primary">View</Link>
                    <button 
                      onClick={() => handleDelete(enrollment.id)} 
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import studentService from '../services/studentService'

export default function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStudent()
  }, [id])

  const loadStudent = async () => {
    try {
      setLoading(true)
      const data = await studentService.getStudentById(id)
      setStudent(data)
      setError(null)
    } catch (err) {
      setError('Failed to load student: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(id)
        navigate('/students')
      } catch (err) {
        setError('Failed to delete student: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading student...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <Link to="/students" className="btn btn-primary">Back to Students</Link>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="container">
        <div className="no-data">
          <p>Student not found</p>
          <Link to="/students" className="btn btn-primary">Back to Students</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Student Details</h2>
        <div>
          <Link to={`/students/${id}/edit`} className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-row">
          <span className="detail-label">Student ID:</span>
          <span className="detail-value">{student.studentId}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">First Name:</span>
          <span className="detail-value">{student.firstName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Last Name:</span>
          <span className="detail-value">{student.lastName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{student.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Enrollment Date:</span>
          <span className="detail-value">{new Date(student.enrollmentDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/students" className="btn btn-primary">Back to Students</Link>
      </div>
    </div>
  )
}

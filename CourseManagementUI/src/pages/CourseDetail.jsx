import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import courseService from '../services/courseService'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCourse()
  }, [id])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const data = await courseService.getCourseById(id)
      setCourse(data)
      setError(null)
    } catch (err) {
      setError('Failed to load course: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(id)
        navigate('/courses')
      } catch (err) {
        setError('Failed to delete course: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container">
        <div className="no-data">
          <p>Course not found</p>
          <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="detail-container">
        <h2>{course.title}</h2>

        <div className="detail-row">
          <span className="detail-label">Course Code:</span>
          <span className="detail-value">{course.courseCode}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Description:</span>
          <span className="detail-value">{course.description}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Instructor:</span>
          <span className="detail-value">{course.instructor?.fullName || 'Not assigned'}</span>
        </div>

        <div className="btn-group">
          <Link to={`/courses/${id}/edit`} className="btn btn-primary">Edit Course</Link>
          <button onClick={handleDelete} className="btn btn-danger">Delete Course</button>
          <Link to="/courses" className="btn btn-secondary">Back to Courses</Link>
        </div>
      </div>
    </div>
  )
}

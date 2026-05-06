import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import courseService from '../services/courseService'
import authService from '../services/authService'

export default function CoursesList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = authService.getUser()
  const canManageCourses = user?.role === 'Admin' || user?.role === 'Instructor'

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const data = await courseService.getAllCourses()
      setCourses(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError('Failed to load courses: ' + (err.response?.data?.message || err.message))
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(id)
        setCourses(courses.filter(c => c.id !== id))
        setError(null)
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
          <p>Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Courses</h2>
        {canManageCourses && <Link to="/courses/new" className="btn btn-success">Add New Course</Link>}
      </div>

      {error && <div className="error-message">{error}</div>}

      {courses.length === 0 ? (
        <div className="no-data">
          <p>No courses available</p>
          {canManageCourses && <Link to="/courses/new" className="btn btn-primary">Create First Course</Link>}
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p><strong>{course.courseCode}</strong></p>
              <div className="course-actions">
                <Link to={`/courses/${course.id}`} className="btn btn-primary">View Details</Link>
                {canManageCourses && (
                  <button 
                    onClick={() => handleDelete(course.id)} 
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

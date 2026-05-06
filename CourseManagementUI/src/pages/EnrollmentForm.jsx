import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import enrollmentService from '../services/enrollmentService'
import studentService from '../services/studentService'
import courseService from '../services/courseService'

export default function EnrollmentForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    grade: ''
  })

  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loadingCourses, setLoadingCourses] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadStudents()
    loadCourses()
    if (isEditMode) {
      loadEnrollment()
    }
  }, [id])

  const loadStudents = async () => {
    try {
      setLoadingStudents(true)
      const data = await studentService.getAllStudents()
      setStudents(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load students:', err)
    } finally {
      setLoadingStudents(false)
    }
  }

  const loadCourses = async () => {
    try {
      setLoadingCourses(true)
      const data = await courseService.getAllCourses()
      setCourses(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load courses:', err)
    } finally {
      setLoadingCourses(false)
    }
  }

  const loadEnrollment = async () => {
    try {
      setLoading(true)
      const enrollment = await enrollmentService.getEnrollmentById(id)
      setFormData({
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        grade: enrollment.grade ?? ''
      })
      setError(null)
    } catch (err) {
      setError('Failed to load enrollment: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['studentId', 'courseId'].includes(name)
        ? (value ? parseInt(value, 10) : '')
        : name === 'grade'
          ? (value === '' ? '' : Number(value))
          : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!formData.studentId || !formData.courseId) {
      setError('Student ID and Course ID are required')
      return
    }

    try {
      setLoading(true)
      const payload = {
        ...formData,
        grade: formData.grade === '' ? null : formData.grade
      }

      if (isEditMode) {
        await enrollmentService.updateEnrollment(id, payload)
        setSuccess(true)
        setTimeout(() => navigate(`/enrollments/${id}`), 1500)
      } else {
        const newEnrollment = await enrollmentService.createEnrollment(payload)
        setSuccess(true)
        setTimeout(() => navigate(`/enrollments/${newEnrollment.id}`), 1500)
      }
    } catch (err) {
      setError('Failed to save enrollment: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditMode) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2>{isEditMode ? 'Edit Enrollment' : 'Create New Enrollment'}</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{isEditMode ? 'Enrollment updated successfully!' : 'Enrollment created successfully!'}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">Student *</label>
            <select
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Select a student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.fullName} - {student.studentNumber}
                </option>
              ))}
            </select>
            {loadingStudents && <small>Loading students...</small>}
          </div>

          <div className="form-group">
            <label htmlFor="courseId">Course *</label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title} - {course.courseCode} - {course.instructorName}
                </option>
              ))}
            </select>
            {loadingCourses && <small>Loading courses...</small>}
          </div>

          <div className="form-group">
            <label htmlFor="grade">Grade</label>
            <input
              id="grade"
              type="number"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder="Enter grade (0 to 100)"
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Saving...' : (isEditMode ? 'Update Enrollment' : 'Create Enrollment')}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/enrollments')} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

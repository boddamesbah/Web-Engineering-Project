import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import courseService from '../services/courseService'
import instructorService from '../services/instructorService'

export default function CourseForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseCode: '',
    instructorId: ''
  })
  const [instructors, setInstructors] = useState([])
  const [loadingInstructors, setLoadingInstructors] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadInstructors()
    if (isEditMode) {
      loadCourse()
    }
  }, [id])

  const loadInstructors = async () => {
    try {
      setLoadingInstructors(true)
      const data = await instructorService.getAllInstructors()
      setInstructors(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load instructors:', err)
    } finally {
      setLoadingInstructors(false)
    }
  }

  const loadCourse = async () => {
    try {
      setLoading(true)
      const course = await courseService.getCourseById(id)
      setFormData({
        title: course.title || '',
        description: course.description || '',
        courseCode: course.courseCode || '',
        instructorId: course.instructorId || ''
      })
      setError(null)
    } catch (err) {
      setError('Failed to load course: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'instructorId' ? (value ? parseInt(value) : '') : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      setLoading(true)
      if (isEditMode) {
        await courseService.updateCourse(id, formData)
        setSuccess(true)
        setTimeout(() => navigate(`/courses/${id}`), 1500)
      } else {
        const newCourse = await courseService.createCourse(formData)
        setSuccess(true)
        setTimeout(() => navigate(`/courses/${newCourse.id}`), 1500)
      }
    } catch (err) {
      let errorMessage = 'Failed to save course'
      
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const errors = err.response.data.errors
        const errorMessages = []
        
        if (errors.Title) errorMessages.push(errors.Title[0])
        if (errors.CourseCode) errorMessages.push(errors.CourseCode[0])
        if (errors.Description) errorMessages.push(errors.Description[0])
        if (errors.InstructorId) errorMessages.push(errors.InstructorId[0])
        
        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join('. ')
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        }
      } else if (err.response?.status === 500) {
        // Check for specific duplicate course code error
        if (err.response?.data?.message?.includes('already in use by another course')) {
          errorMessage = err.response.data.message
        } else {
          errorMessage = 'Server error occurred while saving course. Please try again later.'
        }
      } else if (err.response?.status === 404) {
        errorMessage = 'Course not found or service unavailable.'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
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
        <h2>{isEditMode ? 'Edit Course' : 'Create New Course'}</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{isEditMode ? 'Course updated successfully!' : 'Course created successfully!'}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Course Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter course title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="courseCode">Course Code *</label>
            <input
              id="courseCode"
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              required
              placeholder="e.g., CS101"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter course description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="instructorId">Instructor *</label>
            <select
              id="instructorId"
              name="instructorId"
              value={formData.instructorId}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Select an instructor</option>
              {instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.fullName} - {instructor.department}
                </option>
              ))}
            </select>
            {loadingInstructors && <small>Loading instructors...</small>}
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Saving...' : (isEditMode ? 'Update Course' : 'Create Course')}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/courses')} 
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

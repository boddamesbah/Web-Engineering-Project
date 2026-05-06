import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import instructorService from '../services/instructorService'
import authService from '../services/authService'

export default function InstructorsList() {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = authService.getUser()
  const isAdmin = user?.role === 'Admin'

  useEffect(() => {
    loadInstructors()
  }, [])

  const loadInstructors = async () => {
    try {
      setLoading(true)
      const data = await instructorService.getAllInstructors()
      setInstructors(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError('Failed to load instructors: ' + (err.response?.data?.message || err.message))
      setInstructors([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await instructorService.deleteInstructor(id)
        setInstructors(instructors.filter(i => i.id !== id))
        setError(null)
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
          <p>Loading instructors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Instructors</h2>
        {isAdmin && <Link to="/instructors/new" className="btn btn-success">Add New Instructor</Link>}
      </div>

      {error && <div className="error-message">{error}</div>}

      {instructors.length === 0 ? (
        <div className="no-data">
          <p>No instructors available</p>
          {isAdmin && <Link to="/instructors/new" className="btn btn-primary">Create First Instructor</Link>}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table" style={{ borderCollapse: 'separate', borderSpacing: '40px 0' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>ID</th>
                <th style={{ textAlign: 'center' }}>Name</th>
                <th style={{ textAlign: 'center' }}>Department</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map(instructor => (
                <tr key={instructor.id}>
                  <td style={{ textAlign: 'center' }}>{instructor.id}</td>
                  <td style={{ textAlign: 'center' }}>
                    {instructor.fullName}
                  </td>
                  <td style={{ textAlign: 'center' }}>{instructor.department || 'N/A'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-buttons">
                      <Link to={`/instructors/${instructor.id}`} className="btn btn-primary btn-sm">View</Link>
                      {isAdmin && (
                        <>
                          <Link to={`/instructors/${instructor.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                          <button 
                            onClick={() => handleDelete(instructor.id)} 
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

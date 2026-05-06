import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import studentService from '../services/studentService'
import authService from '../services/authService'

export default function StudentsList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = authService.getUser()
  const isAdmin = user?.role === 'Admin'

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const data = await studentService.getAllStudents()
      setStudents(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError('Failed to load students: ' + (err.response?.data?.message || err.message))
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(id)
        setStudents(students.filter(s => s.id !== id))
        setError(null)
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
          <p>Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Students</h2>
        {isAdmin && <Link to="/students/new" className="btn btn-success">Add New Student</Link>}
      </div>

      {error && <div className="error-message">{error}</div>}

      {students.length === 0 ? (
        <div className="no-data">
          <p>No students available</p>
          {isAdmin && <Link to="/students/new" className="btn btn-primary">Create First Student</Link>}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table" style={{ borderCollapse: 'separate', borderSpacing: '40px 0' }}>
            <thead>
              <tr>
                <th style={{ minWidth: '60px', textAlign: 'center' }}>ID</th>
                <th style={{ minWidth: '200px', textAlign: 'center' }}>Student ID</th>
                <th style={{ minWidth: '300px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td style={{ textAlign: 'center' }}>{student.id}</td>
                  <td style={{ textAlign: 'center' }}>{student.fullName}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-buttons">
                      <Link to={`/students/${student.id}`} className="btn btn-primary btn-sm">View</Link>
                      {isAdmin && (
                        <>
                          <Link to={`/students/${student.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                          <button 
                            onClick={() => handleDelete(student.id)} 
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

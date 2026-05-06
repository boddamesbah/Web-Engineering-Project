import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import authService from '../services/authService'
import './Navigation.css'

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated())
  const [user, setUser] = useState(authService.getUser())
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated())
      setUser(authService.getUser())
    }

    // Check auth state on mount and when storage changes
    checkAuth()
    
    // Listen for storage changes (for cross-tab sync)
    window.addEventListener('storage', checkAuth)
    
    // Listen for custom auth change events
    window.addEventListener('authChange', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('authChange', checkAuth)
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    navigate('/')
  }

  const canManageData = user?.role === 'Admin' || user?.role === 'Instructor'

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>Course Management System</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/students">Students</Link></li>
              <li><Link to="/instructors">Instructors</Link></li>
              <li><Link to="/enrollments">Enrollments</Link></li>
            </>
          )}
          {isAuthenticated ? (
            <li>
              <span className="user-role">{user?.role}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

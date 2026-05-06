import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('Student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const registerResponse = await authService.register({ email, password, role })
      
      if (registerResponse && registerResponse.token) {
        // Store registration token directly
        localStorage.setItem('token', registerResponse.token)
        localStorage.setItem('user', JSON.stringify({
          email: registerResponse.email,
          role: registerResponse.role || 'user'
        }))
        // Dispatch custom event to trigger Navigation re-render
        window.dispatchEvent(new Event('authChange'))
        navigate('/courses')
      }
      
      // Temporarily disabled auto-login to isolate issue
      /*
      const response = await authService.login(email, password)
      console.log('Login response:', response)
      if (response && response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify({
          email: response.email,
          role: response.role || 'user'
        }))
        navigate('/courses')
      }
      */
    } catch (err) {
      let errorMessage = 'Registration failed'
      
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const errors = err.response.data.errors
        const errorMessages = []
        
        if (errors.Email) errorMessages.push(errors.Email[0])
        if (errors.Password) errorMessages.push(errors.Password[0])
        if (errors.Role) errorMessages.push(errors.Role[0])
        
        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join('. ')
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        }
      } else if (err.response?.status === 409) {
        errorMessage = 'Email already registered. Please use a different email or try logging in.'
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

  return (
    <div className="container">
      <div className="form-container">
        <h2>Register</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  )
}

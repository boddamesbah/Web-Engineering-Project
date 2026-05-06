import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (setter) => {
    return (e) => {
      setter(e.target.value)
      // Clear error when user starts typing
      if (showError) {
        setShowError(false)
        setError('')
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSubmit = async (e) => {
    console.log('=== handleSubmit START ===')
    console.log('Event type:', e?.type)
    console.log('Email:', email)
    console.log('Password:', password ? '***' : 'empty')
    
    if (e) {
      e.preventDefault()
      e.stopPropagation()
      console.log('Event prevented')
    }
    
    // Simple validation
    if (!email || !password) {
      console.log('Missing email or password')
      setError('Please enter both email and password')
      setShowError(true)
      return
    }
    
    console.log('Validation passed, calling API...')
    setError('')
    setShowError(false)
    setLoading(true)
    
    // Test error display
    setTimeout(() => {
      console.log('Setting test error...')
      setError('Test: Error display is working!')
      setShowError(true)
    }, 1000)

    try {
      const credentials = { email, password }
      const response = await authService.login(credentials)
      
      if (response && response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify({
          email: response.email,
          role: response.role || 'user'
        }))
        // Dispatch custom event to trigger Navigation re-render
        window.dispatchEvent(new Event('authChange'))
        navigate('/courses')
      }
    } catch (err) {
      console.log('Login error caught:', err)
      console.log('Error response:', err.response)
      console.log('Error status:', err.response?.status)
      console.log('Error data:', err.response?.data)
      
      let errorMessage = 'Login failed'
      
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const errors = err.response.data.errors
        const errorMessages = []
        
        if (errors.Email) errorMessages.push(errors.Email[0])
        if (errors.Password) errorMessages.push(errors.Password[0])
        
        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join('. ')
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      console.log('Setting error message:', errorMessage)
      setError(errorMessage)
      setShowError(true)
      console.log('Error state set - showError:', true, 'error:', errorMessage)
      
      // Auto-hide error after 8 seconds
      setTimeout(() => {
        setShowError(false)
      }, 8000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="form-container">
        <style>
          {`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .form-container input:focus {
              outline: 2px solid #007bff;
              outline-offset: 2px;
              border-color: #007bff;
            }
            
            .form-container button:hover:not(:disabled) {
              transform: translateY(-1px);
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            
            .form-container button:disabled {
              cursor: not-allowed;
              opacity: 0.6;
            }
          `}
        </style>
        <h2>Login</h2>
        
        {showError && error && (
          <div 
            className="error-message" 
            style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px 16px',
              borderRadius: '4px',
              border: '1px solid #f5c6cb',
              marginBottom: '20px',
              position: 'relative',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>⚠️ Error:</span>
              <button 
                onClick={() => setShowError(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#721c24',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '0',
                  lineHeight: '1'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ marginTop: '8px' }}>{error}</div>
          </div>
        )}
        
        <div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              onKeyPress={handleKeyPress}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              onKeyPress={handleKeyPress}
              required
            />
          </div>

          <button 
            type="button" 
            className="btn btn-primary"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <p><strong>Demo Credentials:</strong></p>
          <p><strong>Admin:</strong><br />Email: admin@example.com<br />Password: admin123</p>
          <p><strong>User:</strong><br />Email: user@example.com<br />Password: user123</p>
        </div>
      </div>
    </div>
  )
}

import api from './api'

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify({
          email: response.data.email,
          role: response.data.role
        }))
      }
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('Making login request with:', credentials)
      console.log('Request data structure:', JSON.stringify(credentials))
      const response = await api.post('/auth/login', credentials)
      console.log('Login API response:', response)
      console.log('Login response data:', response.data)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify({
          email: response.data.email,
          role: response.data.role
        }))
      }
      return response.data
    } catch (error) {
      console.error('Login service error:', error)
      throw error
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token')
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem('user')
    if (!user) return null
    try {
      return JSON.parse(user)
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('user') // Clear corrupted data
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  }
}

export default authService

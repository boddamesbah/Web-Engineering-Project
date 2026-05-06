import api from './api'

const enrollmentService = {
  // Get all enrollments
  getAllEnrollments: async () => {
    try {
      const response = await api.get('/enrollments')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get enrollment by ID
  getEnrollmentById: async (id) => {
    try {
      const response = await api.get(`/enrollments/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Enroll student in course
  createEnrollment: async (enrollmentData) => {
    try {
      const response = await api.post('/enrollments', enrollmentData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update enrollment (e.g., update grade)
  updateEnrollment: async (id, enrollmentData) => {
    try {
      const response = await api.put(`/enrollments/${id}`, enrollmentData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete enrollment (unenroll)
  deleteEnrollment: async (id) => {
    try {
      await api.delete(`/enrollments/${id}`)
    } catch (error) {
      throw error
    }
  }
}

export default enrollmentService

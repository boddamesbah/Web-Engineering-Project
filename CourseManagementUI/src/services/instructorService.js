import api from './api'

const instructorService = {
  // Get all instructors
  getAllInstructors: async () => {
    try {
      const response = await api.get('/instructors')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get instructor by ID
  getInstructorById: async (id) => {
    try {
      const response = await api.get(`/instructors/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Create new instructor
  createInstructor: async (instructorData) => {
    try {
      const response = await api.post('/instructors', instructorData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update instructor
  updateInstructor: async (id, instructorData) => {
    try {
      const response = await api.put(`/instructors/${id}`, instructorData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete instructor
  deleteInstructor: async (id) => {
    try {
      await api.delete(`/instructors/${id}`)
    } catch (error) {
      throw error
    }
  }
}

export default instructorService

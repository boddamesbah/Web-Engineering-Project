import api from './api'

const studentService = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await api.get('/students')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get student by ID
  getStudentById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Create new student
  createStudent: async (studentData) => {
    try {
      const response = await api.post('/students', studentData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update student
  updateStudent: async (id, studentData) => {
    try {
      const response = await api.put(`/students/${id}`, studentData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete student
  deleteStudent: async (id) => {
    try {
      await api.delete(`/students/${id}`)
    } catch (error) {
      throw error
    }
  }
}

export default studentService

import api from './api'

const courseService = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await api.get('/courses')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get course by ID
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Create new course
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update course
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete course
  deleteCourse: async (id) => {
    try {
      await api.delete(`/courses/${id}`)
    } catch (error) {
      throw error
    }
  },

  // Get course with instructors
  getCourseWithInstructor: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default courseService

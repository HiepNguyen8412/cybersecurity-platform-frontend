import api, { parseApiError } from "./api"

export const progressService = {
  /**
   * Enroll user into a course
   */
  async enrollCourse(courseId) {
    try {
      const response = await api.post(`/progress/courses/${courseId}/enroll`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get all active enrollments for authenticated user
   */
  async getMyEnrollments() {
    try {
      const response = await api.get("/progress/my-courses")
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get detailed course progress
   */
  async getCourseProgress(courseId) {
    try {
      const response = await api.get(`/progress/courses/${courseId}`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Mark lesson as completed
   */
  async completeLesson(lessonId) {
    try {
      const response = await api.post(`/progress/lessons/${lessonId}/complete`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Reset lesson completion status
   */
  async resetLesson(lessonId) {
    try {
      const response = await api.post(`/progress/lessons/${lessonId}/reset`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },
}

export default progressService

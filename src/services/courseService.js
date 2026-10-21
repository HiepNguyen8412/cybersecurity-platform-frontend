import api, { parseApiError } from "./api"

export const courseService = {
  /**
   * Fetch all courses with optional filters and pagination
   */
  async getCourses(params = {}) {
    try {
      const response = await api.get("/courses", { params })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get course details by numeric ID
   */
  async getCourseById(id) {
    try {
      const response = await api.get(`/courses/${id}`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get course details by URL slug
   */
  async getCourseBySlug(slug) {
    try {
      const response = await api.get(`/courses/slug/${slug}`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get modules for a course
   */
  async getModulesByCourseId(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}/modules`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get all lessons for a course in curriculum order
   */
  async getLessonsByCourseId(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}/lessons`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get module details by ID
   */
  async getModuleById(id) {
    try {
      const response = await api.get(`/modules/${id}`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get lessons inside a module
   */
  async getLessonsByModuleId(moduleId) {
    try {
      const response = await api.get(`/modules/${moduleId}/lessons`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get lesson by ID
   */
  async getLessonById(id) {
    try {
      const response = await api.get(`/lessons/${id}`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get lesson by slug
   */
  async getLessonBySlug(slug) {
    try {
      const response = await api.get(`/lessons/slug/${slug}`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },
}

export default courseService

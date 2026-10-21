import api, { parseApiError } from "./api"

export const challengeService = {
  /**
   * List CTF challenges with category/difficulty filters
   */
  async getChallenges(params = {}) {
    try {
      const response = await api.get("/challenges", { params })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get challenge details by ID
   */
  async getChallengeById(id) {
    try {
      const response = await api.get(`/challenges/${id}`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get challenge details by slug
   */
  async getChallengeBySlug(slug) {
    try {
      const response = await api.get(`/challenges/slug/${slug}`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Submit flag for a challenge
   */
  async submitFlag(challengeId, flag) {
    try {
      const response = await api.post(`/challenges/${challengeId}/submit`, { flag })
      return { success: true, data: response.data }
    } catch (err) {
      return {
        success: false,
        error: parseApiError(err, "Không thể gửi cờ thử thách."),
        status: err.response?.status,
      }
    }
  },

  /**
   * Get global CTF Leaderboard
   */
  async getLeaderboard() {
    try {
      const response = await api.get("/challenges/leaderboard")
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },
}

export default challengeService

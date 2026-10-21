import api, { parseApiError } from "./api"

export const adminService = {
  /**
   * Get paginated admin audit logs
   */
  async getAuditLogs(params = {}) {
    try {
      const response = await api.get("/admin/audit-logs", { params })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get server health status and circuit breaker states
   */
  async getServerStatus() {
    try {
      const response = await api.get("/admin/server/status")
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Get detailed JVM, HikariCP, and system metrics
   */
  async getServerMetrics() {
    try {
      const response = await api.get("/admin/server/metrics")
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },
}

export default adminService

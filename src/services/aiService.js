import api, { parseApiError } from "./api"

export const aiService = {
  /**
   * Get exploit hints for lab challenge
   */
  async getExploitHint(prompt, contextCode = "") {
    try {
      const response = await api.post("/ai/exploit-hint", { prompt, contextCode })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Run automated security source code audit
   */
  async auditCode(sourceCode, language = "java") {
    try {
      const response = await api.post("/ai/audit-code", { sourceCode, language })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Analyze raw security logs
   */
  async analyzeLogs(logContent) {
    try {
      const response = await api.post("/ai/analyze-logs", { logContent })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Generate dynamic threat modeling scenario
   */
  async generateThreatScenario(topic) {
    try {
      const response = await api.post("/ai/threat-scenario", { topic })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Query CVE intelligence details
   */
  async analyzeCve(cveId) {
    try {
      const response = await api.post("/ai/cve-intel", { cveId })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },

  /**
   * Conversational security chat
   */
  async chat(message, provider = "gemini") {
    try {
      const response = await api.post("/ai/chat", { message, provider })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: parseApiError(err) }
    }
  },
}

export default aiService

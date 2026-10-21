import api from "./api"

/**
 * Service handling Waitlist Leads, Quiz Attempts, Capstone Rubrics & Digital Certificates
 */
export const certificationService = {
  // 1. Waitlist Interest
  registerWaitlist: async (email, tier = "pro", source = "pricing_beta") => {
    const response = await api.post("/public/waitlist", { email, tier, source })
    return response.data
  },

  // 2. Quiz Attempts
  submitQuiz: async (lessonId, selectedOption, correctOption) => {
    const response = await api.post(`/lessons/${lessonId}/quiz`, {
      selectedOption,
      correctOption,
    })
    return response.data
  },

  getCourseQuizSummary: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/quiz-summary`)
    return response.data
  },

  // 3. Capstone Projects
  submitCapstone: async (courseId, { reportContent, solutionUrl, reconScore, exploitScore, remediationScore, reportScore }) => {
    const response = await api.post(`/courses/${courseId}/capstone`, {
      reportContent,
      solutionUrl,
      reconScore,
      exploitScore,
      remediationScore,
      reportScore,
    })
    return response.data
  },

  getCapstoneStatus: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/capstone`)
    return response.data
  },

  // 4. Digital Certificates
  claimCertificate: async (courseId) => {
    const response = await api.post(`/certificates/claim/${courseId}`)
    return response.data
  },

  getCertificateForCourse: async (courseId) => {
    const response = await api.get(`/certificates/course/${courseId}`)
    return response.data
  },

  getMyCertificates: async () => {
    const response = await api.get("/certificates/my-certificates")
    return response.data
  },

  verifyCertificate: async (certificateCode) => {
    const response = await api.get(`/certificates/verify/${certificateCode}`)
    return response.data
  },
}

export default certificationService

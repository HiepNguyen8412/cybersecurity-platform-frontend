import { useState, useEffect } from "react"
import useAuth from "../../hooks/useAuth"
import {
  DashboardHeader,
  NextStepCard,
  LearningOverview,
  LearningPathCard,
  RecommendedSection,
  SkillOverview,
  RecentActivity,
  AIMentorCard,
  MitreRadarChart,
  ActivityHeatmapChart,
} from "./components"
import {
  mockNextStep,
  mockLearningOverview,
  mockLearningPaths,
  mockRecommendedContent,
  mockSkillOverview,
  mockRecentActivity,
  mockAIMentorGuidance,
} from "../../data/dashboardMockData"
import { Loader2 } from "lucide-react"
import progressService from "../../services/progressService"
import courseService from "../../services/courseService"

export function Dashboard() {
  const { user, isInitializing } = useAuth()
  const [stats, setStats] = useState(mockLearningOverview)
  const [learningPaths, setLearningPaths] = useState(mockLearningPaths)

  const learnerName = user?.fullName || user?.name || "Chuyên viên SOC"

  useEffect(() => {
    async function loadUserTelemetry() {
      try {
        const [enrollRes, courseRes] = await Promise.all([
          progressService.getMyEnrollments(),
          courseService.getCourses(),
        ])

        if (enrollRes.success && Array.isArray(enrollRes.data) && enrollRes.data.length > 0) {
          const totalCompleted = enrollRes.data.reduce((acc, curr) => acc + (curr.completedLessons || 0), 0)
          setStats((prev) => ({
            ...prev,
            completedLessons: { ...prev.completedLessons, value: totalCompleted || prev.completedLessons.value },
          }))
        }

        if (courseRes.success && Array.isArray(courseRes.data) && courseRes.data.length > 0) {
          const mapped = courseRes.data.map((c, idx) => ({
            id: c.slug || `track-${c.id}`,
            title: c.title,
            track: c.difficulty === "BEGINNER" ? "Phòng Thủ Web" : "Tác Chiến Mạng",
            progress: idx === 0 ? 35 : 0,
            isCurrent: idx === 0,
            status: c.published ? "Đang diễn tập" : "Sắp ra mắt",
            estimatedHours: 18,
            currentTopic: c.description ? c.description.slice(0, 45) + "..." : "Khám phá kiến trúc bảo mật",
            stages: [
              { title: "Nền tảng kiến trúc", completed: true },
              { title: "Khai thác thực hành", completed: false },
              { title: "Vá lỗi & Phòng thủ", completed: false },
            ],
          }))
          setLearningPaths(mapped)
        }
      } catch (err) {
        console.warn("Could not load dashboard telemetry", err)
      }
    }
    loadUserTelemetry()
  }, [])

  const currentPath = learningPaths.find((p) => p.isCurrent) || learningPaths[0]

  if (isInitializing) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-3"
      >
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" aria-hidden="true" />
        <p className="text-xs font-semibold text-slate-400">
          Đang tải dữ liệu Trung tâm Điều hành SOC...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in-up">
      {/* ====================================================================
          SECTION A: WELCOME
         ==================================================================== */}
      <DashboardHeader
        userName={learnerName}
        streakDays={7}
        activePathTitle={currentPath?.title || "Security Analyst"}
      />

      {/* ====================================================================
          SECTION B: YOUR NEXT STEP
         ==================================================================== */}
      <NextStepCard nextStep={mockNextStep} />

      {/* ====================================================================
          SECTION C: LEARNING OVERVIEW (4 KEY STATS)
         ==================================================================== */}
      <LearningOverview stats={stats} />

      {/* ====================================================================
          SECTION D: CYBERSECURITY ANALYTICS & MITRE RADAR
         ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MitreRadarChart />
        <ActivityHeatmapChart />
      </div>

      {/* ====================================================================
          MAIN DASHBOARD TWO-COLUMN LAYOUT
          Desktop: 7 cols (Learning content) / 5 cols (SOC Intel, Skills, Activity)
         ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Primary Curriculum & Next Milestones */}
        <div className="lg:col-span-7 space-y-6">
          <LearningPathCard paths={learningPaths} />
          <RecommendedSection items={mockRecommendedContent} />
        </div>

        {/* Right Column (5 cols): Contextual Mentor, Competency & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          <AIMentorCard guidance={mockAIMentorGuidance} />
          <SkillOverview skills={mockSkillOverview} />
          <RecentActivity activities={mockRecentActivity} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

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

/**
 * Dashboard Page
 * 
 * The primary learning home for the cybersecurity learning platform.
 * Answers 4 core questions:
 * 1. Where am I in my learning journey? (Welcome, Path Status, Streak)
 * 2. What should I do next? (Your Next Step - Primary focal card)
 * 3. How am I progressing? (Learning Overview 4 stats + Skill Overview + MITRE radar)
 * 4. What should I learn or practice next? (Learning Path stages + Recommended content)
 */
export function Dashboard() {
  const { user, isInitializing } = useAuth()

  const learnerName = user?.fullName || user?.name || "Chuyên viên SOC"
  const currentPath = mockLearningPaths.find((p) => p.isCurrent) || mockLearningPaths[0]

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
      <LearningOverview stats={mockLearningOverview} />

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
          <LearningPathCard paths={mockLearningPaths} />
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

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
 * 
 * Answers 4 core questions:
 * 1. Where am I in my learning journey? (Welcome, Path Status, Streak)
 * 2. What should I do next? (Your Next Step - Primary focal card)
 * 3. How am I progressing? (Learning Overview 4 stats + Skill Overview)
 * 4. What should I learn or practice next? (Learning Path stages + Recommended content)
 * 
 * Follows Figma UX/UI, accessibility guidelines, and single source of truth for user state.
 */
export function Dashboard() {
  const { user, isInitializing } = useAuth()

  // Gracefully resolve learner name:
  // Architecture supports user.fullName (current mock: "Hiệp Nguyễn"),
  // user.name (Spring Boot backend standard), or safely falls back to "Learner".
  const learnerName = user?.fullName || user?.name || "Learner"

  // Active path title from mock data
  const currentPath = mockLearningPaths.find((p) => p.isCurrent) || mockLearningPaths[0]

  // If session is still initializing, render a clean accessible skeleton/loading state
  if (isInitializing) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-3"
      >
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-hidden="true" />
        <p className="text-xs font-semibold text-slate-500">
          Loading learning dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in-up">
      {/* ====================================================================
          SECTION A: WELCOME
          "Good morning, {learnerName} 👋"
          "Continue your cybersecurity journey."
         ==================================================================== */}
      <DashboardHeader
        userName={learnerName}
        streakDays={7}
        activePathTitle={currentPath?.title || "Security Analyst"}
      />

      {/* ====================================================================
          SECTION B: YOUR NEXT STEP
          Primary focal section of the Dashboard.
          Immediately answers "What should I do next?"
         ==================================================================== */}
      <NextStepCard nextStep={mockNextStep} />

      {/* ====================================================================
          SECTION C: LEARNING OVERVIEW
          Four concise statistics:
          - Overall Progress (42%)
          - Courses Completed (4)
          - Labs Completed (12)
          - Current Streak (7 days)
         ==================================================================== */}
      <LearningOverview stats={mockLearningOverview} />

      {/* ====================================================================
          MAIN DASHBOARD TWO-COLUMN LAYOUT
          Desktop: 7 cols (Learning content) / 5 cols (AI, Skills, Activity)
          Tablet & Mobile: Single-column stack
         ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Primary Curriculum & Next Milestones */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION D: LEARNING PATH (Security Analyst + path switcher) */}
          <LearningPathCard paths={mockLearningPaths} />

          {/* SECTION E: RECOMMENDED CONTENT (Network Security, Web Security, SQLi, Linux) */}
          <RecommendedSection items={mockRecommendedContent} />
        </div>

        {/* Right Column (5 cols): Contextual Mentor, Competency & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* SECTION H: CONTEXTUAL AI MENTOR (Integrated learning helper) */}
          <AIMentorCard guidance={mockAIMentorGuidance} />

          {/* SECTION F: SKILL OVERVIEW (Network Sec 68%, Web Sec 45%, Linux 82%, Crypto 30%) */}
          <SkillOverview skills={mockSkillOverview} />

          {/* SECTION G: RECENT ACTIVITY (Concise milestone timeline) */}
          <RecentActivity activities={mockRecentActivity} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

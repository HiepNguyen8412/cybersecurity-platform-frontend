import { useState, useEffect, useMemo } from "react"
import { Loader2 } from "lucide-react"
import useAuth from "../../hooks/useAuth"
import useLabStore from "../../stores/useLabStore"
import progressService from "../../services/progressService"
import courseService from "../../services/courseService"
import challengeService from "../../services/challengeService"
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
  mockMitreRadarData,
  mockWeeklyActivity,
} from "../../data/dashboardMockData"

function unwrapList(res) {
  if (!res?.success || !res.data) return []
  if (Array.isArray(res.data)) return res.data
  if (Array.isArray(res.data.content)) return res.data.content
  return []
}

function normalizeCourseDifficulty(raw) {
  const upper = String(raw || "").toUpperCase()
  if (upper === "BEGINNER" || upper === "EASY" || upper === "NOVICE") {
    return { label: "Cơ bản", key: "beginner", hours: "14 giờ thực hành" }
  }
  if (upper === "HARD" || upper === "ADVANCED") {
    return { label: "Nâng cao", key: "advanced", hours: "24 giờ thực hành" }
  }
  return { label: "Trung cấp", key: "intermediate", hours: "18 giờ thực hành" }
}

function buildStagesFromProgress(progress) {
  const pct = Number(progress) || 0
  const templates = [
    "Nền tảng kiến trúc & nguyên lý cốt lõi",
    "Phân tích vector tấn công & CWE",
    "Thực nghiệm phòng thủ & vá lỗi mã nguồn",
    "Đánh giá tổng hợp & đồ án Capstone",
  ]
  const thresholds = [25, 50, 75, 100]

  return templates.map((name, index) => {
    const prevThreshold = index === 0 ? 0 : thresholds[index - 1]
    let status = "upcoming"
    if (pct >= thresholds[index]) {
      status = "completed"
    } else if (pct > prevThreshold || (pct === 0 && index === 0)) {
      status = pct > 0 ? "in-progress" : "upcoming"
    }
    return { id: index + 1, name, status }
  })
}

export function Dashboard() {
  const { user, isInitializing } = useAuth()
  const completedLabs = useLabStore((state) => state.completedLabs)
  const userPoints = useLabStore((state) => state.userPoints)
  const syncSolvedLabs = useLabStore((state) => state.syncSolvedLabs)

  const [enrollments, setEnrollments] = useState([])
  const [courses, setCourses] = useState([])
  const [challenges, setChallenges] = useState([])
  const [isLiveSynced, setIsLiveSynced] = useState(false)

  const learnerName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.fullName ||
    user?.name ||
    user?.username ||
    "Nghiên cứu viên CyberPath"

  useEffect(() => {
    let isMounted = true

    async function loadUserTelemetry() {
      const [enrollResult, courseResult, challengeResult] = await Promise.allSettled([
        progressService.getMyEnrollments(),
        courseService.getCourses(),
        challengeService.getChallenges(),
      ])

      if (!isMounted) return

      let anyLiveSuccess = false

      if (enrollResult.status === "fulfilled" && enrollResult.value?.success) {
        const list = unwrapList(enrollResult.value)
        setEnrollments(list)
        anyLiveSuccess = true
      }

      if (courseResult.status === "fulfilled" && courseResult.value?.success) {
        const list = unwrapList(courseResult.value)
        setCourses(list)
        anyLiveSuccess = true
      }

      if (challengeResult.status === "fulfilled" && challengeResult.value?.success) {
        const list = unwrapList(challengeResult.value)
        setChallenges(list)
        anyLiveSuccess = true

        const solvedIds = list
          .filter((item) => Boolean(item.solved))
          .map((item) => item.slug || `lab-${item.id}`)
        if (solvedIds.length > 0) {
          syncSolvedLabs(solvedIds)
        }
      }

      if (anyLiveSuccess) {
        setIsLiveSynced(true)
      }
    }

    loadUserTelemetry()

    return () => {
      isMounted = false
    }
  }, [syncSolvedLabs])

  // Map khóa học thực tế từ Backend kết hợp dữ liệu ghi danh, dự phòng sạch bằng mockLearningPaths
  const learningPaths = useMemo(() => {
    if (courses.length === 0) return mockLearningPaths

    return courses.map((course, idx) => {
      const matchedEnrollment = enrollments.find(
        (e) => e.courseId === course.id || (course.slug && e.courseSlug === course.slug)
      )
      const diffMeta = normalizeCourseDifficulty(course.difficulty)
      const progress = matchedEnrollment ? Number(matchedEnrollment.progressPercentage) || 0 : 0
      const stages = buildStagesFromProgress(progress)
      const completedStages = stages.filter((s) => s.status === "completed").length
      const activeStageObj =
        stages.find((s) => s.status === "in-progress") ||
        stages.find((s) => s.status === "upcoming") ||
        stages[stages.length - 1]
      const totalLessons = Number(matchedEnrollment?.totalLessons) || 12

      return {
        id: course.slug || `course-${course.id}`,
        title: course.title,
        isCurrent: Boolean(matchedEnrollment) || (enrollments.length === 0 && idx === 0),
        description:
          course.description ||
          "Chương trình đào tạo an ninh mạng chuyên sâu kết hợp phân tích học thuật và thực nghiệm cô lập.",
        progress,
        currentStage: `Chặng ${activeStageObj.id}: ${activeStageObj.name}`,
        currentStageNumber: activeStageObj.id,
        totalStages: stages.length,
        completedStages,
        stages,
        modulesCount: Math.max(4, Math.ceil(totalLessons / 3)),
        labsCount: Math.max(4, Math.ceil(totalLessons / 2)),
        estimatedHours: diffMeta.hours,
        ctaLabel: matchedEnrollment ? "Tiếp tục lộ trình" : "Khám phá học phần",
        ctaPath: "/learning",
      }
    })
  }, [courses, enrollments])

  // Tính toán 4 chỉ số KPI tổng quan (luôn là mảng 4 phần tử ổn định)
  const overviewStats = useMemo(() => {
    const hasEnrollmentData = enrollments.length > 0
    const hasCourseCatalog = courses.length > 0
    const hasChallengeData = challenges.length > 0

    // 1. Tiến độ tổng thể
    let progressStat = mockLearningOverview[0]
    if (hasEnrollmentData) {
      const totalLessons = enrollments.reduce((sum, item) => sum + (Number(item.totalLessons) || 0), 0)
      const doneLessons = enrollments.reduce(
        (sum, item) => sum + (Number(item.completedLessons) || 0),
        0
      )
      const avgPct =
        totalLessons > 0
          ? Math.round((doneLessons / totalLessons) * 100)
          : Math.round(
              enrollments.reduce((sum, item) => sum + (Number(item.progressPercentage) || 0), 0) /
                enrollments.length
            )

      progressStat = {
        ...mockLearningOverview[0],
        value: avgPct,
        subtitle: `Trên ${enrollments.length} học phần đã ghi danh`,
        trend: totalLessons > 0 ? `${doneLessons}/${totalLessons} bài học` : "Đang cập nhật",
      }
    }

    // 2. Học phần hoàn thành
    let coursesStat = mockLearningOverview[1]
    if (hasEnrollmentData || hasCourseCatalog) {
      const completedCoursesCount = enrollments.filter(
        (item) => Number(item.progressPercentage) >= 100 || item.status === "COMPLETED"
      ).length
      const totalCatalog = courses.length || Math.max(enrollments.length, 4)

      coursesStat = {
        ...mockLearningOverview[1],
        value: completedCoursesCount,
        subtitle: `${completedCoursesCount} hoàn thành · ${enrollments.length}/${totalCatalog} đã ghi danh`,
        trend:
          enrollments.length > 0
            ? `${enrollments.length} học phần đang học`
            : `${totalCatalog} học phần sẵn có`,
      }
    }

    // 3. Phòng Lab đã vượt qua (kết hợp dữ liệu challengeService và useLabStore)
    let labsStat = {
      ...mockLearningOverview[2],
      value:
        completedLabs.length > 1
          ? mockLearningOverview[2].value + (completedLabs.length - 1)
          : mockLearningOverview[2].value,
      trend: `${userPoints.toLocaleString("vi-VN")} XP tích lũy`,
    }

    if (hasChallengeData) {
      const solvedSet = new Set(completedLabs)
      const solvedCount = challenges.filter(
        (c) =>
          Boolean(c.solved) ||
          (c.slug && solvedSet.has(c.slug)) ||
          solvedSet.has(String(c.id)) ||
          solvedSet.has(`lab-${c.id}`)
      ).length

      labsStat = {
        ...mockLearningOverview[2],
        value: solvedCount,
        subtitle: `${solvedCount} trên ${challenges.length} phòng thí nghiệm CTF`,
        trend: `${userPoints.toLocaleString("vi-VN")} XP tích lũy`,
      }
    }

    // 4. Chuỗi ngày nghiên cứu
    const streakStat = mockLearningOverview[3]

    return [progressStat, coursesStat, labsStat, streakStat]
  }, [enrollments, courses, challenges, completedLabs, userPoints])

  // Tính toán thẻ Bước tiếp theo đề xuất
  const nextStepData = useMemo(() => {
    if (enrollments.length > 0) {
      const activeEnrollment =
        enrollments.find((e) => e.progressPercentage > 0 && e.progressPercentage < 100) ||
        enrollments[0]
      const totalLessons = Number(activeEnrollment.totalLessons) || 6
      const completedLessons = Number(activeEnrollment.completedLessons) || 0
      const progressPct = Number(activeEnrollment.progressPercentage) || 0

      return {
        ...mockNextStep,
        type: "Học phần đang theo học",
        courseTitle: activeEnrollment.courseTitle || mockNextStep.courseTitle,
        lessonTitle: `Tiếp tục chuyên đề: ${activeEnrollment.courseTitle || "An ninh ứng dụng"}`,
        description:
          "Tiến độ học phần của bạn đã được đồng bộ với máy chủ. Tiếp tục hoàn thành bài giảng tiếp theo và thực hành trên môi trường Lab cô lập.",
        progress: progressPct,
        currentTopic: `Đã hoàn thành ${completedLessons}/${totalLessons} bài học trong học phần`,
        nextObjectiveLabel:
          completedLessons < totalLessons
            ? `Mục tiêu kế tiếp: Hoàn thành bài ${completedLessons + 1}/${totalLessons}`
            : "Mục tiêu kế tiếp: Thực hiện đồ án kiểm chứng cuối khóa",
        completedObjectives: completedLessons,
        totalObjectives: totalLessons,
        primaryAction: { label: "Tiếp tục học phần", path: "/learning" },
        secondaryAction: { label: "Mở phòng Lab", path: "/labs" },
      }
    }

    if (challenges.length > 0) {
      const solvedSet = new Set(completedLabs)
      const nextChallenge =
        challenges.find(
          (c) => !c.solved && !solvedSet.has(c.slug) && !solvedSet.has(`lab-${c.id}`)
        ) || challenges[0]
      const diffMeta = normalizeCourseDifficulty(nextChallenge.difficulty)

      return {
        ...mockNextStep,
        type: "Phòng Lab CTF đề xuất",
        mitreCode: "MITRE ATT&CK · Thực chiến",
        cweCode: nextChallenge.category ? String(nextChallenge.category).toUpperCase() : "CTF",
        courseTitle: `Thử thách mức độ ${diffMeta.label}`,
        lessonTitle: nextChallenge.title,
        description: nextChallenge.description || mockNextStep.description,
        progress: nextChallenge.solved ? 100 : 25,
        currentTopic: `Thưởng hoàn thành: +${nextChallenge.points || 400} XP`,
        nextObjectiveLabel: "Mục tiêu kế tiếp: Phân tích lỗ hổng và xác thực Flag",
        completedObjectives: nextChallenge.solved ? 1 : 0,
        totalObjectives: 1,
        estimatedTime: "Khoảng 30 phút",
        primaryAction: { label: "Mở phòng thí nghiệm", path: "/labs" },
        secondaryAction: { label: "Xem giáo trình", path: "/learning" },
      }
    }

    return mockNextStep
  }, [enrollments, challenges, completedLabs])

  // Danh sách học phần & phòng Lab đề xuất từ API thực tế hoặc fallback
  const recommendedItems = useMemo(() => {
    if (courses.length === 0 && challenges.length === 0) {
      return mockRecommendedContent
    }

    const liveItems = []

    courses.slice(0, 2).forEach((course) => {
      const matchedEnrollment = enrollments.find(
        (e) => e.courseId === course.id || (course.slug && e.courseSlug === course.slug)
      )
      const diffMeta = normalizeCourseDifficulty(course.difficulty)
      const pct = matchedEnrollment ? Number(matchedEnrollment.progressPercentage) || 0 : 0

      liveItems.push({
        id: `course-${course.id}`,
        title: course.title,
        description:
          course.description ||
          "Học phần lý thuyết chuyên sâu kết hợp bài tập phân tích mã nguồn và tình huống phòng thủ.",
        type: "Khóa học",
        typeKey: "course",
        difficulty: diffMeta.label,
        difficultyKey: diffMeta.key,
        duration: diffMeta.hours,
        progress: pct,
        status: pct >= 100 ? "Hoàn thành" : pct > 0 ? "Đang học" : "Chưa bắt đầu",
        ctaLabel: pct > 0 ? "Tiếp tục" : "Bắt đầu học",
        path: "/learning",
      })
    })

    const solvedSet = new Set(completedLabs)
    challenges.slice(0, 2).forEach((ch) => {
      const diffMeta = normalizeCourseDifficulty(ch.difficulty)
      const isSolved =
        Boolean(ch.solved) ||
        (ch.slug && solvedSet.has(ch.slug)) ||
        solvedSet.has(`lab-${ch.id}`)

      liveItems.push({
        id: `challenge-${ch.id}`,
        title: ch.title,
        description:
          ch.description ||
          "Bài thực hành phân tích lỗ hổng và khai thác phòng thủ trong môi trường Sandbox cô lập.",
        type: "Phòng Lab",
        typeKey: "lab",
        difficulty: diffMeta.label,
        difficultyKey: diffMeta.key,
        duration: `${ch.points || 400} XP`,
        progress: isSolved ? 100 : 0,
        status: isSolved ? "Hoàn thành" : "Chưa bắt đầu",
        ctaLabel: isSolved ? "Xem lại Lab" : "Mở Lab",
        path: "/labs",
      })
    })

    if (liveItems.length < 4) {
      const existingTitles = new Set(liveItems.map((i) => i.title.toLowerCase()))
      for (const fallback of mockRecommendedContent) {
        if (liveItems.length >= 4) break
        if (!existingTitles.has(fallback.title.toLowerCase())) {
          liveItems.push(fallback)
        }
      }
    }

    return liveItems
  }, [courses, challenges, enrollments, completedLabs])

  const currentPath = learningPaths.find((p) => p.isCurrent) || learningPaths[0]

  if (isInitializing) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-3"
      >
        <Loader2
          className="h-7 w-7 animate-spin text-[#1D4ED8] dark:text-[#38BDF8]"
          aria-hidden="true"
        />
        <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
          Đang tải dữ liệu không gian học tập...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10 animate-fade-in-up">
      {/* 1. Phần đầu trang chào mừng & ngữ cảnh */}
      <DashboardHeader
        userName={learnerName}
        streakDays={7}
        activePathTitle={currentPath?.title || "Chuyên viên Phân tích An ninh SOC"}
        userPoints={userPoints}
        isLiveSynced={isLiveSynced}
      />

      {/* 2. Khối bước tiếp theo đề xuất */}
      <NextStepCard nextStep={nextStepData} />

      {/* 3. Bốn chỉ số KPI tổng quan */}
      <LearningOverview stats={overviewStats} />

      {/* 4. Biểu đồ năng lực MITRE ATT&CK & nhịp độ học tập tuần */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MitreRadarChart data={mockMitreRadarData} />
        <ActivityHeatmapChart data={mockWeeklyActivity} streakDays={7} />
      </div>

      {/* 5. Bố cục hai cột chính: Lộ trình & Đề xuất (7 cột) / Trợ lý AI, Năng lực & Nhật ký (5 cột) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <LearningPathCard paths={learningPaths} />
          <RecommendedSection items={recommendedItems} />
        </div>

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

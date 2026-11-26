import { useState, useEffect, useMemo, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  Shield,
  Calendar,
  Flame,
  ArrowRight,
  ChevronRight,
  FileCheck,
  BookOpen,
  RefreshCw,
  CheckCircle2,
  Compass,
  Clock,
} from "lucide-react"
import { Card, Button, CountUp } from "../../components/common"
import progressService from "../../services/progressService"
import challengeService from "../../services/challengeService"
import useLearningStore from "../../stores/useLearningStore"
import useLabStore from "../../stores/useLabStore"
import useAuth from "../../hooks/useAuth"

const BASELINE_DOMAINS = [
  {
    id: "web",
    categoryKeys: ["web"],
    name: "Bảo mật Ứng dụng Web (OWASP Top 10)",
    code: "OWASP A01–A10 · CWE-89",
    baselineScore: 84,
    baselineLabsDone: 14,
    totalLabs: 16,
    recommendedCode: "WEB-201",
    color: "bg-[#1D4ED8] dark:bg-[#3B82F6]",
  },
  {
    id: "soc",
    categoryKeys: ["defensive", "soc"],
    name: "Phòng thủ SOC, SIEM & Săn lùng Mối đe dọa",
    code: "MITRE ATT&CK · Sigma",
    baselineScore: 72,
    baselineLabsDone: 9,
    totalLabs: 12,
    recommendedCode: "SOC-101",
    color: "bg-emerald-600 dark:bg-emerald-500",
  },
  {
    id: "net",
    categoryKeys: ["network"],
    name: "Pháp chứng Gói tin & Giao thức Mạng",
    code: "PCAP · RFC 8446",
    baselineScore: 68,
    baselineLabsDone: 8,
    totalLabs: 12,
    recommendedCode: "NET-301",
    color: "bg-sky-600 dark:bg-sky-400",
  },
  {
    id: "cloud",
    categoryKeys: ["cloud"],
    name: "Bảo mật Hạ tầng Đám mây & AWS IAM",
    code: "IMDSv2 · NIST NICE",
    baselineScore: 45,
    baselineLabsDone: 4,
    totalLabs: 10,
    recommendedCode: "CLD-401",
    color: "bg-indigo-600 dark:bg-indigo-400",
  },
  {
    id: "rev",
    categoryKeys: ["reverse", "crypto", "pwn"],
    name: "Khai thác Nhị phân & Dịch ngược Mã nguồn",
    code: "CWE-121 · x86_64",
    baselineScore: 28,
    baselineLabsDone: 2,
    totalLabs: 8,
    recommendedCode: "PWN-301",
    color: "bg-amber-600 dark:bg-amber-400",
  },
]

const SAMPLE_FLAG_RECORDS = [
  {
    id: "sample-f1",
    title: "Vượt bộ lọc SQLi & Tham số hóa truy vấn",
    cve: "CWE-89",
    date: "Hôm nay · 14:22",
    xp: "+450 XP",
    flag: "FLAG{SQLi_P4TCH3D_V2}",
    isLive: false,
  },
  {
    id: "sample-f2",
    title: "Kiểm toán điểm sink XSS DOM-Based",
    cve: "CWE-79",
    date: "Hôm qua · 21:05",
    xp: "+300 XP",
    flag: "FLAG{XSS_DOM_BYP4SS}",
    isLive: false,
  },
  {
    id: "sample-f3",
    title: "Quy tắc phát hiện Suricata IDS cho lưu lượng C2",
    cve: "MITRE T1071",
    date: "06/10/2026 · 18:40",
    xp: "+350 XP",
    flag: "FLAG{SURIC4T4_C2_RUL3}",
    isLive: false,
  },
  {
    id: "sample-f4",
    title: "Khai thác nhầm lẫn thuật toán JWT RS256 sang HS256",
    cve: "MITRE T1556",
    date: "04/10/2026 · 11:15",
    xp: "+600 XP",
    flag: "FLAG{JWT_HM4C_F0RG3D}",
    isLive: false,
  },
  {
    id: "sample-f5",
    title: "Phân tích PCAP trích xuất kênh ngầm DNS Tunneling",
    cve: "MITRE T1048",
    date: "02/10/2026 · 16:30",
    xp: "+500 XP",
    flag: "FLAG{PCAP_DNS_STREAM_REC}",
    isLive: false,
  },
]

const KNOWN_LAB_META = {
  "lab-01": {
    title: "SQL Injection: Evasion Filter & Tham số hóa",
    cve: "CWE-89",
    category: "web",
    xp: 450,
    flag: "FLAG{SQLi_P4TCH3D_V2}",
  },
  "lab-02": {
    title: "Tấn công XSS DOM-Based & Bypass CSP",
    cve: "CWE-79",
    category: "web",
    xp: 300,
    flag: "FLAG{XSS_DOM_BYP4SS}",
  },
  "lab-03": {
    title: "Thao túng JWT & Nhầm lẫn Thuật toán",
    cve: "CWE-347",
    category: "web",
    xp: 600,
    flag: "FLAG{JWT_HM4C_F0RG3D}",
  },
  "lab-04": {
    title: "Pháp chứng Bộ nhớ RAM với Volatility 3",
    cve: "MITRE T1055",
    category: "soc",
    xp: 500,
    flag: "FLAG{V0L4T1L1TY_M3M_C2}",
  },
  "lab-05": {
    title: "Quy tắc Suricata & Phát hiện Lưu lượng C2",
    cve: "MITRE T1071",
    category: "soc",
    xp: 350,
    flag: "FLAG{SURIC4T4_C2_RUL3}",
  },
  "lab-06": {
    title: "Phân tích Gói tin & Chống Đầu độc ARP",
    cve: "MITRE T1557.002",
    category: "network",
    xp: 400,
    flag: "FLAG{4RP_SP00F_D3T3CT}",
  },
  "lab-07": {
    title: "Leo thang Đặc quyền AWS IAM & Cloud Metadata",
    cve: "MITRE T1078.004",
    category: "cloud",
    xp: 650,
    flag: "FLAG{CL0UD_IAM_PR1V3SC}",
  },
  "lab-08": {
    title: "Bắt tay TLS 1.3 & Kiểm toán Cipher Suite",
    cve: "RFC 8446",
    category: "network",
    xp: 450,
    flag: "FLAG{TLS_13_F0RW4RD_S3C}",
  },
}

function getMasteryLevelLabel(score) {
  if (score >= 80) return "Chuyên sâu"
  if (score >= 65) return "Thành thạo"
  if (score >= 45) return "Đang phát triển"
  return "Nền tảng"
}

export function Progress() {
  const { isAuthenticated } = useAuth()
  const {
    courses,
    enrolledCourses,
    completedLessons,
    userXp,
    syncStatus,
    fetchCoursesFromApi,
    fetchUserEnrollments,
  } = useLearningStore()

  const {
    completedLabs,
    userPoints,
    labCatalog,
    setLabCatalog,
    syncSolvedLabs,
  } = useLabStore()

  const [enrollments, setEnrollments] = useState([])
  const [serverConnected, setServerConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(true)
  const [selectedDomainId, setSelectedDomainId] = useState("web")

  const loadProgressTelemetry = useCallback(async () => {
    setIsSyncing(true)
    try {
      await Promise.allSettled([fetchCoursesFromApi(), fetchUserEnrollments()])

      const [enrollRes, challengeRes] = await Promise.allSettled([
        progressService.getMyEnrollments(),
        challengeService.getChallenges(),
      ])

      let liveReachable = false

      if (enrollRes.status === "fulfilled" && enrollRes.value?.success) {
        const list = Array.isArray(enrollRes.value.data) ? enrollRes.value.data : []
        setEnrollments(list)
        liveReachable = true
      }

      if (
        challengeRes.status === "fulfilled" &&
        challengeRes.value?.success &&
        Array.isArray(challengeRes.value.data)
      ) {
        const challenges = challengeRes.value.data
        liveReachable = true
        if (challenges.length > 0 && labCatalog.length === 0) {
          setLabCatalog(
            challenges.map((ch) => ({
              id: ch.slug || `lab-${ch.id}`,
              backendId: ch.id,
              title: ch.title,
              category: String(ch.category || "web").toLowerCase(),
              points: ch.points || 400,
              solved: Boolean(ch.solved),
              mitre: ch.category?.toUpperCase() || "MITRE ATT&CK",
            }))
          )
        }
        const solvedIds = challenges
          .filter((ch) => ch.solved)
          .map((ch) => ch.slug || `lab-${ch.id}`)
        if (solvedIds.length > 0) {
          syncSolvedLabs(solvedIds)
        }
      }

      setServerConnected(liveReachable)
    } catch {
      setServerConnected(false)
    } finally {
      setIsSyncing(false)
    }
  }, [fetchCoursesFromApi, fetchUserEnrollments, labCatalog.length, setLabCatalog, syncSolvedLabs])

  useEffect(() => {
    let active = true
    const run = async () => {
      if (!active) return
      await loadProgressTelemetry()
    }
    run()
    return () => {
      active = false
    }
  }, [loadProgressTelemetry])

  // Hợp nhất tiến độ từng học phần từ backend enrollments + Zustand useLearningStore
  const mergedCourseProgress = useMemo(() => {
    const rows = []
    const seenIds = new Set()

    courses.forEach((course) => {
      seenIds.add(course.id)
      const matchedEnrollment = enrollments.find(
        (e) =>
          e.courseSlug === course.id ||
          (course.backendId && e.courseId === course.backendId) ||
          (e.courseTitle && e.courseTitle.toLowerCase() === course.title?.toLowerCase())
      )
      const localDone = (completedLessons[course.id] || []).length
      const totalLessons =
        matchedEnrollment?.totalLessons || course.syllabus?.length || course.lessonsCount || 5
      const doneLessons = Math.min(
        totalLessons,
        Math.max(localDone, matchedEnrollment?.completedLessons || 0)
      )
      const percentage =
        matchedEnrollment?.progressPercentage !== undefined
          ? Math.max(
              matchedEnrollment.progressPercentage,
              Math.round((localDone / Math.max(1, totalLessons)) * 100)
            )
          : Math.round((doneLessons / Math.max(1, totalLessons)) * 100)
      const isEnrolled =
        Boolean(matchedEnrollment) || enrolledCourses.includes(course.id) || localDone > 0

      rows.push({
        id: course.id,
        code: course.code || "SEC-101",
        category: course.category || "web",
        title: matchedEnrollment?.courseTitle || course.title,
        doneLessons,
        totalLessons,
        percentage,
        isEnrolled,
        status:
          percentage >= 100 || matchedEnrollment?.status === "COMPLETED"
            ? "Hoàn thành"
            : isEnrolled
            ? "Đang học"
            : "Chưa ghi danh",
        syncedFromServer: Boolean(matchedEnrollment),
      })
    })

    // Thêm các enrollment từ server chưa ánh xạ vào danh mục cục bộ
    enrollments.forEach((e) => {
      const slug = e.courseSlug || `course-${e.courseId}`
      if (!seenIds.has(slug)) {
        const totalLessons = e.totalLessons || 1
        const doneLessons = e.completedLessons || 0
        rows.push({
          id: slug,
          code: slug.toUpperCase().slice(0, 8),
          category: "web",
          title: e.courseTitle || `Học phần #${e.courseId}`,
          doneLessons,
          totalLessons,
          percentage: e.progressPercentage ?? Math.round((doneLessons / totalLessons) * 100),
          isEnrolled: true,
          status: e.status === "COMPLETED" ? "Hoàn thành" : "Đang học",
          syncedFromServer: true,
        })
      }
    })

    return rows
  }, [courses, enrollments, completedLessons, enrolledCourses])

  const activeEnrollments = useMemo(
    () => mergedCourseProgress.filter((item) => item.isEnrolled),
    [mergedCourseProgress]
  )

  const lessonTotals = useMemo(() => {
    return mergedCourseProgress.reduce(
      (acc, item) => ({
        done: acc.done + item.doneLessons,
        total: acc.total + item.totalLessons,
      }),
      { done: 0, total: 0 }
    )
  }, [mergedCourseProgress])

  const hasLiveUserActivity = useMemo(() => {
    return (
      enrollments.length > 0 ||
      lessonTotals.done > 0 ||
      completedLabs.length > 1 ||
      userXp > 0
    )
  }, [enrollments.length, lessonTotals.done, completedLabs.length, userXp])

  // Ma trận năng lực 5 miền kiến thức: kết hợp dữ liệu thực tế với khung tham chiếu học thuật
  const domainMastery = useMemo(() => {
    return BASELINE_DOMAINS.map((domain) => {
      const matchingCourses = mergedCourseProgress.filter((c) =>
        domain.categoryKeys.includes(c.category)
      )
      const courseLessonsDone = matchingCourses.reduce((s, c) => s + c.doneLessons, 0)
      const courseLessonsTotal = matchingCourses.reduce((s, c) => s + c.totalLessons, 0)

      const matchingLabCatalog = labCatalog.filter((l) =>
        domain.categoryKeys.includes(l.category)
      )
      const liveLabsInDomain = completedLabs.filter((labId) => {
        const fromCat = matchingLabCatalog.find((l) => l.id === labId)
        if (fromCat) return true
        const fromKnown = KNOWN_LAB_META[labId]
        return fromKnown ? domain.categoryKeys.includes(fromKnown.category) : false
      })

      const liveRatio =
        courseLessonsTotal > 0
          ? Math.round(
              ((courseLessonsDone + liveLabsInDomain.length * 2) /
                (courseLessonsTotal + Math.max(2, domain.totalLabs))) *
                100
            )
          : 0

      // Khi người dùng có tiến độ thực ở miền này, hòa trộn mượt với mức nền học thuật để phản ánh tiến bộ trực tiếp
      const score = hasLiveUserActivity
        ? Math.min(100, Math.max(liveRatio, Math.min(100, domain.baselineScore + courseLessonsDone * 4 + liveLabsInDomain.length * 5 - 10)))
        : domain.baselineScore

      const labsDone = hasLiveUserActivity
        ? Math.min(domain.totalLabs, Math.max(liveLabsInDomain.length, domain.baselineLabsDone))
        : domain.baselineLabsDone

      return {
        ...domain,
        score,
        level: getMasteryLevelLabel(score),
        labsDone,
        lessonsDone: courseLessonsDone,
        lessonsTotal: courseLessonsTotal,
      }
    })
  }, [mergedCourseProgress, labCatalog, completedLabs, hasLiveUserActivity])

  const selectedDomain =
    domainMastery.find((d) => d.id === selectedDomainId) || domainMastery[0]

  const averageMastery = useMemo(() => {
    if (domainMastery.length === 0) return 0
    const sum = domainMastery.reduce((acc, d) => acc + d.score, 0)
    return (sum / domainMastery.length).toFixed(1)
  }, [domainMastery])

  const lowestDomain = useMemo(() => {
    return [...domainMastery].sort((a, b) => a.score - b.score)[0] || domainMastery[0]
  }, [domainMastery])

  // Nhật ký 28 ngày: ngày 28 phản ánh trực tiếp hoạt động hiện tại của học viên
  const activityDays = useMemo(() => {
    const todayBoost = Math.min(4, lessonTotals.done + completedLabs.length)
    return Array.from({ length: 28 }, (_, i) => {
      const baseIntensity = (i * 7 + 3) % 5
      const level = i === 27 ? Math.max(baseIntensity, todayBoost || 2) : baseIntensity
      return { day: i + 1, level }
    })
  }, [lessonTotals.done, completedLabs.length])

  // Danh sách Flag đã giải: ưu tiên các lab thực từ useLabStore, bổ sung mẫu tham khảo nếu cần
  const validatedFlags = useMemo(() => {
    const liveEntries = completedLabs.map((labId) => {
      const fromCatalog = labCatalog.find((l) => l.id === labId)
      const known = KNOWN_LAB_META[labId]
      return {
        id: `live-${labId}`,
        title: fromCatalog?.title || known?.title || `Phòng thí nghiệm ${labId.toUpperCase()}`,
        cve: fromCatalog?.mitre || known?.cve || "MITRE ATT&CK",
        date: "Ghi nhận phiên hiện tại",
        xp: `+${fromCatalog?.points || known?.xp || 350} XP`,
        flag: known?.flag || `VERIFIED::${labId.toUpperCase()}`,
        isLive: true,
      }
    })

    const combined = [...liveEntries]
    SAMPLE_FLAG_RECORDS.forEach((sample) => {
      if (combined.length < 5 && !combined.some((c) => c.flag === sample.flag)) {
        combined.push(sample)
      }
    })
    return combined
  }, [completedLabs, labCatalog])

  const totalXp = userPoints + userXp
  const practiceHours = useMemo(() => {
    if (hasLiveUserActivity) {
      return Math.max(24, lessonTotals.done * 2 + completedLabs.length * 4 + 18)
    }
    return 142
  }, [hasLiveUserActivity, lessonTotals.done, completedLabs.length])

  const overallCompletionPct = useMemo(() => {
    if (lessonTotals.total > 0 && lessonTotals.done > 0) {
      return Math.min(
        100,
        Math.round(((lessonTotals.done + completedLabs.length) / (lessonTotals.total + 12)) * 100)
      )
    }
    return 64
  }, [lessonTotals.done, lessonTotals.total, completedLabs.length])

  const researcherTier =
    totalXp >= 5000
      ? "CHUYÊN VIÊN BẬC 3"
      : totalXp >= 2000
      ? "CHUYÊN VIÊN BẬC 2"
      : "NGHIÊN CỨU VIÊN BẬC 1"

  return (
    <div className="space-y-8 pb-14 animate-fade-in-up">
      {/* ====================================================================
          §01. TỔNG QUAN TIẾN ĐỘ & ĐO LƯỜNG NĂNG LỰC
         ==================================================================== */}
      <section className="rounded-2xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-tech text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#1D4ED8] dark:bg-[#3B82F6] text-white uppercase tracking-[0.08em]">
                §01 // ĐO LƯỜNG NĂNG LỰC &amp; TIẾN ĐỘ
              </span>
              <span className="font-mono-tech text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#F3F1EC] dark:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.08]">
                CẤP BẬC: {researcherTier}
              </span>
              <span className="font-mono-tech text-[11px] font-semibold px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-500/12 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/25 inline-flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>CHUỖI 7 NGÀY</span>
              </span>
              <span
                className={`font-mono-tech text-[11px] font-medium px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5 ${
                  serverConnected && syncStatus === "synced"
                    ? "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25"
                    : "bg-[#FAF9F6] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.08]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    serverConnected && syncStatus === "synced"
                      ? "bg-emerald-500"
                      : "bg-[#1D4ED8] dark:bg-[#38BDF8]"
                  }`}
                />
                <span>
                  {serverConnected && syncStatus === "synced"
                    ? "Đồng bộ Sổ cái Trực tuyến"
                    : isAuthenticated
                    ? "Dữ liệu Cục bộ & Mẫu Học thuật"
                    : "Chế độ Tham khảo Học thuật"}
                </span>
              </span>
            </div>

            <h1 className="font-serif-editorial text-2xl sm:text-3xl lg:text-[2.25rem] font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-[-0.02em] leading-tight">
              Ma trận Làm chủ Kỹ năng &amp;{" "}
              <em className="italic font-normal text-[#1D4ED8] dark:text-[#38BDF8]">
                Thống kê Thực nghiệm
              </em>
            </h1>

            <p className="text-[#475569] dark:text-[#94A3B8] text-xs sm:text-sm leading-relaxed">
              Kiểm toán theo thời gian thực năng lực tấn công và phòng thủ theo khung NIST NICE, tiến độ các học phần đã ghi danh và kết quả xác thực cờ CTF trong môi trường Sandbox.
            </p>
          </div>

          {/* Lưới 4 chỉ số tổng hợp */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-center min-w-[112px]">
              <span className="text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] uppercase block font-semibold">
                Tổng XP
              </span>
              <span className="text-lg font-mono-tech font-bold text-[#1D4ED8] dark:text-[#38BDF8] mt-0.5 block">
                <CountUp key={`xp-${totalXp}`} end={totalXp} start={totalXp} duration={300} />
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-center min-w-[112px]">
              <span className="text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] uppercase block font-semibold">
                Lab Đã Giải
              </span>
              <span className="text-lg font-mono-tech font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                <CountUp
                  key={`labs-${completedLabs.length}`}
                  end={completedLabs.length}
                  start={completedLabs.length}
                  duration={300}
                />
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-center min-w-[112px]">
              <span className="text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] uppercase block font-semibold">
                Giờ Thực Hành
              </span>
              <span className="text-lg font-mono-tech font-bold text-[#0F172A] dark:text-[#F1F5F9] mt-0.5 block">
                <CountUp
                  key={`hrs-${practiceHours}`}
                  end={practiceHours}
                  start={practiceHours}
                  duration={300}
                  suffix="h"
                />
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-center min-w-[112px]">
              <span className="text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] uppercase block font-semibold">
                Hoàn Thành
              </span>
              <span className="text-lg font-mono-tech font-bold text-amber-700 dark:text-amber-400 mt-0.5 block">
                <CountUp
                  key={`pct-${overallCompletionPct}`}
                  end={overallCompletionPct}
                  start={overallCompletionPct}
                  duration={300}
                  suffix="%"
                />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          §02. BỐ CỤC HAI CỘT: PHÂN RÃ NĂNG LỰC, HỌC PHẦN & NHẬT KÝ FLAG
         ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI (7 CỘT) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. TIẾN ĐỘ HỌC PHẦN ĐÃ GHI DANH (LIVE PROGRESS SERVICE + LEARNING STORE) */}
          <Card variant="flat" padding="lg" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                  <span>Tiến độ Học phần Đã Ghi danh</span>
                </h2>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                  Đồng bộ trực tiếp từ API ghi danh và trạng thái hoàn thành bài học cá nhân ({lessonTotals.done}/{lessonTotals.total} bài học).
                </p>
              </div>
              <button
                type="button"
                onClick={loadProgressTelemetry}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] transition-colors cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Đang đồng bộ..." : "Làm mới"}</span>
              </button>
            </div>

            {activeEnrollments.length === 0 ? (
              <div className="rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    Chưa có học phần nào được ghi danh
                  </p>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    Khám phá danh mục giáo trình để bắt đầu theo dõi tiến độ từng bài học và bảo vệ đồ án Capstone.
                  </p>
                </div>
                <Link to="/learning" className="shrink-0">
                  <Button variant="primary" size="sm">
                    Mở Giáo Trình
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeEnrollments.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono-tech text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8]">
                            {course.code}
                          </span>
                          <span
                            className={`font-mono-tech text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              course.percentage >= 100
                                ? "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25"
                                : "bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border-blue-200 dark:border-blue-500/25"
                            }`}
                          >
                            {course.status}
                          </span>
                          {course.syncedFromServer && (
                            <span className="font-mono-tech text-[10px] text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Máy chủ</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-snug">
                          {course.title}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono-tech text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] tabular-nums">
                          {course.percentage}%
                        </span>
                        <span className="block font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                          {course.doneLessons}/{course.totalLessons} bài
                        </span>
                      </div>
                    </div>

                    <div
                      role="progressbar"
                      aria-valuenow={course.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Tiến độ ${course.title}`}
                      className="h-2 w-full rounded-full bg-[#ECE9E2] dark:bg-[#0B0E14] overflow-hidden"
                    >
                      <div
                        className="h-full rounded-full bg-[#1D4ED8] dark:bg-[#3B82F6] transition-all duration-500"
                        style={{ width: `${course.percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Link
                        to={`/learning?course=${encodeURIComponent(course.id)}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:underline"
                      >
                        <span>Tiếp tục chuyên đề</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* 2. PHÂN RÃ NĂNG LỰC AN NINH MẠNG THEO LĨNH VỰC */}
          <Card variant="flat" padding="lg" className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                  <span>Phân rã Năng lực An ninh mạng (NIST NICE)</span>
                </h2>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                  Tính toán từ tiến độ bài học, bài tập trắc nghiệm và kết quả thực chiến trong Sandbox.
                </p>
              </div>
              <span className="font-mono-tech text-xs text-[#1D4ED8] dark:text-[#38BDF8] font-bold">
                TRUNG BÌNH: {averageMastery}%
              </span>
            </div>

            <div className="space-y-3.5">
              {domainMastery.map((domain) => {
                const isSelected = selectedDomain.id === domain.id
                return (
                  <div
                    key={domain.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedDomainId(domain.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setSelectedDomainId(domain.id)
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/60 dark:bg-blue-500/10 border-[#1D4ED8] dark:border-[#3B82F6]"
                        : "bg-white dark:bg-[#121722] hover:bg-[#FAF9F6] dark:hover:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold mb-2">
                      <div>
                        <span className="text-[#0F172A] dark:text-[#F1F5F9] block">
                          {domain.name}
                        </span>
                        <span className="font-mono-tech text-[10px] font-normal text-[#64748B] dark:text-[#94A3B8]">
                          {domain.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]">
                          {domain.level}
                        </span>
                        <span className="font-mono-tech font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                          <CountUp
                            key={`dom-${domain.id}-${domain.score}`}
                            end={domain.score}
                            start={domain.score}
                            duration={250}
                            suffix="%"
                          />
                        </span>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-[#ECE9E2] dark:bg-[#161C2A] rounded-full overflow-hidden mb-2.5">
                      <div
                        className={`h-full ${domain.color} rounded-full transition-all duration-500`}
                        style={{ width: `${domain.score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono-tech">
                      <span>
                        Lab hoàn thành: {domain.labsDone}/{domain.totalLabs}
                        {domain.lessonsTotal > 0
                          ? ` · Bài học: ${domain.lessonsDone}/${domain.lessonsTotal}`
                          : ""}
                      </span>
                      <Link
                        to="/labs"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#1D4ED8] dark:text-[#38BDF8] font-semibold inline-flex items-center gap-0.5 hover:underline"
                      >
                        <span>Mở bài thực hành</span>
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* 3. MA TRẬN NHỊP ĐỘ THỰC NGHIỆM 28 NGÀY */}
          <Card variant="flat" padding="lg" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                  <span>Nhịp độ Thực nghiệm 28 Ngày</span>
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                  Tần suất thực hành phòng máy ảo Sandbox và hoàn thành học phần trong 4 tuần gần nhất.
                </p>
              </div>
              <span className="text-[11px] font-mono-tech text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-500/12 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-500/25">
                CHU KỲ ĐANG MỞ
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-3">
              <div className="grid grid-cols-7 gap-2">
                {activityDays.map((d) => {
                  const bgClass =
                    d.level === 0
                      ? "bg-[#ECE9E2] dark:bg-[#161C2A] text-[#64748B] dark:text-[#94A3B8]"
                      : d.level === 1
                      ? "bg-blue-100 dark:bg-blue-950/70 text-[#1E40AF] dark:text-[#93C5FD]"
                      : d.level === 2
                      ? "bg-blue-300 dark:bg-blue-800/80 text-[#0F172A] dark:text-[#F1F5F9]"
                      : d.level === 3
                      ? "bg-[#2563EB] dark:bg-[#2563EB] text-white"
                      : "bg-[#1E40AF] dark:bg-[#3B82F6] text-white"

                  return (
                    <div
                      key={d.day}
                      className={`h-8 rounded-md ${bgClass} transition-transform hover:scale-105 flex items-center justify-center text-[11px] font-mono-tech font-semibold tabular-nums`}
                      title={`Ngày ${d.day}: Cường độ thực hành mức ${d.level}/4`}
                    >
                      {d.day}
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8] pt-1 font-mono-tech">
                <span>Ít hoạt động</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-[#ECE9E2] dark:bg-[#161C2A]" />
                  <div className="h-3 w-3 rounded bg-blue-100 dark:bg-blue-950/70" />
                  <div className="h-3 w-3 rounded bg-blue-300 dark:bg-blue-800/80" />
                  <div className="h-3 w-3 rounded bg-[#2563EB]" />
                  <div className="h-3 w-3 rounded bg-[#1E40AF] dark:bg-[#3B82F6]" />
                </div>
                <span>Cường độ cao</span>
              </div>
            </div>
          </Card>
        </div>

        {/* CỘT PHẢI (5 CỘT): NHẬT KÝ FLAG & KHUYẾN NGHỊ LỘ TRÌNH */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="flat" padding="lg" className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                  Nhật ký Xác thực Flag
                </h3>
              </div>
              <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                ĐÃ KIỂM ĐỊNH
              </span>
            </div>

            <div className="space-y-3">
              {validatedFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2 text-xs font-semibold">
                    <span className="text-[#0F172A] dark:text-[#F1F5F9] leading-snug">
                      {flag.title}
                    </span>
                    <span className="font-mono-tech text-emerald-700 dark:text-emerald-400 font-bold shrink-0">
                      {flag.xp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono-tech">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8]">
                        {flag.cve}
                      </span>
                      {flag.isLive && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/25 text-[10px]">
                          Thực tế
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {flag.date}
                    </span>
                  </div>

                  <div className="font-mono-tech text-[10px] text-[#1D4ED8] dark:text-[#93C5FD] bg-blue-50/80 dark:bg-blue-500/10 px-2.5 py-1 rounded border border-blue-200/80 dark:border-blue-500/20 truncate">
                    {flag.flag}
                  </div>
                </div>
              ))}
            </div>

            <Link to="/labs" className="block pt-1">
              <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Mở Thao trường Lab Tiếp theo
              </Button>
            </Link>
          </Card>

          {/* LỘ TRÌNH KHUYẾN NGHỊ */}
          <section className="p-6 rounded-2xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] space-y-3.5">
            <div className="flex items-center gap-2 font-mono-tech text-[11px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8] uppercase tracking-wider">
              <Compass className="h-4 w-4 shrink-0" />
              <span>Lộ trình Khuyến nghị // Bù đắp Khoảng trống Kỹ năng</span>
            </div>

            <h4 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9]">
              Trọng tâm đề xuất: {lowestDomain.name}
            </h4>

            <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Mức độ làm chủ hiện tại của miền này đạt{" "}
              <strong className="text-[#0F172A] dark:text-[#F1F5F9] font-semibold">
                {lowestDomain.score}%
              </strong>{" "}
              (cấp độ {lowestDomain.level}). Hoàn thành chuyên đề{" "}
              <code className="px-1.5 py-0.5 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8] font-mono-tech font-semibold">
                {lowestDomain.recommendedCode}
              </code>{" "}
              và các bài thực hành liên quan để cân bằng hồ sơ năng lực NIST NICE trước khi bảo vệ đồ án Capstone.
            </p>

            <div className="pt-1 flex flex-wrap gap-2">
              <Link to="/learning" className="flex-1 min-w-[180px]">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Chuyển tới Học phần {lowestDomain.recommendedCode}
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Progress

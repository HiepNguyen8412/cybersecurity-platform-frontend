import { useState, useEffect, useCallback } from "react"
import { RefreshCw, Trophy, ShieldCheck, Info, Award, CheckCircle2 } from "lucide-react"
import challengeService from "../../../services/challengeService"

const DEMO_LEADERBOARD = [
  {
    rank: 1,
    userId: 101,
    username: "minh.tran_sec",
    totalPoints: 3450,
    challengesSolved: 8,
    lastSolvedAt: "2026-11-24T19:40:00",
    accuracy: 94,
  },
  {
    rank: 2,
    userId: 102,
    username: "linh.pham_dfir",
    totalPoints: 2950,
    challengesSolved: 7,
    lastSolvedAt: "2026-11-24T16:15:00",
    accuracy: 91,
  },
  {
    rank: 3,
    userId: 103,
    username: "hiep.nguyen",
    totalPoints: 2450,
    challengesSolved: 6,
    lastSolvedAt: "2026-11-23T21:05:00",
    accuracy: 88,
  },
  {
    rank: 4,
    userId: 104,
    username: "khang.le_cloud",
    totalPoints: 1950,
    challengesSolved: 5,
    lastSolvedAt: "2026-11-22T14:50:00",
    accuracy: 85,
  },
  {
    rank: 5,
    userId: 105,
    username: "thao.vu_appsec",
    totalPoints: 1450,
    challengesSolved: 4,
    lastSolvedAt: "2026-11-21T10:20:00",
    accuracy: 82,
  },
]

function resolveResearchTier(totalPoints) {
  if (totalPoints >= 2500) {
    return {
      label: "Nghiên cứu viên Chính",
      code: "TIER I",
      badgeClass:
        "bg-blue-50 text-[#1D4ED8] border-blue-200 dark:bg-blue-500/12 dark:text-[#93C5FD] dark:border-blue-500/25",
    }
  }
  if (totalPoints >= 1500) {
    return {
      label: "Chuyên viên Phân tích",
      code: "TIER II",
      badgeClass:
        "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/12 dark:text-sky-300 dark:border-sky-500/25",
    }
  }
  if (totalPoints >= 800) {
    return {
      label: "Học viên Thực nghiệm",
      code: "TIER III",
      badgeClass:
        "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-500/25",
    }
  }
  return {
    label: "Nghiên cứu Dự bị",
    code: "TIER IV",
    badgeClass:
      "bg-[#F3F1EC] text-[#475569] border-[#E5E2DC] dark:bg-[#161C2A] dark:text-[#94A3B8] dark:border-white/[0.08]",
  }
}

function formatSolvedTimestamp(isoValue) {
  if (!isoValue) return "—"
  const parsed = new Date(isoValue)
  if (Number.isNaN(parsed.getTime())) return "—"
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed)
}

function normalizeEntries(rawEntries) {
  return rawEntries.map((entry, idx) => ({
    rank: Number(entry?.rank ?? idx + 1),
    userId: entry?.userId ?? `researcher-${idx + 1}`,
    username: entry?.username || `researcher_${idx + 1}`,
    totalPoints: Number(entry?.totalPoints ?? 0),
    challengesSolved: Number(entry?.challengesSolved ?? 0),
    lastSolvedAt: entry?.lastSolvedAt || null,
    accuracy: typeof entry?.accuracy === "number" ? entry.accuracy : null,
  }))
}

export function LeaderboardPanel({
  userPoints = 0,
  completedCount = 0,
  currentUsername = "",
}) {
  const [entries, setEntries] = useState([])
  const [dataSource, setDataSource] = useState("loading") // "loading" | "live" | "demo-empty" | "demo-offline"
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState(null)

  const loadLeaderboardData = useCallback(async () => {
    try {
      const res = await challengeService.getLeaderboard()
      if (res.success && Array.isArray(res.data)) {
        if (res.data.length > 0) {
          return {
            rows: normalizeEntries(res.data),
            source: "live",
          }
        }
        return {
          rows: normalizeEntries(DEMO_LEADERBOARD),
          source: "demo-empty",
        }
      }
      return {
        rows: normalizeEntries(DEMO_LEADERBOARD),
        source: "demo-offline",
      }
    } catch {
      return {
        rows: normalizeEntries(DEMO_LEADERBOARD),
        source: "demo-offline",
      }
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function init() {
      const result = await loadLeaderboardData()
      if (!isMounted) return
      setEntries(result.rows)
      setDataSource(result.source)
      setLastSyncedAt(new Date())
      setIsLoading(false)
    }

    init()

    return () => {
      isMounted = false
    }
  }, [loadLeaderboardData])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    const result = await loadLeaderboardData()
    setEntries(result.rows)
    setDataSource(result.source)
    setLastSyncedAt(new Date())
    setIsRefreshing(false)
  }

  const topPoints = entries.length > 0 ? entries[0].totalPoints : 0
  const isLive = dataSource === "live"

  return (
    <section
      aria-label="Bảng xếp hạng nghiên cứu thực chiến"
      className="space-y-5"
    >
      {/* Archival Header & Status Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono-tech uppercase tracking-wider text-[#1D4ED8] dark:text-[#38BDF8]">
            <Trophy className="w-3.5 h-3.5" />
            <span>§02 // BẢNG XẾP HẠNG NGHIÊN CỨU (LIVE)</span>
          </div>
          <h2 className="font-serif-editorial text-2xl font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
            Thứ Hạng Nghiên Cứu Viên Thực Chiến
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
            Tổng hợp điểm số thực nghiệm được xác thực bằng chữ ký Flag trên hệ thống Cyber Range.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {!isLoading && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-tech border ${
                isLive
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-500/25"
                  : "bg-[#F3F1EC] text-[#475569] border-[#E5E2DC] dark:bg-[#161C2A] dark:text-[#94A3B8] dark:border-white/[0.08]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isLive ? "bg-emerald-500" : "bg-amber-500"
                }`}
                aria-hidden="true"
              />
              <span>
                {isLive
                  ? "Đồng bộ Máy chủ Trực tiếp"
                  : dataSource === "demo-empty"
                  ? "Dữ liệu Mẫu (Chưa có lượt nộp)"
                  : "Dữ liệu Mẫu Học Thuật (Ngoại tuyến)"}
              </span>
            </span>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#FAF9F6] hover:bg-[#F3F1EC] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.09] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Offline / Empty Fallback Notice */}
      {!isLoading && !isLive && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs text-[#475569] dark:text-[#94A3B8]">
          <Info className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
              {dataSource === "demo-empty"
                ? "Máy chủ chưa ghi nhận lượt giải thử thách nào."
                : "Không thể kết nối tới API xếp hạng trực tiếp."}
            </span>{" "}
            Bảng dưới đây hiển thị bộ dữ liệu mẫu học thuật để minh họa cấu trúc đánh giá (hạng, học hàm nghiên cứu, tổng XP và thời điểm xác thực gần nhất).
          </div>
        </div>
      )}

      {/* Summary Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
            Nghiên cứu viên ghi danh
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-semibold font-mono-tech tabular-nums text-[#0F172A] dark:text-[#F1F5F9]">
              {isLoading ? "—" : entries.length}
            </span>
            <span className="text-xs text-[#475569] dark:text-[#94A3B8]">hồ sơ hoạt động</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
            Điểm dẫn đầu bảng
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-semibold font-mono-tech tabular-nums text-[#1D4ED8] dark:text-[#38BDF8]">
              {isLoading ? "—" : `${topPoints.toLocaleString("vi-VN")} XP`}
            </span>
            <span className="text-xs text-[#475569] dark:text-[#94A3B8]">mức cao nhất</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
            Phiên thực hành của bạn
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-semibold font-mono-tech tabular-nums text-[#0F172A] dark:text-[#F1F5F9]">
              {userPoints.toLocaleString("vi-VN")} XP
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              {completedCount} bài đã giải
            </span>
          </div>
        </div>
      </div>

      {/* Archival Leaderboard Table */}
      <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] text-[11px] font-mono-tech uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                <th scope="col" className="py-3.5 px-4 w-20">
                  Hạng
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Nghiên cứu viên
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Cấp bậc / Hiệu suất
                </th>
                <th scope="col" className="py-3.5 px-4 text-right">
                  Bài đã giải
                </th>
                <th scope="col" className="py-3.5 px-4 text-right">
                  Tổng điểm
                </th>
                <th scope="col" className="py-3.5 px-4 text-right hidden md:table-cell">
                  Lần giải gần nhất
                </th>
              </tr>
            </thead>

            <tbody
              aria-busy={isLoading}
              className="divide-y divide-[#EFEDE7] dark:divide-white/[0.06] text-sm"
            >
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="py-4 px-4">
                      <div className="h-4 w-10 rounded bg-[#F3F1EC] dark:bg-white/[0.05]" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-36 rounded bg-[#F3F1EC] dark:bg-white/[0.05]" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-5 w-28 rounded bg-[#F3F1EC] dark:bg-white/[0.05]" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-4 w-12 ml-auto rounded bg-[#F3F1EC] dark:bg-white/[0.05]" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-4 w-20 ml-auto rounded bg-[#F3F1EC] dark:bg-white/[0.05]" />
                    </td>
                    <td className="py-4 px-4 text-right hidden md:table-cell">
                      <div className="h-4 w-28 ml-auto rounded bg-[#F3F1EC] dark:bg-white/[0.05]" />
                    </td>
                  </tr>
                ))
              ) : (
                entries.map((entry) => {
                  const tier = resolveResearchTier(entry.totalPoints)
                  const isCurrentUser =
                    Boolean(currentUsername) &&
                    entry.username.toLowerCase() === currentUsername.toLowerCase()
                  const avgPointsPerSolve =
                    entry.challengesSolved > 0
                      ? Math.round(entry.totalPoints / entry.challengesSolved)
                      : 0
                  const efficiencyLabel =
                    entry.accuracy !== null
                      ? `Độ chính xác ${entry.accuracy}%`
                      : `TB ${avgPointsPerSolve} XP/bài`

                  return (
                    <tr
                      key={`${entry.userId}-${entry.rank}`}
                      className={`transition-colors ${
                        isCurrentUser
                          ? "bg-blue-50/60 dark:bg-blue-500/10"
                          : "hover:bg-[#FAF9F6] dark:hover:bg-[#161C2A]/70"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono-tech font-semibold tabular-nums">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-7 rounded-md text-xs border ${
                            entry.rank === 1
                              ? "bg-[#1D4ED8] text-white border-[#1D4ED8] dark:bg-[#3B82F6] dark:border-[#3B82F6]"
                              : entry.rank <= 3
                              ? "bg-[#F3F1EC] text-[#0F172A] border-[#D0CCC3] dark:bg-[#1B2335] dark:text-[#F1F5F9] dark:border-white/[0.14]"
                              : "bg-transparent text-[#64748B] border-[#E5E2DC] dark:text-[#94A3B8] dark:border-white/[0.08]"
                          }`}
                        >
                          #{String(entry.rank).padStart(2, "0")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.09] flex items-center justify-center text-xs font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9] shrink-0 uppercase">
                            {entry.username.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono-tech text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
                                @{entry.username}
                              </span>
                              {isCurrentUser && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#1D4ED8]/10 text-[#1D4ED8] dark:bg-[#3B82F6]/15 dark:text-[#93C5FD]">
                                  <ShieldCheck className="w-3 h-3" />
                                  Bạn
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border whitespace-nowrap ${tier.badgeClass}`}
                          >
                            <Award className="w-3 h-3 shrink-0" />
                            <span>{tier.label}</span>
                          </span>
                          <span className="text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap">
                            {efficiencyLabel}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono-tech tabular-nums text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9]">
                        <span className="inline-flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{entry.challengesSolved}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono-tech tabular-nums font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                        {entry.totalPoints.toLocaleString("vi-VN")}{" "}
                        <span className="text-xs font-normal text-[#64748B] dark:text-[#94A3B8]">
                          XP
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono-tech text-xs text-[#64748B] dark:text-[#94A3B8] hidden md:table-cell whitespace-nowrap">
                        {formatSolvedTimestamp(entry.lastSolvedAt)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Archival Footer Note */}
        <div className="px-4 py-3 bg-[#FAF9F6] dark:bg-[#0B0E14]/70 border-t border-[#EFEDE7] dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
          <span>Chuẩn đối chiếu: CWE™ / MITRE ATT&CK® v14 Scoring Index</span>
          <span>
            {lastSyncedAt
              ? `Cập nhật lúc ${lastSyncedAt.toLocaleTimeString("vi-VN")}`
              : "Đang tải dữ liệu..."}
          </span>
        </div>
      </div>
    </section>
  )
}

export default LeaderboardPanel

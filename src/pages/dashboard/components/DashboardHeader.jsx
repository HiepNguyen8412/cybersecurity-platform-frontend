import { Flame, Compass, Award } from "lucide-react"
import { CountUp } from "../../../components/common"

function getGreetingByHour() {
  const hour = new Date().getHours()
  if (hour < 12) return "Chào buổi sáng"
  if (hour < 18) return "Chào buổi chiều"
  return "Chào buổi tối"
}

/**
 * DashboardHeader
 * Tiêu đề chào mừng theo chuẩn Academic Research Atelier (Editorial Light & Deep Obsidian Dark).
 */
export function DashboardHeader({
  userName = "Nghiên cứu viên CyberPath",
  streakDays = 7,
  activePathTitle = "Chuyên viên Phân tích An ninh SOC",
  userPoints = null,
  isLiveSynced = false,
  className = "",
}) {
  const displayName = (userName && userName.trim()) || "Nghiên cứu viên CyberPath"
  const greeting = getGreetingByHour()

  return (
    <header
      className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 pb-2 border-b border-[#EFEDE7] dark:border-white/[0.06] ${className}`.trim()}
      aria-label="Tổng quan không gian học tập"
    >
      {/* Trái: Lời chào học thuật & bối cảnh chương trình */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-mono-tech text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isLiveSynced
                  ? "bg-emerald-600 dark:bg-emerald-400"
                  : "bg-[#1D4ED8] dark:bg-[#38BDF8]"
              }`}
              aria-hidden="true"
            />
            <span>{isLiveSynced ? "ĐỒNG BỘ HỒ SƠ TRỰC TUYẾN" : "HỒ SƠ NGHIÊN CỨU HỌC THUẬT"}</span>
          </span>
          <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            Chuẩn năng lực NIST NICE &amp; MITRE ATT&amp;CK
          </span>
        </div>

        <h1 className="font-serif-editorial text-3xl sm:text-[34px] font-medium tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
          {greeting}, {displayName}
        </h1>

        <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] font-normal leading-relaxed max-w-2xl">
          Không gian tổng hợp tiến độ nghiên cứu, bài thực nghiệm phòng thủ chủ động và hồ sơ năng lực an ninh mạng.
        </p>
      </div>

      {/* Phải: Chỉ số ngữ cảnh nhanh */}
      <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-auto flex-wrap">
        {typeof userPoints === "number" && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] text-xs font-medium select-none shadow-2xs font-mono-tech"
            title={`${userPoints.toLocaleString("vi-VN")} điểm kinh nghiệm thực nghiệm`}
            aria-label={`Tổng điểm tích lũy: ${userPoints} XP`}
          >
            <Award className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" aria-hidden="true" />
            <span>
              <CountUp key={`xp-${userPoints}`} end={userPoints} duration={900} /> XP
            </span>
          </div>
        )}

        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/25 text-amber-900 dark:text-amber-300 text-xs font-medium select-none font-mono-tech"
          title={`${streakDays} ngày nghiên cứu liên tục`}
          aria-label={`Chuỗi ${streakDays} ngày nghiên cứu liên tục`}
        >
          <Flame className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span>
            <CountUp key={`streak-${streakDays}`} end={streakDays} duration={900} /> ngày liên tục
          </span>
        </div>

        <div
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-500/12 border border-blue-200/80 dark:border-blue-500/25 text-[#1D4ED8] dark:text-[#93C5FD] text-xs font-medium select-none font-mono-tech"
          title={`Lộ trình hiện tại: ${activePathTitle}`}
          aria-label={`Lộ trình hiện tại: ${activePathTitle}`}
        >
          <Compass className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="font-semibold truncate max-w-[210px]">{activePathTitle}</span>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader

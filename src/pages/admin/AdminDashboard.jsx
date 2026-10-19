import { useState } from "react"
import {
  Users,
  Server,
  Award,
  AlertTriangle,
  Play,
  RotateCcw,
  Trash2,
  Download,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Activity,
  UserCheck,
  FileText,
  Clock,
  Terminal,
} from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Badge, Button, ProgressBar, CountUp } from "../../components/common"
import {
  ADMIN_STATS,
  LIVE_SANDBOX_CONTAINERS,
  ADMIN_AUDIT_LOGS,
} from "./data/adminMockData"
import useNotificationStore from "../../stores/useNotificationStore"

export default function AdminDashboard() {
  const [containers, setContainers] = useState(LIVE_SANDBOX_CONTAINERS)
  const [drillActive, setDrillActive] = useState(false)
  const [purgedCount, setPurgedCount] = useState(0)

  const handleKillContainer = (id) => {
    setContainers((prev) => prev.filter((c) => c.id !== id))
    useNotificationStore.getState().warning(
      "Đã Hủy Container",
      `Container cô lập ${id} đã được giải phóng an toàn khỏi Kubernetes cluster.`
    )
  }

  const handlePurgeContainers = () => {
    setPurgedCount((p) => p + 4)
    useNotificationStore.getState().success(
      "Dọn Dẹp Hạ Tầng Thành Công",
      "Đã thu hồi 4 container rác và giải phóng 1.8 GB RAM trên cụm Sandbox."
    )
  }

  const handleToggleDrill = () => {
    setDrillActive(!drillActive)
    if (!drillActive) {
      useNotificationStore.getState().error(
        "Kích Hoạt Diễn Tập Red/Blue Khẩn Cấp",
        "Hệ thống đã phát lệnh giả lập APT29 và khóa toàn bộ tài khoản thực tập."
      )
    } else {
      useNotificationStore.getState().info(
        "Kết Thúc Diễn Tập",
        "Hạ tầng đã trở về trạng thái vận hành học tập bình thường."
      )
    }
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      {/* Header */}
      <AdminHeader
        title="Trung Tâm Điều Hành SOC & Giám Sát Tác Chiến"
        subtitle="Quản trị toàn diện học viên, hạ tầng phòng lab đám mây và giám sát an ninh mạng thời gian thực"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={drillActive ? "danger" : "outline"}
              size="sm"
              onClick={handleToggleDrill}
              leftIcon={<Flame className="h-3.5 w-3.5" />}
            >
              {drillActive ? "Dừng Diễn Tập Khẩn Cấp" : "Khởi Động Diễn Tập APT"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePurgeContainers}
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Thu Hồi Container Rác
            </Button>
          </div>
        }
      />

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Users */}
        <Card className="p-4 sm:p-5 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300">
              Tổng Chuyên Viên & Học Viên
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white cyberpunk:text-cyan-50">
              <CountUp end={ADMIN_STATS.totalUsers} duration={1200} />
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +{ADMIN_STATS.activeLearnersToday} trực tuyến hôm nay
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Tài khoản đã kích hoạt và xác thực 2FA
          </p>
        </Card>

        {/* Card 2: Active Sandboxes */}
        <Card className="p-4 sm:p-5 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300">
              Container Sandbox Đang Chạy
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Server className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white cyberpunk:text-cyan-50">
              <CountUp end={containers.length} duration={1000} /> / {ADMIN_STATS.maxSandboxCapacity}
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-cyan-400">
              {Math.round((containers.length / ADMIN_STATS.maxSandboxCapacity) * 100)}% tải
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar
              value={containers.length}
              max={ADMIN_STATS.maxSandboxCapacity}
              variant="primary"
              size="xs"
            />
          </div>
        </Card>

        {/* Card 3: Flag Submissions */}
        <Card className="p-4 sm:p-5 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300">
              Tỉ Lệ Chiếm Cờ (Success Rate)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white cyberpunk:text-cyan-50">
              <CountUp end={ADMIN_STATS.flagSuccessRate} decimals={1} suffix="%" duration={1200} />
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {ADMIN_STATS.flagSubmissionsToday} lượt nộp hôm nay
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Đo lường năng lực giải quyết phòng lab thực tế
          </p>
        </Card>

        {/* Card 4: Security Alert Triage */}
        <Card className="p-4 sm:p-5 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300">
              Sự Cố & Tấn Công Bất Thường
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              <CountUp end={ADMIN_STATS.securityIncidentsDetected} duration={800} />
            </span>
            <Badge variant="danger" size="sm">
              CẦN XỬ LÝ
            </Badge>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Phát hiện dấu hiệu brute-force ngoài sandbox
          </p>
        </Card>
      </div>

      {/* Grid: Live Fleet Monitor & Range Hardware */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Containers Fleet Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 cyberpunk:border-cyan-500/30">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-cyan-400">
                  <Server className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50">
                    Cụm Container Sandbox Đang Hoạt Động ({containers.length})
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Giám sát phân bổ tài nguyên và phiên thực hành cô lập của học viên
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Cụm K8s: Hoạt Động Bình Thường</span>
              </span>
            </div>

            {/* Container List Table */}
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3">MÃ CONTAINER</th>
                    <th className="py-2.5 px-3">HỌC VIÊN</th>
                    <th className="py-2.5 px-3">BÀI LAB</th>
                    <th className="py-2.5 px-3">TÀI NGUYÊN</th>
                    <th className="py-2.5 px-3">THỜI GIAN</th>
                    <th className="py-2.5 px-3 text-right">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                  {containers.map((cnt) => (
                    <tr key={cnt.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-cyan-400">
                        {cnt.id}
                        <div className="text-[10px] text-slate-400 font-normal">{cnt.containerIp}:{cnt.port}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {cnt.user}
                      </td>
                      <td className="py-3 px-3 max-w-[200px] truncate text-slate-600 dark:text-slate-300">
                        {cnt.labTitle}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        CPU {cnt.cpuUsage} &bull; {cnt.memoryUsage}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span className={cnt.status === "expiring_soon" ? "text-amber-500 font-bold" : "text-slate-500 dark:text-slate-400"}>
                          {cnt.runtimeMinutes} / {cnt.maxMinutes}m
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleKillContainer(cnt.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer border border-rose-200 dark:border-rose-900/60"
                          title="Hủy container ngay lập tức"
                        >
                          Hủy
                        </button>
                      </td>
                    </tr>
                  ))}
                  {containers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Không có container nào đang hoạt động.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Range Hardware Telemetry & Critical Alert */}
        <div className="space-y-4">
          {/* Hardware Load */}
          <Card className="p-5 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                RANGE HARDWARE LOAD
              </span>
              <span className="text-xs font-bold font-mono text-emerald-500">
                Uptime {ADMIN_STATS.systemUptime}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                  <span>CPU Tải Cụm K8s</span>
                  <span className="font-bold text-slate-900 dark:text-white">{ADMIN_STATS.cpuLoadPercent}%</span>
                </div>
                <ProgressBar value={ADMIN_STATS.cpuLoadPercent} max={100} variant="primary" size="sm" />
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                  <span>RAM Cấp Phát Sandbox</span>
                  <span className="font-bold text-slate-900 dark:text-white">{ADMIN_STATS.ramUsageGb} / {ADMIN_STATS.totalRamGb} GB</span>
                </div>
                <ProgressBar value={ADMIN_STATS.ramUsageGb} max={ADMIN_STATS.totalRamGb} variant="primary" size="sm" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Băng thông: 142 Mbps</span>
              <span>I/O Lưu trữ: 1,840 IOPS</span>
            </div>
          </Card>

          {/* Quick Telemetry Events */}
          <Card className="p-5 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                SỰ KIỆN KIỂM TOÁN GẦN NHẤT
              </span>
              <span className="text-[11px] font-mono text-cyan-400">NHẬT KÝ SOC</span>
            </div>

            <div className="space-y-2.5">
              {ADMIN_AUDIT_LOGS.slice(0, 3).map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className={
                      log.severity === "CRITICAL"
                        ? "text-rose-500 font-bold"
                        : log.severity === "SUCCESS"
                        ? "text-emerald-500 font-bold"
                        : "text-blue-500 font-bold"
                    }>
                      [{log.eventType}]
                    </span>
                    <span className="text-slate-400">{log.timestamp.split(" ")[1]}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug line-clamp-2">
                    {log.action}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

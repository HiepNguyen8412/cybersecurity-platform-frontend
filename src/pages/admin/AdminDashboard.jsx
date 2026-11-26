import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  Users,
  Server,
  Award,
  AlertTriangle,
  Trash2,
  ShieldAlert,
  RefreshCw,
  Database,
  Cpu,
  ArrowRight,
  Search,
} from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Badge, Button, ProgressBar, CountUp } from "../../components/common"
import {
  ADMIN_STATS,
  LIVE_SANDBOX_CONTAINERS,
  ADMIN_AUDIT_LOGS,
} from "./data/adminMockData"
import adminService from "../../services/adminService"
import useNotificationStore from "../../stores/useNotificationStore"

function formatUptimeMillis(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return ADMIN_STATS.systemUptime
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (days > 0) return `${days} ngày ${hours} giờ`
  if (hours > 0) return `${hours} giờ ${minutes} phút`
  return `${Math.max(1, minutes)} phút`
}

function formatBytesToMb(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return 0
  return Math.round(bytes / (1024 * 1024))
}

function mapCircuitBreakerLabel(state) {
  switch (state) {
    case "CLOSED":
      return "Đóng (Ổn định)"
    case "OPEN":
      return "Mở (Ngắt mạch)"
    case "HALF_OPEN":
      return "Bán mở (Thử lại)"
    default:
      return "Không kích hoạt"
  }
}

function mapAuditItem(item) {
  return {
    id: item.id,
    timestamp: item.createdAt
      ? new Date(item.createdAt).toLocaleString("vi-VN")
      : "Vừa ghi nhận",
    severity:
      item.status === "FAILED"
        ? "CRITICAL"
        : item.status === "WARNING"
          ? "WARN"
          : "SUCCESS",
    eventType: item.action || item.entityType || "KIỂM_TOÁN",
    user: item.adminUsername || "Hệ thống",
    ip: item.ipAddress || "127.0.0.1",
    action: item.details || item.action || "Hoạt động quản trị hệ thống",
  }
}

export function AdminDashboard() {
  const [containers, setContainers] = useState(LIVE_SANDBOX_CONTAINERS)
  const [containerFilter, setContainerFilter] = useState("")
  const [drillActive, setDrillActive] = useState(false)
  const [serverStatus, setServerStatus] = useState(null)
  const [serverMetrics, setServerMetrics] = useState(null)
  const [recentLogs, setRecentLogs] = useState(ADMIN_AUDIT_LOGS.slice(0, 4))
  const [isLiveTelemetry, setIsLiveTelemetry] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchTelemetrySnapshot = useCallback(async () => {
    const [statusRes, metricsRes, logsRes] = await Promise.all([
      adminService.getServerStatus(),
      adminService.getServerMetrics(),
      adminService.getAuditLogs({ size: 4 }),
    ])
    return { statusRes, metricsRes, logsRes }
  }, [])

  const applyTelemetrySnapshot = useCallback(({ statusRes, metricsRes, logsRes }) => {
    const hasLive =
      Boolean(statusRes.success && statusRes.data) ||
      Boolean(metricsRes.success && metricsRes.data)
    setIsLiveTelemetry(hasLive)

    if (statusRes.success && statusRes.data) {
      setServerStatus(statusRes.data)
    }
    if (metricsRes.success && metricsRes.data) {
      setServerMetrics(metricsRes.data)
    }
    if (logsRes.success && logsRes.data) {
      const rawContent = Array.isArray(logsRes.data)
        ? logsRes.data
        : logsRes.data.content || []
      if (rawContent.length > 0) {
        setRecentLogs(rawContent.slice(0, 4).map(mapAuditItem))
      }
    }
  }, [])

  const loadTelemetry = useCallback(async () => {
    setLoading(true)
    try {
      const snapshot = await fetchTelemetrySnapshot()
      applyTelemetrySnapshot(snapshot)
    } catch {
      setIsLiveTelemetry(false)
    } finally {
      setLoading(false)
    }
  }, [fetchTelemetrySnapshot, applyTelemetrySnapshot])

  useEffect(() => {
    let ignore = false
    async function initTelemetry() {
      try {
        const snapshot = await fetchTelemetrySnapshot()
        if (!ignore) applyTelemetrySnapshot(snapshot)
      } catch {
        if (!ignore) setIsLiveTelemetry(false)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    initTelemetry()
    return () => {
      ignore = true
    }
  }, [fetchTelemetrySnapshot, applyTelemetrySnapshot])

  const handleKillContainer = (id) => {
    setContainers((prev) => prev.filter((c) => c.id !== id))
    useNotificationStore.getState().warning(
      "Đã giải phóng Sandbox",
      `Container cô lập ${id} đã được thu hồi an toàn khỏi cụm Kubernetes.`
    )
  }

  const handlePurgeContainers = () => {
    const expiringCount = containers.filter((c) => c.status === "expiring_soon").length
    if (expiringCount > 0) {
      setContainers((prev) => prev.filter((c) => c.status !== "expiring_soon"))
    }
    useNotificationStore.getState().success(
      "Thu hồi tài nguyên hoàn tất",
      expiringCount > 0
        ? `Đã thu hồi ${expiringCount} phiên sắp hết hạn và tối ưu bộ nhớ trên cụm Sandbox.`
        : "Đã kiểm tra cụm Sandbox: không có container nhàn rỗi cần thu hồi."
    )
  }

  const handleToggleDrill = () => {
    const nextState = !drillActive
    setDrillActive(nextState)
    if (nextState) {
      useNotificationStore.getState().error(
        "Kích hoạt diễn tập ứng phó sự cố",
        "Hệ thống đã chuyển sang chế độ giả lập tấn công APT và ghi nhận cảnh báo ưu tiên cao."
      )
    } else {
      useNotificationStore.getState().info(
        "Kết thúc diễn tập",
        "Hạ tầng đã trở về trạng thái vận hành đào tạo tiêu chuẩn."
      )
    }
  }

  const filteredContainers = containers.filter((cnt) => {
    const query = containerFilter.trim().toLowerCase()
    if (!query) return true
    return (
      cnt.id.toLowerCase().includes(query) ||
      cnt.user.toLowerCase().includes(query) ||
      cnt.labTitle.toLowerCase().includes(query) ||
      cnt.containerIp.includes(query)
    )
  })

  const jvmUsedMb = serverMetrics?.jvmMemory
    ? formatBytesToMb(serverMetrics.jvmMemory.usedBytes)
    : ADMIN_STATS.jvmUsedMb
  const jvmMaxMb = serverMetrics?.jvmMemory
    ? formatBytesToMb(serverMetrics.jvmMemory.maxBytes)
    : ADMIN_STATS.jvmMaxMb
  const jvmPercent = serverMetrics?.jvmMemory?.usedPercentage != null
    ? Number(serverMetrics.jvmMemory.usedPercentage.toFixed(1))
    : ADMIN_STATS.jvmHeapPercent

  const dbActive = serverMetrics?.dbConnectionPool?.activeConnections ?? ADMIN_STATS.dbActiveConnections
  const dbMax = serverMetrics?.dbConnectionPool?.maxPoolSize || ADMIN_STATS.dbMaxPoolSize
  const dbThreads = serverMetrics?.threads?.liveThreadCount ?? 28
  const cpuCores = serverMetrics?.system?.availableProcessors ?? 8
  const loadAverage = serverMetrics?.system?.systemLoadAverage

  const uptimeDisplay = serverStatus?.uptimeMillis
    ? formatUptimeMillis(serverStatus.uptimeMillis)
    : ADMIN_STATS.systemUptime

  const headerStatusLabel = drillActive
    ? "CHẾ ĐỘ DIỄN TẬP SỰ CỐ ĐANG BẬT"
    : serverStatus?.status === "DEGRADED"
      ? "HỆ THỐNG SUY GIẢM HIỆU NĂNG"
      : isLiveTelemetry
        ? "KẾT NỐI MÁY CHỦ TRỰC TIẾP"
        : "CHẾ ĐỘ MẪU NGOẠI TUYẾN"

  const headerStatusTone = drillActive || serverStatus?.status === "DEGRADED"
    ? "degraded"
    : isLiveTelemetry
      ? "operational"
      : "sample"

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      <AdminHeader
        title="Trung tâm Điều hành SOC & Giám sát Hạ tầng"
        subtitle="Theo dõi sức khỏe máy chủ, mật độ Sandbox cô lập, kết quả nộp cờ và các sự kiện kiểm toán bảo mật."
        statusLabel={headerStatusLabel}
        statusTone={headerStatusTone}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={loadTelemetry}
              disabled={loading}
              leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />}
            >
              Đồng bộ dữ liệu
            </Button>
            <Button
              variant={drillActive ? "danger" : "outline"}
              size="sm"
              onClick={handleToggleDrill}
              leftIcon={<ShieldAlert className="h-3.5 w-3.5" />}
            >
              {drillActive ? "Dừng diễn tập APT" : "Khởi động diễn tập"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePurgeContainers}
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Thu hồi Sandbox nhàn rỗi
            </Button>
          </div>
        }
      />

      {/* 4 Chỉ số tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="flat" className="p-4 sm:p-5 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
              Tổng học viên & chuyên viên
            </span>
            <div className="p-2 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
              <Users className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold font-mono-tech text-[#0F172A] dark:text-[#F1F5F9]">
              <CountUp end={ADMIN_STATS.totalUsers} duration={900} />
            </span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              +{ADMIN_STATS.activeLearnersToday} hoạt động hôm nay
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            Tài khoản đã xác thực hồ sơ học thuật
          </p>
        </Card>

        <Card variant="flat" className="p-4 sm:p-5 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
              Sandbox đang vận hành
            </span>
            <div className="p-2 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#3B82F6] border border-[#E5E2DC] dark:border-white/[0.08]">
              <Server className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold font-mono-tech text-[#0F172A] dark:text-[#F1F5F9]">
              <CountUp end={containers.length} duration={800} /> / {ADMIN_STATS.maxSandboxCapacity}
            </span>
            <span className="text-xs font-medium font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8]">
              {Math.round((containers.length / ADMIN_STATS.maxSandboxCapacity) * 100)}% công suất
            </span>
          </div>
          <div className="mt-2.5">
            <ProgressBar
              value={containers.length}
              max={ADMIN_STATS.maxSandboxCapacity}
              variant="primary"
              size="sm"
            />
          </div>
        </Card>

        <Card variant="flat" className="p-4 sm:p-5 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
              Tỷ lệ nghiệm thu cờ CTF
            </span>
            <div className="p-2 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] text-emerald-700 dark:text-emerald-400 border border-[#E5E2DC] dark:border-white/[0.08]">
              <Award className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold font-mono-tech text-[#0F172A] dark:text-[#F1F5F9]">
              <CountUp end={ADMIN_STATS.flagSuccessRate} decimals={1} suffix="%" duration={900} />
            </span>
            <span className="text-xs text-[#475569] dark:text-[#94A3B8]">
              {ADMIN_STATS.flagSubmissionsToday} lượt nộp hôm nay
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            Độ chính xác trung bình trên toàn bộ phòng Lab
          </p>
        </Card>

        <Card variant="flat" className="p-4 sm:p-5 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
              Cảnh báo an ninh cần xử lý
            </span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/12 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/25">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-2xl font-bold font-mono-tech text-rose-600 dark:text-rose-400">
              <CountUp end={ADMIN_STATS.securityIncidentsDetected} duration={700} />
            </span>
            <Badge variant="danger" size="sm" dot>
              Ưu tiên cao
            </Badge>
          </div>
          <p className="mt-1.5 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            Phát hiện lưu lượng dò quét ngoài phạm vi Sandbox
          </p>
        </Card>
      </div>

      {/* Lưới chính: Bảng Container & Telemetry máy chủ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Cột trái 2/3: Bảng cụm Container Sandbox */}
        <div className="lg:col-span-2">
          <Card variant="flat" padding="none" className="bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="p-5 border-b border-[#E5E2DC] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
                  <Server className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    Phiên Container Sandbox đang hoạt động ({filteredContainers.length})
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    Giám sát tài nguyên cấp phát và thời lượng cô lập theo từng học viên
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748B]" aria-hidden="true" />
                  <input
                    id="dashboard-container-search"
                    name="dashboardContainerSearch"
                    type="text"
                    aria-label="Lọc container theo mã, học viên hoặc bài lab"
                    placeholder="Lọc mã, học viên, IP..."
                    value={containerFilter}
                    onChange={(e) => setContainerFilter(e.target.value)}
                    className="w-full sm:w-48 pl-8 pr-3 py-1.5 rounded-lg text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8] font-mono-tech text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Mã phiên</th>
                    <th className="py-3 px-4">Học viên</th>
                    <th className="py-3 px-4">Bài thực hành</th>
                    <th className="py-3 px-4">Tài nguyên</th>
                    <th className="py-3 px-4">Thời lượng</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEDE7] dark:divide-white/[0.06]">
                  {filteredContainers.map((cnt) => (
                    <tr
                      key={cnt.id}
                      className="hover:bg-[#FAF9F6] dark:hover:bg-[#161C2A]/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono-tech whitespace-nowrap">
                        <div className="flex items-center gap-2 font-semibold text-[#1D4ED8] dark:text-[#38BDF8]">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              cnt.status === "expiring_soon" ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            aria-hidden="true"
                          />
                          <span>{cnt.id}</span>
                        </div>
                        <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                          {cnt.containerIp}:{cnt.port}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#0F172A] dark:text-[#F1F5F9] whitespace-nowrap">
                        {cnt.user}
                      </td>
                      <td className="py-3.5 px-4 max-w-[220px] truncate text-[#475569] dark:text-[#94A3B8]" title={cnt.labTitle}>
                        {cnt.labTitle}
                      </td>
                      <td className="py-3.5 px-4 font-mono-tech text-[11px] text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                        CPU {cnt.cpuUsage} &middot; {cnt.memoryUsage}
                      </td>
                      <td className="py-3.5 px-4 font-mono-tech text-[11px] whitespace-nowrap">
                        <span
                          className={
                            cnt.status === "expiring_soon"
                              ? "text-amber-700 dark:text-amber-400 font-semibold"
                              : "text-[#475569] dark:text-[#94A3B8]"
                          }
                        >
                          {cnt.runtimeMinutes} / {cnt.maxMinutes} phút
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleKillContainer(cnt.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/12 border border-rose-200 dark:border-rose-500/25 transition-colors cursor-pointer"
                          title="Giải phóng container ngay lập tức"
                        >
                          Hủy phiên
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredContainers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#64748B] dark:text-[#94A3B8]">
                        Không có phiên Sandbox nào khớp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Cột phải 1/3: Tài nguyên máy chủ JVM/DB & Nhật ký gần nhất */}
        <div className="space-y-4">
          <Card variant="flat" className="p-5 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" aria-hidden="true" />
                <span className="text-xs font-semibold font-mono-tech text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider">
                  Tài nguyên máy chủ
                </span>
              </div>
              <Badge variant={isLiveTelemetry ? "success" : "secondary"} size="sm" dot>
                {isLiveTelemetry ? "Trực tiếp" : "Mẫu cục bộ"}
              </Badge>
            </div>

            <div className="space-y-3.5 font-mono-tech text-xs">
              <div>
                <div className="flex justify-between text-[#475569] dark:text-[#94A3B8] mb-1.5">
                  <span>Bộ nhớ JVM Heap</span>
                  <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    {jvmUsedMb} / {jvmMaxMb} MB ({jvmPercent}%)
                  </span>
                </div>
                <ProgressBar value={jvmPercent} max={100} variant="primary" size="sm" />
              </div>

              <div>
                <div className="flex justify-between text-[#475569] dark:text-[#94A3B8] mb-1.5">
                  <span>Kết nối CSDL (HikariCP)</span>
                  <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    {dbActive} / {dbMax} phiên
                  </span>
                </div>
                <ProgressBar value={dbActive} max={dbMax} variant="indigo" size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#EFEDE7] dark:border-white/[0.06]">
                  <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] uppercase">
                    Thời gian hoạt động
                  </div>
                  <div className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mt-0.5">
                    {uptimeDisplay}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#EFEDE7] dark:border-white/[0.06]">
                  <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] uppercase">
                    Mạch bảo vệ Redis
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {serverStatus
                      ? mapCircuitBreakerLabel(serverStatus.redisCircuitBreakerState)
                      : "Đóng (Ổn định)"}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E2DC] dark:border-white/[0.08] text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-1">
                <Database className="h-3 w-3" aria-hidden="true" />
                {cpuCores} vCPU &middot; {dbThreads} luồng
              </span>
              <span>
                Tải HT: {typeof loadAverage === "number" && loadAverage >= 0 ? loadAverage.toFixed(2) : `${ADMIN_STATS.cpuLoadPercent}%`}
              </span>
            </div>
          </Card>

          <Card variant="flat" className="p-5 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
              <span className="text-xs font-semibold font-mono-tech text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider">
                Sự kiện kiểm toán mới nhất
              </span>
              <Link
                to="/admin/audit-logs"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline"
              >
                <span>Xem toàn bộ</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#EFEDE7] dark:border-white/[0.06] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2 font-mono-tech text-[10px]">
                    <span
                      className={
                        log.severity === "CRITICAL"
                          ? "text-rose-600 dark:text-rose-400 font-semibold"
                          : log.severity === "WARN"
                            ? "text-amber-700 dark:text-amber-400 font-semibold"
                            : log.severity === "SUCCESS"
                              ? "text-emerald-700 dark:text-emerald-400 font-semibold"
                              : "text-[#1D4ED8] dark:text-[#38BDF8] font-semibold"
                      }
                    >
                      [{log.eventType}]
                    </span>
                    <span className="text-[#64748B] dark:text-[#94A3B8] shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-[#0F172A] dark:text-[#F1F5F9] text-[11px] leading-snug line-clamp-2">
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

export default AdminDashboard

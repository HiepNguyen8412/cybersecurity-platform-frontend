import { useState, useEffect, useCallback } from "react"
import { Search, Download, RefreshCw } from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Button } from "../../components/common"
import { ADMIN_AUDIT_LOGS } from "./data/adminMockData"
import adminService from "../../services/adminService"
import useNotificationStore from "../../stores/useNotificationStore"

function mapAuditSeverity(status) {
  switch (String(status || "").toUpperCase()) {
    case "FAILED":
    case "ERROR":
    case "CRITICAL":
      return "CRITICAL"
    case "WARNING":
    case "WARN":
      return "WARN"
    case "SUCCESS":
      return "SUCCESS"
    default:
      return "INFO"
  }
}

function getSeverityBadgeStyle(severity) {
  switch (severity) {
    case "CRITICAL":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/12 dark:text-rose-300 dark:border-rose-500/25"
    case "WARN":
      return "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/12 dark:text-amber-300 dark:border-amber-500/25"
    case "SUCCESS":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-500/25"
    default:
      return "bg-blue-50 text-[#1D4ED8] border-blue-200 dark:bg-blue-500/12 dark:text-[#93C5FD] dark:border-blue-500/25"
  }
}

function getSeverityLabel(severity) {
  switch (severity) {
    case "CRITICAL":
      return "NGHIÊM TRỌNG"
    case "WARN":
      return "CẢNH BÁO"
    case "SUCCESS":
      return "THÀNH CÔNG"
    default:
      return "THÔNG TIN"
  }
}

export function AdminAuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLiveLogs, setIsLiveLogs] = useState(false)
  const [severityFilter, setSeverityFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchAuditLogsSnapshot = useCallback(async () => {
    const res = await adminService.getAuditLogs({ size: 100 })
    if (res.success && res.data) {
      const rawContent = Array.isArray(res.data)
        ? res.data
        : res.data.content || []
      if (rawContent.length > 0) {
        const mapped = rawContent.map((item) => ({
          id: item.id,
          timestamp: item.createdAt
            ? new Date(item.createdAt).toLocaleString("vi-VN")
            : "Không rõ thời gian",
          severity: mapAuditSeverity(item.status),
          eventType: item.action || item.entityType || "KIỂM_TOÁN",
          user: item.adminUsername || "Hệ thống",
          ip: item.ipAddress || "127.0.0.1",
          action: item.details || item.action || "Hoạt động quản trị hệ thống",
        }))
        return { items: mapped, isLive: true }
      }
    }
    return { items: ADMIN_AUDIT_LOGS, isLive: false }
  }, [])

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const { items, isLive } = await fetchAuditLogsSnapshot()
      setLogs(items)
      setIsLiveLogs(isLive)
    } catch {
      setLogs(ADMIN_AUDIT_LOGS)
      setIsLiveLogs(false)
    } finally {
      setLoading(false)
    }
  }, [fetchAuditLogsSnapshot])

  useEffect(() => {
    let ignore = false
    async function initLogs() {
      try {
        const { items, isLive } = await fetchAuditLogsSnapshot()
        if (!ignore) {
          setLogs(items)
          setIsLiveLogs(isLive)
        }
      } catch {
        if (!ignore) {
          setLogs(ADMIN_AUDIT_LOGS)
          setIsLiveLogs(false)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    initLogs()
    return () => {
      ignore = true
    }
  }, [fetchAuditLogsSnapshot])

  const filteredLogs = logs.filter((l) => {
    const matchSeverity = severityFilter === "all" || l.severity === severityFilter
    const query = searchQuery.trim().toLowerCase()
    const matchSearch =
      !query ||
      l.action.toLowerCase().includes(query) ||
      l.user.toLowerCase().includes(query) ||
      l.ip.includes(query) ||
      l.eventType.toLowerCase().includes(query)
    return matchSeverity && matchSearch
  })

  const handleExportLogs = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(filteredLogs, null, 2))
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `nhat_ky_kiem_toan_soc_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()

    useNotificationStore.getState().success(
      "Xuất báo cáo kiểm toán thành công",
      `Đã tải xuống ${filteredLogs.length} bản ghi nhật ký bảo mật định dạng JSON.`
    )
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      <AdminHeader
        title="Nhật ký Kiểm toán & Truy vết Hệ thống"
        subtitle="Lưu trữ bất biến mọi thao tác quản trị, kiểm định phòng Lab, sự kiện xác thực và cảnh báo WAF."
        statusLabel={isLiveLogs ? "LUỒNG KIỂM TOÁN TRỰC TIẾP" : "NHẬT KÝ MẪU NGOẠI TUYẾN"}
        statusTone={isLiveLogs ? "operational" : "sample"}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              isLoading={loading}
              leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />}
            >
              Làm mới
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportLogs}
              leftIcon={<Download className="h-3.5 w-3.5" />}
            >
              Xuất báo cáo JSON
            </Button>
          </div>
        }
      />

      {/* Thanh tìm kiếm & lọc mức độ */}
      <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" aria-hidden="true" />
            <input
              id="admin-audit-search"
              name="adminAuditSearch"
              type="text"
              aria-label="Tìm kiếm nhật ký kiểm toán"
              placeholder="Tìm kiếm theo nội dung thao tác, địa chỉ IP, tài khoản hoặc mã sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              id="admin-audit-severity"
              name="adminAuditSeverity"
              aria-label="Lọc theo mức độ sự kiện"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] cursor-pointer"
            >
              <option value="all">Tất cả mức độ ({logs.length})</option>
              <option value="INFO">Thông tin</option>
              <option value="SUCCESS">Thành công</option>
              <option value="WARN">Cảnh báo</option>
              <option value="CRITICAL">Nghiêm trọng</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Bảng nhật ký kiểm toán */}
      <Card variant="flat" padding="none" className="bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8] font-mono-tech text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Mức độ</th>
                <th className="py-3 px-4">Loại sự kiện</th>
                <th className="py-3 px-4">Tài khoản thực hiện</th>
                <th className="py-3 px-4">Địa chỉ IP</th>
                <th className="py-3 px-4">Chi tiết tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEDE7] dark:divide-white/[0.06]">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-[#FAF9F6] dark:hover:bg-[#161C2A]/60 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono-tech border ${getSeverityBadgeStyle(log.severity)}`}
                    >
                      {getSeverityLabel(log.severity)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9] whitespace-nowrap">
                    {log.eventType}
                  </td>
                  <td className="py-3.5 px-4 text-[#0F172A] dark:text-[#F1F5F9] max-w-[220px] truncate">
                    {log.user}
                  </td>
                  <td className="py-3.5 px-4 font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap">
                    {log.ip}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569] dark:text-[#94A3B8] min-w-[260px]">
                    {log.action}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#64748B] dark:text-[#94A3B8]">
                    Không có bản ghi kiểm toán nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default AdminAuditLogs

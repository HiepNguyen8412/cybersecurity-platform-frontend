import { useState, useEffect, useCallback } from "react"
import { Search, Download, RefreshCw } from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Button } from "../../components/common"
import { ADMIN_AUDIT_LOGS } from "./data/adminMockData"
import adminService from "../../services/adminService"
import useNotificationStore from "../../stores/useNotificationStore"

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [severityFilter, setSeverityFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchLogs = useCallback(async () => {
    try {
      const res = await adminService.getAuditLogs({ size: 100 })
      if (res.success && res.data) {
        const rawContent = Array.isArray(res.data) ? res.data : res.data.content || []
        if (rawContent.length > 0) {
          const mapped = rawContent.map((item) => ({
            id: item.id,
            timestamp: item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "N/A",
            severity: item.status === "FAILED" ? "CRITICAL" : item.status === "WARNING" ? "WARN" : "SUCCESS",
            eventType: item.action || item.entityType || "AUDIT",
            user: item.adminUsername || "Hệ thống",
            ip: item.ipAddress || "127.0.0.1",
            action: item.details || item.action || "Hoạt động quản trị",
          }))
          setLogs(mapped)
          return
        }
      }
      setLogs(ADMIN_AUDIT_LOGS)
    } catch {
      setLogs(ADMIN_AUDIT_LOGS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const res = await adminService.getAuditLogs({ size: 100 })
        if (!ignore) {
          if (res.success && res.data) {
            const rawContent = Array.isArray(res.data) ? res.data : res.data.content || []
            if (rawContent.length > 0) {
              const mapped = rawContent.map((item) => ({
                id: item.id,
                timestamp: item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "N/A",
                severity: item.status === "FAILED" ? "CRITICAL" : item.status === "WARNING" ? "WARN" : "SUCCESS",
                eventType: item.action || item.entityType || "AUDIT",
                user: item.adminUsername || "Hệ thống",
                ip: item.ipAddress || "127.0.0.1",
                action: item.details || item.action || "Hoạt động quản trị",
              }))
              setLogs(mapped)
              setLoading(false)
              return
            }
          }
          setLogs(ADMIN_AUDIT_LOGS)
          setLoading(false)
        }
      } catch {
        if (!ignore) {
          setLogs(ADMIN_AUDIT_LOGS)
          setLoading(false)
        }
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const filteredLogs = logs.filter((l) => {
    const matchSeverity = severityFilter === "all" || l.severity === severityFilter
    const matchSearch =
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ip.includes(searchQuery) ||
      l.eventType.toLowerCase().includes(searchQuery.toLowerCase())
    return matchSeverity && matchSearch
  })

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2))
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `soc_audit_logs_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()

    useNotificationStore.getState().success(
      "Xuất Dữ Liệu Kiểm Toán Thành Công",
      `Đã xuất ${logs.length} bản ghi kiểm toán bảo mật sang định dạng JSON.`
    )
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      {/* Header */}
      <AdminHeader
        title="Nhật Ký Kiểm Toán & Giám Sát Telemetry"
        subtitle="Toàn bộ lịch sử can thiệp hệ thống, nộp flag, triển khai container và các cảnh báo bất thường"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              isLoading={loading}
              leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />}
            >
              Làm Mới
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportLogs}
              leftIcon={<Download className="h-3.5 w-3.5" />}
            >
              Xuất Báo Cáo JSON
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <Card className="p-4 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo hành động, địa chỉ IP, người dùng hoặc loại sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="INFO">INFO (Thông tin)</option>
              <option value="SUCCESS">SUCCESS (Thành công)</option>
              <option value="WARN">WARN (Cảnh báo)</option>
              <option value="CRITICAL">CRITICAL (Nghiêm trọng)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">THỜI GIAN</th>
                <th className="py-3 px-4">MỨC ĐỘ</th>
                <th className="py-3 px-4">LOẠI SỰ KIỆN</th>
                <th className="py-3 px-4">CHUYÊN VIÊN THỰC HIỆN</th>
                <th className="py-3 px-4">ĐỊA CHỈ IP</th>
                <th className="py-3 px-4">NỘI DUNG TÁC CHIẾN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono
                      ${
                        log.severity === "CRITICAL"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200"
                          : log.severity === "WARN"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200"
                          : log.severity === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"
                      }
                    `}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {log.eventType}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                    {log.user}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {log.ip}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {log.action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

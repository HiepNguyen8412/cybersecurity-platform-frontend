import { useState } from "react"
import {
  Settings,
  Server,
  Lock,
  ShieldCheck,
  Bell,
  Save,
  CheckCircle2,
  Terminal,
  Activity,
  Globe,
} from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Button, Input } from "../../components/common"
import useNotificationStore from "../../stores/useNotificationStore"

export default function AdminSettings() {
  const [sandboxTimeout, setSandboxTimeout] = useState("45")
  const [maxContainers, setMaxContainers] = useState("64")
  const [enforceMfa, setEnforceMfa] = useState(true)
  const [ipWhitelist, setIpWhitelist] = useState("10.0.0.0/8, 192.168.1.0/24")
  const [webhookUrl, setWebhookUrl] = useState("https://siem.soc-center.internal/alerts")
  const [rateLimitRequests, setRateLimitRequests] = useState("120")

  const handleSave = (e) => {
    e.preventDefault()
    useNotificationStore.getState().success(
      "Đã Lưu Cấu Hình Hệ Thống",
      "Các tham số hạ tầng Sandbox và chính sách an ninh mạng đã được áp dụng toàn range."
    )
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      {/* Header */}
      <AdminHeader
        title="Cấu Hình Hạ Tầng Diễn Tập & An Ninh Hệ Thống"
        subtitle="Thiết lập tham số tài nguyên cụm container Kubernetes, chính sách bảo vệ chống brute-force và Webhook SIEM"
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Section 1: Sandbox Cluster */}
        <Card className="p-6 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-cyan-400">
              <Server className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cấu Hình Cụm Container Sandbox Đám Mây
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quy định thời gian sống và số lượng container cô lập chạy song song
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Thời gian tự động hủy Container (Phút)
              </label>
              <select
                value={sandboxTimeout}
                onChange={(e) => setSandboxTimeout(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="15">15 phút (Bài lab ngắn)</option>
                <option value="30">30 phút (Tiêu chuẩn)</option>
                <option value="45">45 phút (Mặc định)</option>
                <option value="60">60 phút (Kỳ thi sát hạch)</option>
                <option value="120">120 phút (Diễn tập Red/Blue Team)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Số container tối đa toàn range
              </label>
              <input
                type="number"
                value={maxContainers}
                onChange={(e) => setMaxContainers(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Security & Authentication */}
        <Card className="p-6 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Chính Sách An Ninh & Xác Thực Bắt Buộc
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bảo vệ máy chủ trước các cuộc tấn công brute-force và rò rỉ thông tin đăng nhập
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  Bắt buộc xác thực 2FA/MFA cho toàn bộ chuyên viên
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Áp dụng cho các tài khoản vai trò Security Analyst, SOC Lead và Super Admin
                </div>
              </div>
              <input
                type="checkbox"
                checked={enforceMfa}
                onChange={(e) => setEnforceMfa(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Dải mạng IP Whitelist cho quyền Super Admin
              </label>
              <input
                type="text"
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Giới hạn request tối đa (Rate Limit trên mỗi IP/phút)
              </label>
              <input
                type="number"
                value={rateLimitRequests}
                onChange={(e) => setRateLimitRequests(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </Card>

        {/* Section 3: Webhook SIEM Integration */}
        <Card className="p-6 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tích Hợp Webhook Điều Tra SIEM & Cảnh Báo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gửi trực tiếp các sự kiện CRITICAL tới SIEM (Wazuh/Splunk) hoặc Telegram Bot
              </p>
            </div>
          </div>

          <div className="text-xs space-y-2">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold">
              Endpoint Webhook Tiếp Nhận Cảnh Báo
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
            />
          </div>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button variant="primary" size="md" type="submit" leftIcon={<Save className="h-4 w-4" />}>
            Lưu Toàn Bộ Cấu Hình Hệ Thống
          </Button>
        </div>
      </form>
    </div>
  )
}

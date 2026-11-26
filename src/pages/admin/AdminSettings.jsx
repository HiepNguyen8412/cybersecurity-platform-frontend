import { useState } from "react"
import {
  Server,
  Lock,
  Bell,
  Save,
  RotateCcw,
} from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Button } from "../../components/common"
import useNotificationStore from "../../stores/useNotificationStore"

const STORAGE_KEY = "cyber_admin_settings"

const DEFAULT_SETTINGS = {
  sandboxTimeout: "45",
  maxContainers: "64",
  enforceMfa: true,
  ipWhitelist: "10.0.0.0/8, 192.168.1.0/24",
  rateLimitRequests: "120",
  webhookUrl: "https://siem.soc-center.internal/alerts",
  capstonePassThreshold: "80",
}

function loadSavedSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function AdminSettings() {
  const [settings, setSettings] = useState(loadSavedSettings)

  const handleSave = (e) => {
    e.preventDefault()
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Bỏ qua lỗi lưu trữ cục bộ
    }
    useNotificationStore.getState().success(
      "Đã lưu cấu hình hệ thống",
      "Các tham số hạ tầng Sandbox, chính sách bảo mật và ngưỡng thẩm định đã được áp dụng."
    )
  }

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Bỏ qua lỗi lưu trữ cục bộ
    }
    useNotificationStore.getState().info(
      "Đã khôi phục mặc định",
      "Các tham số cấu hình đã quay về tiêu chuẩn xuất xưởng của CyberPath."
    )
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      <AdminHeader
        title="Cấu hình Hạ tầng & Chính sách An ninh"
        subtitle="Thiết lập tham số vòng đời Sandbox Kubernetes, yêu cầu xác thực hai lớp, giới hạn lưu lượng và tích hợp SIEM."
        statusLabel="LƯU CẤU HÌNH CỤC BỘ"
        statusTone="sample"
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Phần 1: Cụm Container Sandbox */}
        <Card variant="flat" className="p-6 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08] space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
              <Server className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Cụm Container Sandbox & Học thuật
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Quy định thời lượng sống tối đa, số lượng phiên song song và ngưỡng đạt đồ án Capstone
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label
                htmlFor="admin-setting-sandbox-timeout"
                className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
              >
                Thời hạn tự động thu hồi (Phút)
              </label>
              <select
                id="admin-setting-sandbox-timeout"
                name="sandboxTimeout"
                value={settings.sandboxTimeout}
                onChange={(e) =>
                  setSettings({ ...settings, sandboxTimeout: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
              >
                <option value="15">15 phút (Bài thực hành ngắn)</option>
                <option value="30">30 phút (Tiêu chuẩn)</option>
                <option value="45">45 phút (Mặc định)</option>
                <option value="60">60 phút (Kiểm tra chuyên sâu)</option>
                <option value="120">120 phút (Diễn tập đội ngũ)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="admin-setting-max-containers"
                className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
              >
                Số container tối đa toàn hệ thống
              </label>
              <input
                id="admin-setting-max-containers"
                name="maxContainers"
                type="number"
                min={8}
                max={512}
                value={settings.maxContainers}
                onChange={(e) =>
                  setSettings({ ...settings, maxContainers: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label
                htmlFor="admin-setting-capstone-threshold"
                className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
              >
                Ngưỡng đạt chuẩn NIST Rubric
              </label>
              <input
                id="admin-setting-capstone-threshold"
                name="capstonePassThreshold"
                type="number"
                min={60}
                max={100}
                value={settings.capstonePassThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, capstonePassThreshold: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
              />
            </div>
          </div>
        </Card>

        {/* Phần 2: Chính sách an ninh & Xác thực */}
        <Card variant="flat" className="p-6 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08] space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#3B82F6] border border-[#E5E2DC] dark:border-white/[0.08]">
              <Lock className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Chính sách An ninh & Kiểm soát Truy cập
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Bảo vệ cổng quản trị trước tấn công dò mật khẩu và truy cập ngoài vùng tin cậy
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#EFEDE7] dark:border-white/[0.06]">
              <div>
                <label
                  htmlFor="admin-setting-enforce-mfa"
                  className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] cursor-pointer"
                >
                  Bắt buộc xác thực hai lớp (2FA/MFA) cho toàn bộ chuyên viên
                </label>
                <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">
                  Áp dụng cho vai trò Chuyên viên phân tích, Trưởng ca SOC và Quản trị viên cấp cao
                </p>
              </div>
              <input
                id="admin-setting-enforce-mfa"
                name="enforceMfa"
                type="checkbox"
                checked={settings.enforceMfa}
                onChange={(e) =>
                  setSettings({ ...settings, enforceMfa: e.target.checked })
                }
                className="h-4 w-4 rounded border-[#D0CCC3] dark:border-white/[0.16] text-[#1D4ED8] focus:ring-[#1D4ED8] cursor-pointer shrink-0"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="admin-setting-ip-whitelist"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Dải mạng tin cậy cho quyền Quản trị viên
                </label>
                <input
                  id="admin-setting-ip-whitelist"
                  name="ipWhitelist"
                  type="text"
                  value={settings.ipWhitelist}
                  onChange={(e) =>
                    setSettings({ ...settings, ipWhitelist: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-setting-rate-limit"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Giới hạn yêu cầu tối đa (lượt/IP/phút)
                </label>
                <input
                  id="admin-setting-rate-limit"
                  name="rateLimitRequests"
                  type="number"
                  min={10}
                  max={2000}
                  value={settings.rateLimitRequests}
                  onChange={(e) =>
                    setSettings({ ...settings, rateLimitRequests: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Phần 3: Tích hợp Webhook SIEM */}
        <Card variant="flat" className="p-6 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08] space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] text-emerald-700 dark:text-emerald-400 border border-[#E5E2DC] dark:border-white/[0.08]">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Tích hợp Webhook Điều tra SIEM & Cảnh báo
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Chuyển tiếp tức thì các sự kiện mức độ nghiêm trọng tới hệ thống SIEM tập trung
              </p>
            </div>
          </div>

          <div className="text-xs space-y-1.5">
            <label
              htmlFor="admin-setting-webhook-url"
              className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium"
            >
              Địa chỉ Webhook tiếp nhận cảnh báo
            </label>
            <input
              id="admin-setting-webhook-url"
              name="webhookUrl"
              type="url"
              value={settings.webhookUrl}
              onChange={(e) =>
                setSettings({ ...settings, webhookUrl: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            size="md"
            type="button"
            onClick={handleResetDefaults}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Khôi phục mặc định
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            leftIcon={<Save className="h-4 w-4" />}
          >
            Lưu toàn bộ cấu hình
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Compass,
  Shield,
  Globe,
  Lock,
  Key,
  ChevronRight,
  ArrowRight,
  Terminal,
  UserCheck,
} from "lucide-react"
import { LearningPathTimeline } from "./components/LearningPathTimeline"

const TRACKS_DATA = [
  {
    id: "soc-analyst",
    title: "Chuyên Viên Phân Tích SOC (Blue Team)",
    role: "Phòng Thủ & Tác Chiến SOC",
    icon: UserCheck,
    level: "Nhập Môn - Trung Cấp",
    duration: "42 Giờ Thực Hành",
    labsCount: 24,
    enrolledCount: "1,240 Chuyên Viên",
    certifications: ["CompTIA Security+", "CySA+", "BTL1"],
    summary: "Làm chủ kỹ thuật phát hiện mối đe dọa thời gian thực, phân tích gói tin mạng và ứng phó sự cố an ninh trong trung tâm điều hành SOC hiện đại.",
    stages: [
      {
        number: "01",
        title: "Nền Tảng Mạng & Pháp Chứng Lưu Lượng",
        skills: ["TCP/IP", "Wireshark", "Giải Mã Gói Tin", "Ngăn Chặn ARP Spoofing"],
        status: "completed",
        labs: 6,
      },
      {
        number: "02",
        title: "Thu Thập Telemetry Điểm Cuối & Kiểm Toán Sysmon",
        skills: ["Windows Event Logs", "Linux Auth Logs", "Cây Tiến Trình", "Pháp Chứng Volatility"],
        status: "in-progress",
        labs: 7,
      },
      {
        number: "03",
        title: "Vận Hành SIEM & Kỹ Thuật Viết Luật Suricata",
        skills: ["Truy Vấn Splunk SPL", "Suricata IDS", "Chữ Ký Snort", "Tinh Chỉnh Cảnh Báo"],
        status: "locked",
        labs: 6,
      },
      {
        number: "04",
        title: "Đồ Án Tốt Nghiệp: Ứng Cứu Sự Cố Tấn Công Thực Địa",
        skills: ["Ánh Xạ MITRE ATT&CK", "Xử Lý Ransomware", "Báo Cáo Pháp Chứng"],
        status: "locked",
        labs: 5,
      },
    ],
  },
  {
    id: "web-pentester",
    title: "Chuyên Gia Đánh Giá & Kiểm Thử Xâm Nhập Web",
    role: "Tấn Công & Diễn Tập Red Team",
    icon: Globe,
    level: "Trung Cấp - Nâng Cao",
    duration: "38 Giờ Thực Hành",
    labsCount: 22,
    enrolledCount: "980 Kiểm Thử Viên",
    certifications: ["eJPT", "OSCP", "Burp Suite Certified"],
    summary: "Phương pháp luận chuẩn quốc tế để phát hiện, khai thác và khắc phục triệt để các lỗ hổng nghiêm trọng trên ứng dụng web phân tán.",
    stages: [
      {
        number: "01",
        title: "Kiến Trúc Web & Do Thám Thu Thập Mục Tiêu",
        skills: ["HTTP/2 & HTTP/3", "Burp Suite Pro", "Quét Thư Mục Nhạy Cảm", "Chiếm Quyền Subdomain"],
        status: "completed",
        labs: 5,
      },
      {
        number: "02",
        title: "Khai Thác Lỗ Hổng Cốt Lõi OWASP Top 10",
        skills: ["SQL Injection", "Stored/DOM XSS", "SSRF", "CSRF", "Bypass Tải File"],
        status: "in-progress",
        labs: 8,
      },
      {
        number: "03",
        title: "Lỗ Hổng Xác Thực & Phá Vỡ Cơ Chế Mật Mã",
        skills: ["Nhầm Lẫn Thuật Toán JWT", "Chiếm Đoạt OAuth 2.0", "Lỗi Cấu Hình SAML", "IDOR"],
        status: "locked",
        labs: 5,
      },
      {
        number: "04",
        title: "Đồ Án Tốt Nghiệp: Đánh Giá Pentest Doanh Nghiệp",
        skills: ["Khai Thác Đa Tầng", "Chuỗi Lỗ Hổng Zero-Day", "Báo Cáo Khắc Phục Lãnh Đạo"],
        status: "locked",
        labs: 4,
      },
    ],
  },
  {
    id: "cloud-security",
    title: "Kỹ Sư An Ninh Đám Mây & DevSecOps",
    role: "Bảo Vệ Hạ Tầng & Danh Tính",
    icon: Lock,
    level: "Nâng Cao",
    duration: "35 Giờ Thực Hành",
    labsCount: 18,
    enrolledCount: "640 Kỹ Sư",
    certifications: ["AWS Certified Security", "CCSP", "CKS"],
    summary: "Gia cố tài khoản Cloud đa người dùng, thiết lập kiến trúc Zero-Trust và bảo mật vi dịch vụ container Kubernetes.",
    stages: [
      {
        number: "01",
        title: "Quản Trị IAM Cloud & Nguyên Tắc Đặc Quyền Tối Thiểu",
        skills: ["AWS STS", "Kiểm Toán Ranh Giới IAM", "Bảo Vệ Metadata IMDSv2", "Thực Thi Chính Sách"],
        status: "locked",
        labs: 5,
      },
      {
        number: "02",
        title: "Gia Cố Cụm Kubernetes & Vi Dịch Vụ",
        skills: ["Chuẩn An Toàn Pod", "NetworkPolicies", "Giám Sát Falco Runtime", "Quét Lỗ Hổng Trivy"],
        status: "locked",
        labs: 5,
      },
      {
        number: "03",
        title: "Tự Động Hóa Pipeline DevSecOps CI/CD",
        skills: ["Phân Tích SAST/DAST", "Quét Lộ Bí Mật", "Bộ Lọc OPA Gatekeeper", "Xác Thực Chữ Ký Cosign"],
        status: "locked",
        labs: 4,
      },
      {
        number: "04",
        title: "Mô Phỏng Xâm Nhập Đám Mây & Khôi Phục Hệ Thống",
        skills: ["Ứng Phó Ransomware S3", "Pháp Chứng CloudTrail", "Tự Động Hóa GuardDuty"],
        status: "locked",
        labs: 4,
      },
    ],
  },
  {
    id: "cryptography",
    title: "Mật Mã Ứng Dụng & Phòng Thủ Giao Thức",
    role: "Kỹ Thuật Mật Mã Học",
    icon: Key,
    level: "Cơ Bản - Chuyên Sâu",
    duration: "26 Giờ Thực Hành",
    labsCount: 14,
    enrolledCount: "420 Nhà Nghiên Cứu",
    certifications: ["GIAC Defending Cryptography", "NIST Standards"],
    summary: "Triển khai và kiểm toán các thuật toán mật mã hiện đại, kiểm tra bắt tay giao thức bảo mật và phòng chống tấn công dò rỉ kênh phụ.",
    stages: [
      {
        number: "01",
        title: "Mật Mã Đối Xứng & Chế Độ Mã Hóa Khối",
        skills: ["AES-GCM", "ChaCha20-Poly1305", "Tấn Công Padding Oracle", "Lỗ Hổng Tái Sử Dụng IV"],
        status: "locked",
        labs: 4,
      },
      {
        number: "02",
        title: "Trao Đổi Khóa Bất Đối Xứng & Chữ Ký Số",
        skills: ["Gia Cố Tham Số RSA", "ECDH & Ed25519", "Chứng Thư X.509"],
        status: "locked",
        labs: 4,
      },
      {
        number: "03",
        title: "Phân Tích Chuyên Sâu Giao Thức TLS 1.3",
        skills: ["Bảo Mật Tiến Tuyến (FS)", "Phòng Thủ Replay 0-RTT", "Mã Hóa SNI ECH"],
        status: "locked",
        labs: 3,
      },
      {
        number: "04",
        title: "Mật Mã Học Kháng Lượng Tử (Post-Quantum)",
        skills: ["Trao Đổi Khóa Kyber", "Chữ Ký Số Dilithium", "Kháng Máy Tính Lượng Tử"],
        status: "locked",
        labs: 3,
      },
    ],
  },
]

export function LearningPaths() {
  const [selectedTrackId, setSelectedTrackId] = useState("soc-analyst")
  const activeTrack = TRACKS_DATA.find((t) => t.id === selectedTrackId) || TRACKS_DATA[0]

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8 sm:pb-10 space-y-10 animate-fade-in-up">
      {/* ====================================================================
          1. HEADER & CAREER ROADMAP BRIEFING
         ==================================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/90 border border-slate-700/60 dark:border-slate-800 shadow-xl p-6 sm:p-8 overflow-hidden text-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
        <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none select-none text-cyan-400">
          <Shield className="w-96 h-96" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span>LỘ TRÌNH CHUYÊN GIA AN NINH MẠNG</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Lộ Trình & Khung Năng Lực An Ninh Mạng Chuyên Nghiệp
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Các lộ trình chuẩn hóa từ nhập môn đến kỹ sư tác chiến chuyên sâu, tích hợp hoàn hảo với hệ thống Cyber Range Sandbox và chứng chỉ quốc tế.
            </p>
          </div>

          {/* Career Stats Pill */}
          <div className="flex items-center gap-4 font-mono text-xs text-slate-300 p-4 rounded-2xl bg-slate-950/80 border border-slate-700/50 dark:border-slate-800 self-start md:self-auto shadow-xl shrink-0 backdrop-blur-sm">
            <div>
              <span className="text-cyan-400 font-extrabold text-base block">4 TRACKS</span>
              <span className="text-[10px] text-slate-400">LỘ TRÌNH THỰC CHIẾN</span>
            </div>
            <div className="h-7 w-px bg-slate-800" />
            <div>
              <span className="text-emerald-400 font-extrabold text-base block">100%</span>
              <span className="text-[10px] text-slate-400">THỰC HÀNH LAB 100%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. CAREER TRACK SELECTOR CARDS (Top Horizontal Grid)
         ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRACKS_DATA.map((track) => {
          const Icon = track.icon
          const isSelected = selectedTrackId === track.id

          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelectedTrackId(track.id)}
              className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-blue-50/90 dark:bg-slate-900 border-blue-500 dark:border-cyan-500 shadow-md border-blue-500 dark:border-cyan-500 text-slate-900 dark:text-white"
                  : "bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-md shadow-blue-500/25 dark:shadow-cyan-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <Icon className="h-5 w-5 stroke-[2.2]" />
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                    {track.level.split(" ")[0]}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {track.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {track.role}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>{track.duration}</span>
                {isSelected && (
                  <span className="text-blue-600 dark:text-cyan-400 font-bold flex items-center gap-0.5">
                    <span>Đang chọn</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* ====================================================================
          3. ACTIVE TRACK DEEP-DIVE & PROGRESSION STAGES (Adaptive Light/Dark)
         ==================================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-8 text-slate-900 dark:text-white">
        {/* Active Track Top Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/30">
                LỘ TRÌNH ĐANG KÍCH HOẠT
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {activeTrack.duration} &bull; {activeTrack.labsCount} Sandbox Labs
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeTrack.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {activeTrack.summary}
            </p>
          </div>

          {/* Industry Certifications Mapped */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 shrink-0 font-mono shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              CHỨNG CHỈ QUỐC TẾ MỤC TIÊU
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeTrack.certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-cyan-400 shadow-xs"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Visual Timeline */}
        <LearningPathTimeline path={activeTrack} />

        {/* 4 Progressive Milestones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>CÁC CHẶNG THỬ THÁCH & CHUYÊN ĐỀ ({activeTrack.stages.length} CHẶNG)</span>
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Kiến thức lũy tiến thực chiến
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTrack.stages.map((stage) => (
              <div
                key={stage.number}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 hover:border-blue-400 dark:hover:border-cyan-500/40 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black font-mono text-blue-600 dark:text-cyan-400">
                      STAGE {stage.number}
                    </span>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        stage.status === "completed"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                          : stage.status === "in-progress"
                          ? "bg-blue-50 dark:bg-cyan-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-800/40"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-500"
                      }`}
                    >
                      {stage.status === "completed" ? "ĐÃ HOÀN THÀNH" : stage.status === "in-progress" ? "ĐANG HỌC" : "CHƯA MỞ KHÓA"}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {stage.title}
                  </h4>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stage.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>{stage.labs} Phòng Lab Thực Hành</span>
                  <Link
                    to="/learning"
                    className="text-blue-600 dark:text-cyan-400 font-bold hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Vào Học Chặng Này</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Track CTA Bar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h4 className="text-base font-bold">
              Sẵn sàng gia nhập lộ trình {activeTrack.title}?
            </h4>
            <p className="text-xs text-blue-100">
              Ghi danh vào pipeline để mở khóa toàn bộ bài giảng thực chiến, code audit và phòng lab tương tác.
            </p>
          </div>

          <Link
            to="/learning"
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-cyan-300 font-bold text-xs shrink-0 cursor-pointer shadow-md border border-cyan-400/30 transition-all flex items-center gap-1.5"
          >
            <Terminal className="w-4 h-4" />
            <span>Mở Giáo Trình Tác Chiến</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LearningPaths

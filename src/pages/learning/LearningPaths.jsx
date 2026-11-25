import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Compass,
  Globe,
  Lock,
  Key,
  ChevronRight,
  ArrowRight,
  Terminal,
  UserCheck,
  Award,
  BookOpen,
} from "lucide-react"
import { LearningPathTimeline } from "./components/LearningPathTimeline"

const TRACKS_DATA = [
  {
    id: "soc-analyst",
    title: "Chuyên Viên Phân Tích SOC (Blue Team)",
    role: "Phòng Thủ & Tác Chiến SOC",
    nistRole: "NIST NICE: PR-CDA-001",
    icon: UserCheck,
    level: "Nhập Môn – Trung Cấp",
    duration: "42 Giờ Thực Hành",
    labsCount: 24,
    enrolledCount: "1,240 Nghiên Cứu Viên",
    certifications: ["CompTIA Security+", "CySA+", "BTL1"],
    summary:
      "Làm chủ kỹ thuật phát hiện mối đe dọa thời gian thực, phân tích gói tin mạng, chuẩn hóa Syslog (RFC 5424) và ứng phó sự cố theo NIST SP 800-61.",
    stages: [
      {
        number: "01",
        title: "Nền Tảng Mạng & Pháp Chứng Lưu Lượng",
        skills: ["TCP/IP", "Wireshark", "Giải Mã Gói Tin", "Phòng Chống ARP Spoofing"],
        status: "completed",
        labs: 6,
      },
      {
        number: "02",
        title: "Thu Thập Telemetry Điểm Cuối & Kiểm Toán Sysmon",
        skills: ["Windows Event Logs", "Linux Auth Logs", "Cây Tiến Trình", "Volatility 3"],
        status: "in-progress",
        labs: 7,
      },
      {
        number: "03",
        title: "Vận Hành SIEM & Kỹ Thuật Viết Luật Suricata / Sigma",
        skills: ["Elastic / Splunk SPL", "Suricata IDS", "Chuẩn Sigma", "Tinh Chỉnh Cảnh Báo"],
        status: "locked",
        labs: 6,
      },
      {
        number: "04",
        title: "Đồ Án Capstone: Ứng Cứu Sự Cố Tấn Công Thực Địa",
        skills: ["Ánh Xạ MITRE ATT&CK", "Cách Ly Ransomware", "Báo Cáo Pháp Chứng"],
        status: "locked",
        labs: 5,
      },
    ],
  },
  {
    id: "web-pentester",
    title: "Chuyên Gia Đánh Giá & Kiểm Thử Xâm Nhập Web",
    role: "Tấn Công & Đánh Giá Red Team",
    nistRole: "NIST NICE: SP-TST-001",
    icon: Globe,
    level: "Trung Cấp – Nâng Cao",
    duration: "38 Giờ Thực Hành",
    labsCount: 22,
    enrolledCount: "980 Kiểm Thử Viên",
    certifications: ["eJPT", "OSCP", "OWASP ASVS"],
    summary:
      "Phương pháp luận chuẩn quốc tế để phát hiện, giải phẫu nguyên nhân gốc rễ và vá triệt để các lỗ hổng nghiêm trọng trên ứng dụng web và API phân tán.",
    stages: [
      {
        number: "01",
        title: "Kiến Trúc HTTP (RFC 9110) & Trinh Sát Bề Mặt",
        skills: ["HTTP/2 & CORS", "Burp Suite Pro", "Quét Endpoint", "Subdomain Audit"],
        status: "completed",
        labs: 5,
      },
      {
        number: "02",
        title: "Khai Thác & Vá Lỗi Cốt Lõi OWASP Top 10",
        skills: ["SQL Injection AST", "Stored/DOM XSS", "SSRF IMDS", "PreparedStatement"],
        status: "in-progress",
        labs: 8,
      },
      {
        number: "03",
        title: "Lỗ Hổng Xác Thực & Kiểm Toán Phân Quyền API",
        skills: ["JWT Key Confusion", "OAuth 2.0", "SAML", "BOLA / IDOR"],
        status: "locked",
        labs: 5,
      },
      {
        number: "04",
        title: "Đồ Án Capstone: Đánh Giá Pentest Doanh Nghiệp",
        skills: ["Chuỗi Khai Thác Đa Tầng", "Bản Vá Mã Nguồn", "Báo Cáo NIST Rubric"],
        status: "locked",
        labs: 4,
      },
    ],
  },
  {
    id: "cloud-security",
    title: "Kỹ Sư An Ninh Đám Mây & DevSecOps",
    role: "Bảo Vệ Hạ Tầng & Danh Tính",
    nistRole: "NIST NICE: DD-WDS-001",
    icon: Lock,
    level: "Nâng Cao",
    duration: "35 Giờ Thực Hành",
    labsCount: 18,
    enrolledCount: "640 Kỹ Sư",
    certifications: ["AWS Certified Security", "CCSP", "CKS"],
    summary:
      "Gia cố danh tính Cloud đa tài khoản, thiết lập kiến trúc Zero-Trust (NIST SP 800-207) và bảo mật cụm container Kubernetes khỏi kỹ thuật thoát cô lập.",
    stages: [
      {
        number: "01",
        title: "Quản Trị IAM Cloud & Nguyên Tắc Đặc Quyền Tối Thiểu",
        skills: ["AWS STS", "IAM Permission Boundary", "IMDSv2", "SCP Policies"],
        status: "locked",
        labs: 5,
      },
      {
        number: "02",
        title: "Gia Cố Cụm Kubernetes & Vi Dịch Vụ",
        skills: ["Pod Security Standards", "NetworkPolicies", "Falco Runtime", "Trivy Audit"],
        status: "locked",
        labs: 5,
      },
      {
        number: "03",
        title: "Tự Động Hóa Pipeline DevSecOps CI/CD",
        skills: ["SAST / DAST", "Secret Scanning", "OPA Gatekeeper", "Cosign Verification"],
        status: "locked",
        labs: 4,
      },
      {
        number: "04",
        title: "Đồ Án Capstone: Điều Tra CloudTrail & Khôi Phục Cụm",
        skills: ["Ứng Phó S3 Leak", "Pháp Chứng CloudTrail", "GuardDuty Automation"],
        status: "locked",
        labs: 4,
      },
    ],
  },
  {
    id: "cryptography",
    title: "Mật Mã Ứng Dụng & Phòng Thủ Giao Thức",
    role: "Kỹ Thuật Mật Mã Học",
    nistRole: "NIST NICE: SP-ARC-002",
    icon: Key,
    level: "Cơ Bản – Chuyên Sâu",
    duration: "26 Giờ Thực Hành",
    labsCount: 14,
    enrolledCount: "420 Nhà Nghiên Cứu",
    certifications: ["RFC 8446 TLS 1.3", "NIST FIPS 197", "PKI X.509"],
    summary:
      "Triển khai và kiểm toán các thuật toán mật mã hiện đại (AES-GCM, Argon2id, Ed25519), giải phẫu bắt tay TLS 1.3 và phòng chống tấn công kênh phụ.",
    stages: [
      {
        number: "01",
        title: "Mật Mã Đối Xứng & Chế Độ Mã Hóa Xác Thực AEAD",
        skills: ["AES-256-GCM", "ChaCha20-Poly1305", "Padding Oracle", "Quản Lý IV/Nonce"],
        status: "locked",
        labs: 4,
      },
      {
        number: "02",
        title: "Mật Mã Bất Đối Xứng, Băm Argon2id & Chữ Ký Số",
        skills: ["RSA PSS", "ECDH X25519 & Ed25519", "Chứng Thư X.509", "HMAC-SHA256"],
        status: "locked",
        labs: 4,
      },
      {
        number: "03",
        title: "Giải Phẫu Chuyên Sâu Giao Thức TLS 1.3 (RFC 8446)",
        skills: ["Forward Secrecy", "HKDF Key Schedule", "Chống Replay 0-RTT", "ECH"],
        status: "locked",
        labs: 3,
      },
      {
        number: "04",
        title: "Đồ Án Capstone: Mật Mã Học Kháng Lượng Tử (PQC)",
        skills: ["ML-KEM (Kyber)", "ML-DSA (Dilithium)", "Kiểm Toán PKI"],
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10 animate-fade-in-up">
      {/* ====================================================================
          §01. ACADEMIC ROADMAP MONOGRAPH HEADER
         ==================================================================== */}
      <section className="rounded-2xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8] text-[11px] font-mono-tech font-semibold uppercase tracking-[0.08em]">
              <Compass className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span>§01 // LỘ TRÌNH HỌC THUẬT &amp; KHUNG NĂNG LỰC NIST NICE</span>
            </div>

            <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] leading-[1.15] text-[#0F172A] dark:text-[#F1F5F9]">
              Lộ Trình Đào Tạo Chuyên Sâu &amp;{" "}
              <em className="italic font-normal text-[#1D4ED8] dark:text-[#38BDF8]">
                Chuẩn Hóa Nghề Nghiệp
              </em>
            </h1>

            <p className="text-sm sm:text-[15px] text-[#475569] dark:text-[#94A3B8] leading-[1.7] font-sans">
              Mỗi lộ trình được thiết kế theo thang năng lực Bloom và khung chuẩn NIST NICE, gắn kết trực tiếp với hệ thống giáo trình lý thuyết, phòng thí nghiệm Sandbox và đồ án bảo vệ Capstone.
            </p>
          </div>

          {/* Academic Summary Strip */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] self-start lg:self-auto shrink-0 font-mono-tech">
            <div className="px-2">
              <span className="text-[#1D4ED8] dark:text-[#38BDF8] font-bold text-base block">
                4 LỘ TRÌNH
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                CHUYÊN NGÀNH
              </span>
            </div>
            <div className="px-2 border-l border-[#E5E2DC] dark:border-white/[0.08]">
              <span className="text-[#0F172A] dark:text-[#F1F5F9] font-bold text-base block">
                78 LABS
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                THỰC NGHIỆM
              </span>
            </div>
            <div className="px-2 border-l border-[#E5E2DC] dark:border-white/[0.08]">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold text-base block">
                NIST 80+
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                CHUẨN CAPSTONE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          §02. CAREER TRACK SELECTOR CARDS
         ==================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-mono-tech font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
            §02 // CHỌN CHUYÊN NGÀNH NGHIÊN CỨU
          </span>
          <span className="text-xs font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
            Bấm vào từng thẻ để khảo sát chi tiết 4 chặng đào tạo
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Chọn lộ trình chuyên ngành"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {TRACKS_DATA.map((track) => {
            const Icon = track.icon
            const isSelected = selectedTrackId === track.id

            return (
              <button
                key={track.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedTrackId(track.id)}
                className={`text-left p-5 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-blue-50/70 dark:bg-blue-500/10 border-[#1D4ED8] dark:border-[#3B82F6] shadow-xs"
                    : "bg-white dark:bg-[#121722] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                        isSelected
                          ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white border-[#1D4ED8] dark:border-[#3B82F6]"
                          : "bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border-[#E5E2DC] dark:border-white/[0.08]"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>

                    <span className="text-[10px] font-mono-tech font-medium text-[#475569] dark:text-[#94A3B8] bg-[#FAF9F6] dark:bg-[#0B0E14] px-2 py-0.5 rounded border border-[#E5E2DC] dark:border-white/[0.08] whitespace-nowrap">
                      {track.nistRole}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-serif-editorial text-base font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-snug">
                      {track.title}
                    </h2>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono-tech mt-1">
                      {track.role}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EFEDE7] dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono-tech text-[#475569] dark:text-[#94A3B8]">
                  <span>{track.duration}</span>
                  {isSelected && (
                    <span className="text-[#1D4ED8] dark:text-[#38BDF8] font-semibold inline-flex items-center gap-0.5 whitespace-nowrap">
                      <span>Đang xem</span>
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ====================================================================
          §03. ACTIVE TRACK DEEP-DIVE & PROGRESSION STAGES
         ==================================================================== */}
      <section className="p-6 sm:p-8 rounded-2xl border border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#121722] shadow-xs space-y-8">
        {/* Active Track Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#EFEDE7] dark:border-white/[0.06]">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded font-mono-tech text-xs font-semibold bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200 dark:border-blue-500/25">
                §03 // LỘ TRÌNH ĐANG CHỌN
              </span>
              <span className="text-xs font-mono-tech text-[#475569] dark:text-[#94A3B8]">
                {activeTrack.duration} · {activeTrack.labsCount} Phòng Lab · {activeTrack.level}
              </span>
            </div>

            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">
              {activeTrack.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] max-w-3xl leading-relaxed font-sans">
              {activeTrack.summary}
            </p>
          </div>

          {/* Target Certifications Mapped */}
          <div className="p-4 rounded-xl bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2 shrink-0 font-mono-tech">
            <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span>Chứng Chỉ &amp; Chuẩn Tham Chiếu</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeTrack.certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#93C5FD] whitespace-nowrap"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Timeline */}
        <LearningPathTimeline path={activeTrack} />

        {/* 4 Progressive Milestones Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs font-semibold text-[#475569] dark:text-[#94A3B8] font-mono-tech uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span>CÁC CHẶNG ĐÀO TẠO &amp; CHUYÊN ĐỀ ({activeTrack.stages.length} CHẶNG)</span>
            </h3>
            <span className="text-xs font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
              Kiến thức lũy tiến gắn liền bài thực nghiệm
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTrack.stages.map((stage) => (
              <div
                key={stage.number}
                className="p-5 rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0B0E14] hover:border-[#D0CCC3] dark:hover:border-white/[0.16] transition-colors flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-bold font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8]">
                      CHẶNG {stage.number}
                    </span>

                    <span
                      className={`text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${
                        stage.status === "completed"
                          ? "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25"
                          : stage.status === "in-progress"
                          ? "bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border-blue-200 dark:border-blue-500/25"
                          : "bg-white dark:bg-[#121722] text-[#64748B] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.08]"
                      }`}
                    >
                      {stage.status === "completed"
                        ? "ĐÃ HOÀN THÀNH"
                        : stage.status === "in-progress"
                        ? "ĐANG HỌC"
                        : "CHƯA MỞ KHÓA"}
                    </span>
                  </div>

                  <h4 className="font-serif-editorial text-base font-medium text-[#0F172A] dark:text-[#F1F5F9] group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8] transition-colors">
                    {stage.title}
                  </h4>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stage.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-white dark:bg-[#121722] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-between text-xs font-mono-tech text-[#475569] dark:text-[#94A3B8]">
                  <span>{stage.labs} Bài Lab Thực Hành</span>
                  <Link
                    to="/learning"
                    className="text-[#1D4ED8] dark:text-[#38BDF8] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Vào Học Chặng Này</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Track CTA Bar (Cleanly adapted for Editorial Light & Obsidian Dark) */}
        <div className="p-6 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9]">
              Bắt đầu lộ trình {activeTrack.title}
            </h4>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-sans leading-relaxed">
              Mở giáo trình chi tiết để tiếp cận bài giảng lý thuyết, mô phỏng cơ chế và bảo vệ đồ án Capstone.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <Link
              to="/labs"
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#FAF9F6] dark:bg-[#121722] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech font-medium text-xs border border-[#E5E2DC] dark:border-white/[0.08] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <Terminal className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span>Phòng Thí Nghiệm</span>
            </Link>

            <Link
              to="/learning"
              className="px-4 py-2.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mở Giáo Trình Học Phần</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LearningPaths

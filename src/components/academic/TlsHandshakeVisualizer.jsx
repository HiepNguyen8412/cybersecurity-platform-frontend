import { useState } from "react"
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Lock,
  RotateCcw,
  ShieldCheck,
  Unlock,
} from "lucide-react"

const TLS_STAGES = [
  {
    index: 0,
    step: "01",
    rfcSection: "RFC 8446 §4.1.2 · §4.2.8",
    title: "ClientHello + key_share X25519",
    shortTitle: "ClientHello + X25519",
    direction: "client-to-server",
    directionLabel: "Client → Server",
    recordState: "Plaintext (Khởi tạo)",
    encrypted: false,
    wireMessage:
      "ClientHello { legacy_version: 0x0303, supported_versions: [0x0304], cipher_suites: [TLS_AES_256_GCM_SHA384], key_share: X25519(pk_c) }",
    primitives: ["ECDHE (X25519)", "CSPRNG Ephemeral Key", "Cipher Negotiation"],
    mathLabel: "Tính chất toán học (Curve25519 Montgomery Ladder)",
    mathFormula:
      "sk_c ←$ Z_q (32 bytes ngẫu nhiên) ; pk_c = sk_c · G ∈ E(𝔽_{2^255-19})",
    summary:
      "Máy khách gửi đồng thời danh sách thuật toán hỗ trợ và khóa công khai tạm thời X25519 ngay trong gói tin đầu tiên, loại bỏ hoàn toàn 1 vòng RTT thương lượng kiểu TLS 1.2.",
    securityProperty:
      "Loại bỏ các cipher yếu (RC4, 3DES, RSA Static Key Exchange) ngay từ thiết kế giao thức. Khóa bí mật sk_c chỉ tồn tại trong bộ nhớ tạm cho riêng phiên này.",
  },
  {
    index: 1,
    step: "02",
    rfcSection: "RFC 8446 §4.1.3 · §4.3 · §4.4.3",
    title: "ServerHello + EncryptedExtensions + CertificateVerify",
    shortTitle: "ServerHello + CertVerify",
    direction: "server-to-client",
    directionLabel: "Server → Client",
    recordState: "ServerHello Plaintext → Sau đó Mã hóa Handshake",
    encrypted: true,
    wireMessage:
      "ServerHello { key_share: X25519(pk_s) } + {EncryptedExtensions} + {Certificate: X.509} + {CertificateVerify: Sig_sk(H(Transcript))} + {Finished}",
    primitives: ["ECDHE (X25519)", "Ed25519 / RSA-PSS", "Transcript Hash", "Forward Secrecy"],
    mathLabel: "Tính chất xác thực toàn vẹn phiên (Transcript Binding)",
    mathFormula:
      "σ = Sign(sk_cert, \"TLS 1.3, server CertificateVerify\" || SHA-256(ClientHello || ServerHello || ... || Certificate))",
    summary:
      "Máy chủ phản hồi khóa công khai pk_s để thiết lập khóa bắt tay, rồi mã hóa ngay lập tức phần chứng chỉ X.509, chữ ký CertificateVerify và thẻ Finished để bảo vệ danh tính khỏi nghe lén thụ động.",
    securityProperty:
      "Khóa riêng dài hạn sk_cert chỉ đóng vai trò ký xác thực danh tính, không tham gia mã hóa dữ liệu; nhờ đó bảo toàn thuộc tính Forward Secrecy.",
  },
  {
    index: 2,
    step: "03",
    rfcSection: "RFC 8446 §7.1 (Key Schedule)",
    title: "HKDF-Extract / Expand Key Schedule",
    shortTitle: "HKDF Key Schedule",
    direction: "both",
    directionLabel: "Client ↔ Server (Nội bộ)",
    recordState: "Dẫn xuất cây khóa mật mã",
    encrypted: true,
    wireMessage:
      "shared_secret = X25519(sk_c, pk_s) → PRK = HKDF-Extract(salt, shared_secret) → K_app = HKDF-Expand-Label(MasterSecret, \"c ap traffic\", H(Transcript))",
    primitives: ["ECDHE", "HKDF-SHA256", "Forward Secrecy", "Domain Separation"],
    mathLabel: "Tính giao hoán Diffie-Hellman & Hàm dẫn xuất HKDF (RFC 5869)",
    mathFormula:
      "ss = sk_c · pk_s = sk_c · (sk_s · G) = sk_s · pk_c  ⇒  PRK = HMAC-SHA256(salt, ss)",
    summary:
      "Cả Client và Server tính độc lập bí mật chung ECDHE mà không truyền khóa qua mạng, sau đó dẫn xuất các khóa tách biệt cho từng hướng (Client/Server Application Traffic) qua HKDF-Extract và HKDF-Expand-Label.",
    securityProperty:
      "Perfect Forward Secrecy (PFS): Khi phiên kết thúc, cặp khóa tạm thời (sk_c, sk_s) bị xóa sạch. Kẻ tấn công lưu lại toàn bộ gói tin mã hóa cũng không thể giải mã nếu khóa RSA/ECDSA của máy chủ bị lộ trong tương lai.",
  },
  {
    index: 3,
    step: "04",
    rfcSection: "RFC 8446 §5.2 · AEAD Record Layer",
    title: "1-RTT AEAD AES-256-GCM",
    shortTitle: "1-RTT AEAD AES-256-GCM",
    direction: "duplex",
    directionLabel: "Client ⇄ Server (1-RTT)",
    recordState: "Mã hóa Xác thực Toàn vẹn (AEAD)",
    encrypted: true,
    wireMessage:
      "TLSCiphertext = AEAD_AES_256_GCM(Key = K_app, Nonce = IV_static ⊕ seq_num, AAD = RecordHeader, Plaintext || ContentType)",
    primitives: ["AEAD AES-256-GCM", "HKDF-SHA256", "Forward Secrecy", "Anti-Replay Seq"],
    mathLabel: "Cơ chế chống phát lại & Toàn vẹn AEAD (Galois/Counter Mode)",
    mathFormula:
      "Nonce_i = IV ⊕ pad64(seq_i) ; (Ciphertext, Tag_128bit) = AES-256-GCM(K_app, Nonce_i, AAD, P)",
    summary:
      "Sau đúng 1 vòng khứ hồi (1-RTT), kênh ứng dụng vận hành ở chế độ AEAD: vừa mã hóa luồng byte HTTP/API bằng AES-CTR, vừa tạo thẻ xác thực GHASH 128-bit chống chỉnh sửa gói tin.",
    securityProperty:
      "Bộ đếm tuần tự 64-bit seq_num tăng đơn điệu cho từng bản ghi, đảm bảo Nonce không bao giờ lặp lại và ngăn chặn tấn công phát lại (Replay Attack) hoặc tráo thứ tự gói tin.",
  },
]

export function TlsHandshakeVisualizer({
  initialStep = 0,
  compact = false,
  className = "",
}) {
  const safeInitial = Math.min(
    TLS_STAGES.length - 1,
    Math.max(0, Number.isFinite(Number(initialStep)) ? Number(initialStep) : 0)
  )
  const [prevInitialStep, setPrevInitialStep] = useState(safeInitial)
  const [activeIndex, setActiveIndex] = useState(safeInitial)

  if (safeInitial !== prevInitialStep) {
    setPrevInitialStep(safeInitial)
    setActiveIndex(safeInitial)
  }
  const current = TLS_STAGES[activeIndex]

  return (
    <section
      aria-label="Trình mô phỏng bắt tay mật mã TLS 1.3 theo RFC 8446"
      className={`rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] overflow-hidden shadow-xs ${className}`.trim()}
    >
      {/* Header */}
      <div
        className={`${
          compact ? "px-4 py-3" : "px-5 py-3.5"
        } bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Lock
            className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0"
            strokeWidth={1.6}
          />
          <div className="min-w-0">
            <h3 className="font-mono-tech text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight truncate">
              TLS 1.3 HANDSHAKE STEPPER · RFC 8446
            </h3>
            {!compact && (
              <p className="font-sans text-[11px] text-[#475569] dark:text-[#94A3B8]">
                Sơ đồ trao đổi khóa 1-RTT ECDHE, cây dẫn xuất HKDF và kênh truyền AEAD
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono-tech text-[10px] px-2.5 py-1 rounded bg-white dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8] font-semibold whitespace-nowrap">
            {current.rfcSection}
          </span>
          <button
            type="button"
            onClick={() => setActiveIndex(0)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#0B0E14] text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] font-mono-tech text-[10px] whitespace-nowrap cursor-pointer transition-colors"
            title="Quay về bước đầu tiên"
          >
            <RotateCcw className="h-3 w-3 shrink-0" strokeWidth={1.6} />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      <div className={`${compact ? "p-4 space-y-4" : "p-5 sm:p-6 space-y-5"}`}>
        {/* 4-Stage Interactive Stepper Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {TLS_STAGES.map((stage, idx) => {
            const isSelected = idx === activeIndex
            const isDone = idx < activeIndex
            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#1D4ED8]/8 dark:bg-[#3B82F6]/14 border-[#1D4ED8] dark:border-[#3B82F6] text-[#0F172A] dark:text-[#F1F5F9]"
                    : isDone
                    ? "bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-200/80 dark:border-emerald-500/25 text-[#0F172A] dark:text-[#F1F5F9]"
                    : "bg-[#FAF9F6] dark:bg-[#0B0E14] border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8] hover:border-[#D0CCC3] dark:hover:border-white/[0.16]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono-tech text-[10px] font-semibold ${
                      isSelected
                        ? "text-[#1D4ED8] dark:text-[#38BDF8]"
                        : isDone
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-[#64748B] dark:text-[#94A3B8]"
                    }`}
                  >
                    GIAI ĐOẠN {stage.step}
                  </span>
                  {stage.encrypted ? (
                    <Lock className="h-3 w-3 text-[#64748B] dark:text-[#94A3B8]" strokeWidth={1.6} />
                  ) : (
                    <Unlock className="h-3 w-3 text-[#64748B] dark:text-[#94A3B8]" strokeWidth={1.6} />
                  )}
                </div>
                <div className="font-sans text-xs font-semibold mt-1 leading-snug">
                  {stage.shortTitle}
                </div>
              </button>
            )
          })}
        </div>

        {/* Interactive Client <-> Server Sequence Diagram */}
        <div className="p-4 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-3">
          {/* Swimlane Header */}
          <div className="grid grid-cols-12 items-center gap-2 pb-2.5 border-b border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="col-span-3 sm:col-span-2 text-center">
              <span className="inline-block px-2.5 py-1 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[11px] font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Client
              </span>
            </div>
            <div className="col-span-6 sm:col-span-8 text-center font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Luồng thông điệp giao thức (Nhấn từng bước để kiểm tra)
            </div>
            <div className="col-span-3 sm:col-span-2 text-center">
              <span className="inline-block px-2.5 py-1 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[11px] font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Server
              </span>
            </div>
          </div>

          {/* 4 Message Lanes */}
          <div className="space-y-2">
            {TLS_STAGES.map((stage, idx) => {
              const isSelected = idx === activeIndex
              return (
                <button
                  key={stage.step}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full grid grid-cols-12 items-center gap-2 px-2 py-2 rounded-md border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-white dark:bg-[#121722] border-[#1D4ED8]/50 dark:border-[#3B82F6]/50 shadow-2xs"
                      : "bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-[#121722]/60"
                  }`}
                >
                  <div className="col-span-3 sm:col-span-2 flex justify-center">
                    <span
                      className={`h-2.5 w-2.5 rounded-full border ${
                        isSelected
                          ? "bg-[#1D4ED8] dark:bg-[#3B82F6] border-transparent"
                          : idx < activeIndex
                          ? "bg-emerald-500 border-transparent"
                          : "bg-white dark:bg-[#161C2A] border-[#D0CCC3] dark:border-white/[0.2]"
                      }`}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-8 flex items-center justify-center gap-2 min-w-0">
                    {stage.direction === "server-to-client" && (
                      <ArrowLeft
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isSelected
                            ? "text-[#1D4ED8] dark:text-[#38BDF8]"
                            : "text-[#64748B] dark:text-[#94A3B8]"
                        }`}
                        strokeWidth={1.8}
                      />
                    )}
                    {stage.direction === "both" || stage.direction === "duplex" ? (
                      <ArrowLeftRight
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isSelected
                            ? "text-[#1D4ED8] dark:text-[#38BDF8]"
                            : "text-[#64748B] dark:text-[#94A3B8]"
                        }`}
                        strokeWidth={1.8}
                      />
                    ) : null}

                    <span
                      className={`font-mono-tech text-[11px] truncate ${
                        isSelected
                          ? "font-semibold text-[#0F172A] dark:text-[#F1F5F9]"
                          : "text-[#475569] dark:text-[#94A3B8]"
                      }`}
                    >
                      [{stage.step}] {stage.title}
                    </span>

                    {stage.direction === "client-to-server" && (
                      <ArrowRight
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isSelected
                            ? "text-[#1D4ED8] dark:text-[#38BDF8]"
                            : "text-[#64748B] dark:text-[#94A3B8]"
                        }`}
                        strokeWidth={1.8}
                      />
                    )}
                  </div>

                  <div className="col-span-3 sm:col-span-2 flex justify-center">
                    <span
                      className={`h-2.5 w-2.5 rounded-full border ${
                        isSelected
                          ? "bg-[#1D4ED8] dark:bg-[#3B82F6] border-transparent"
                          : idx < activeIndex
                          ? "bg-emerald-500 border-transparent"
                          : "bg-white dark:bg-[#161C2A] border-[#D0CCC3] dark:border-white/[0.2]"
                      }`}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Detailed Stage Inspection */}
        <div className="p-4 sm:p-5 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono-tech text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#1D4ED8] dark:bg-[#3B82F6] text-white whitespace-nowrap">
                {current.directionLabel}
              </span>
              <h4 className="font-sans text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                {current.title}
              </h4>
            </div>
            <span className="font-mono-tech text-[11px] text-[#475569] dark:text-[#94A3B8]">
              {current.recordState}
            </span>
          </div>

          {/* Wire Payload */}
          <div className="p-3 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[11px] text-[#1D4ED8] dark:text-[#38BDF8] leading-relaxed break-words">
            {current.wireMessage}
          </div>

          <p className="font-sans text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            {current.summary}
          </p>

          {/* Cryptographic Primitives & Mathematical Property */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2">
              <div className="flex items-center gap-1.5 font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                <KeyRound className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" strokeWidth={1.6} />
                <span>Thành phần mật mã học</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {current.primitives.map((primitive) => (
                  <span
                    key={primitive}
                    className="font-mono-tech text-[11px] px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9]"
                  >
                    {primitive}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] space-y-1.5">
              <div className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                {current.mathLabel}
              </div>
              <div className="font-mono-tech text-[11px] text-[#0F172A] dark:text-[#F1F5F9] break-words leading-relaxed">
                {current.mathFormula}
              </div>
            </div>
          </div>

          {/* Forward Secrecy & Security Guarantee */}
          <div className="p-3.5 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] flex items-start gap-2.5">
            <ShieldCheck
              className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5"
              strokeWidth={1.7}
            />
            <div className="text-xs leading-relaxed">
              <span className="font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Bảo chứng an toàn:{" "}
              </span>
              <span className="font-sans text-[#475569] dark:text-[#94A3B8]">
                {current.securityProperty}
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Footer Controls */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeIndex === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#121722] text-xs font-sans font-medium text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] disabled:opacity-40 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
            <span>Bước trước</span>
          </button>

          <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8] text-center">
            Giai đoạn {activeIndex + 1} / {TLS_STAGES.length}
          </span>

          <button
            type="button"
            onClick={() =>
              setActiveIndex((prev) => Math.min(TLS_STAGES.length - 1, prev + 1))
            }
            disabled={activeIndex === TLS_STAGES.length - 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1D4ED8] dark:bg-[#3B82F6] text-white text-xs font-sans font-medium hover:bg-[#1E40AF] dark:hover:bg-[#2563EB] disabled:opacity-40 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <span>Bước kế tiếp</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default TlsHandshakeVisualizer

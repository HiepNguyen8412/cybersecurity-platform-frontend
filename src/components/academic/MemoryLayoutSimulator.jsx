import { useId, useMemo, useState } from "react"
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"

const PAYLOAD_PRESETS = [
  { size: 12, label: "12B (An toàn)" },
  { size: 16, label: "16B (Khớp biên)" },
  { size: 24, label: "24B (Ghi đè Canary)" },
  { size: 40, label: "40B (Chiếm RIP)" },
]

const STACK_SEGMENTS = [
  {
    id: "buf",
    name: "char buf[16]",
    addr: "0x7fff..a0",
    offset: "+0x00",
    byteStart: 1,
    byteEnd: 16,
    capacity: 16,
    safeValue: '"cyber_ok\\0....."',
    role: "Bộ đệm cục bộ kích thước cố định 16 bytes",
  },
  {
    id: "padding",
    name: "Alignment Padding",
    addr: "0x7fff..b0",
    offset: "+0x10",
    byteStart: 17,
    byteEnd: 20,
    capacity: 4,
    safeValue: "0x00000000",
    role: "Vùng đệm căn chỉnh biên 4-byte trên khung x86_64",
  },
  {
    id: "canary",
    name: "Stack Canary",
    addr: "0x7fff..b4",
    offset: "+0x14",
    byteStart: 21,
    byteEnd: 28,
    capacity: 8,
    safeValue: "0xdeadbeef00",
    role: "Giá trị bảo vệ kiểm tra toàn vẹn trước lệnh ret",
  },
  {
    id: "rbp",
    name: "Saved RBP",
    addr: "0x7fff..bc",
    offset: "+0x1c",
    byteStart: 29,
    byteEnd: 36,
    capacity: 8,
    safeValue: "0x00007fffffffe100",
    role: "Con trỏ khung ngăn xếp của hàm gọi (Caller Frame)",
  },
  {
    id: "rip",
    name: "Return Address (RIP)",
    addr: "0x7fff..c4",
    offset: "+0x24",
    byteStart: 37,
    byteEnd: 44,
    capacity: 8,
    safeValue: "0x00000000004012a4",
    role: "Địa chỉ trả về — quyết định luồng thực thi CPU",
  },
]

function formatCorruptedValue(segment, writtenBytes) {
  if (writtenBytes < segment.byteStart) {
    return segment.safeValue
  }

  const overlap = Math.min(segment.capacity, writtenBytes - segment.byteStart + 1)
  if (segment.id === "buf") {
    const visibleChars = Math.min(14, overlap)
    return `"${"A".repeat(visibleChars)}${overlap >= 16 ? "" : "\\0"}"`
  }

  if (segment.id === "padding") {
    return `0x${"41".repeat(overlap).padEnd(8, "0")}`
  }

  if (segment.id === "canary") {
    const baseHex = "00deadbeef00"
    const corruptedTail = "41".repeat(Math.min(6, overlap))
    const preservedHead = baseHex.slice(0, Math.max(0, 12 - corruptedTail.length))
    return `0x${preservedHead}${corruptedTail}`
  }

  if (segment.id === "rip") {
    if (overlap >= 8) return "0x4141414141414141"
    const tail = "41".repeat(overlap)
    return `0x${"004012a4".slice(0, Math.max(0, 8 - overlap * 2))}${tail}`.slice(0, 18)
  }

  if (overlap >= 8) return "0x4141414141414141"
  return `0x00007fff${"41".repeat(Math.min(4, overlap)).padEnd(8, "0")}`
}

function ProtectionSwitch({ id, label, flag, checked, onToggle }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
        checked
          ? "bg-[#1D4ED8]/8 dark:bg-[#3B82F6]/12 border-[#1D4ED8]/40 dark:border-[#3B82F6]/40"
          : "bg-[#FAF9F6] dark:bg-[#0B0E14] border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#D0CCC3] dark:hover:border-white/[0.16]"
      }`}
    >
      <div className="min-w-0">
        <div className="font-sans text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] whitespace-nowrap">
          {label}
        </div>
        <div className="font-mono-tech text-[10px] text-[#64748B] dark:text-[#94A3B8] truncate">
          {flag}
        </div>
      </div>

      <span
        aria-hidden="true"
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors ${
          checked
            ? "bg-[#1D4ED8] dark:bg-[#3B82F6] border-transparent"
            : "bg-[#E5E2DC] dark:bg-[#1B2335] border-[#D0CCC3] dark:border-white/[0.12]"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-xs transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  )
}

export function MemoryLayoutSimulator({
  initialInputSize = 16,
  compact = false,
  className = "",
}) {
  const clampedInit = Math.min(48, Math.max(4, Number(initialInputSize) || 16))
  const [prevInitialSize, setPrevInitialSize] = useState(clampedInit)
  const [payloadSize, setPayloadSize] = useState(clampedInit)
  const [stackCanaryEnabled, setStackCanaryEnabled] = useState(true)
  const [nxEnabled, setNxEnabled] = useState(true)
  const [boundsCheckEnabled, setBoundsCheckEnabled] = useState(false)

  if (clampedInit !== prevInitialSize) {
    setPrevInitialSize(clampedInit)
    setPayloadSize(clampedInit)
  }

  const uid = useId()
  const sliderId = `memory-payload-size-${uid}`

  const simulation = useMemo(() => {
    const effectiveBytes = boundsCheckEnabled ? Math.min(payloadSize, 16) : payloadSize
    const overflowBytes = Math.max(0, effectiveBytes - 16)
    const paddingCorrupted = effectiveBytes >= 17
    const canaryCorrupted = effectiveBytes >= 21
    const rbpCorrupted = effectiveBytes >= 29
    const ripHijacked = effectiveBytes >= 37

    let status = "safe"
    let badgeText = "AN TOÀN · TRONG BIÊN buf[16]"
    let outcomeTitle = "Khung ngăn xếp nguyên vẹn (Execution Normal)"
    let outcomeDetail =
      "Dữ liệu nằm gọn trong vùng nhớ cấp phát char buf[16]. Con trỏ Saved RBP và địa chỉ trả về RIP không bị ảnh hưởng."

    if (boundsCheckEnabled && payloadSize > 16) {
      status = "mitigated"
      badgeText = "ĐÃ CÔ LẬP · strncpy CẮT NGƯỠNG 16B"
      outcomeTitle = "Phòng thủ chủ động: Chặn ghi tràn tại ranh giới bộ đệm (CWE-121 Mitigated)"
      outcomeDetail = `Đầu vào ${payloadSize} bytes bị hàm strncpy(buf, input, sizeof(buf) - 1) giới hạn tối đa 15 ký tự + ký tự kết thúc '\\0'. Không có byte nào tràn sang Alignment Padding hay Stack Canary.`
    } else if (canaryCorrupted && stackCanaryEnabled) {
      status = "canary_caught"
      badgeText = "SIGABRT · STACK CANARY PHÁT HIỆN GHI ĐÈ"
      outcomeTitle = "Ngắt tiến trình an toàn qua __stack_chk_fail() (CWE-121 Blocked)"
      outcomeDetail = `Payload ${effectiveBytes} bytes đã ghi đè ${Math.min(8, effectiveBytes - 20)} byte của Stack Canary (0xdeadbeef00). Trước lệnh ret, CPU đối chiếu Canary với giá trị gốc trong TLS (%fs:0x28) và phát hiện sai lệch -> hủy tiến trình trước khi RIP bị lợi dụng.`
    } else if (ripHijacked && nxEnabled) {
      status = "nx_blocked"
      badgeText = "SIGSEGV · NX/DEP CHẶN THỰC THI STACK"
      outcomeTitle = "RIP bị chiếm quyền (0x41414141...) nhưng NX/DEP chặn shellcode trên Stack"
      outcomeDetail =
        "Stack Canary đang tắt nên Return Address (RIP) bị ghi đè (CWE-121). Tuy nhiên, bit NX (No-Execute) đánh dấu trang nhớ Stack chỉ cho phép Read/Write (không Execute), khiến CPU ném ngoại lệ Page Fault. Lưu ý: kẻ tấn công vẫn có thể chuyển sang kỹ thuật ROP nếu thiếu ASLR/CFI."
    } else if (ripHijacked && !nxEnabled) {
      status = "critical"
      badgeText = "NGUY HIỂM · CHIẾM QUYỀN RIP & THỰC THI MÃ"
      outcomeTitle = "Lỗ hổng Stack Buffer Overflow nghiêm trọng (CWE-121 / CWE-787 RCE)"
      outcomeDetail =
        "Không có Bounds Check, Stack Canary và NX/DEP đều tắt: payload ghi đè hoàn toàn Saved RBP và Return Address (RIP). Khi hàm kết thúc (ret), CPU nhảy trực tiếp tới địa chỉ giả mạo trên Stack và thực thi shellcode."
    } else if (rbpCorrupted) {
      status = "warning"
      badgeText = "CẢNH BÁO · HỎNG SAVED RBP"
      outcomeTitle = "Con trỏ khung ngăn xếp Saved RBP bị ghi đè (CWE-787)"
      outcomeDetail = `Payload ${effectiveBytes} bytes vượt quá buf[16], phá hỏng Stack Canary (đã tắt) và ghi đè Saved RBP. Tiến trình sẽ sập (SIGSEGV) hoặc bị thao túng khung ngăn xếp ở hàm gọi trước (Frame Pointer Overwrite).`
    } else if (canaryCorrupted) {
      status = "warning"
      badgeText = "CẢNH BÁO · GHI ĐÈ VÙNG CANARY"
      outcomeTitle = "Ghi tràn qua vùng đệm vào vị trí Stack Canary (CWE-787)"
      outcomeDetail = `Payload ${effectiveBytes} bytes đã tràn ${overflowBytes} bytes ra ngoài buf[16]. Do cờ bảo vệ Stack Canary đang tắt (-fno-stack-protector), chương trình không phát hiện ghi đè trước khi thoát hàm.`
    } else if (paddingCorrupted) {
      status = "warning"
      badgeText = "CẢNH BÁO · TRÀN VÀO PADDING"
      outcomeTitle = "Ghi ngoài biên (Out-of-Bounds Write CWE-787)"
      outcomeDetail = `Payload ${effectiveBytes} bytes vượt quá 16 bytes của buf[16] và tràn ${overflowBytes} byte vào Alignment Padding. Chưa chạm tới RIP nhưng đã vi phạm ranh giới bộ nhớ.`
    }

    return {
      effectiveBytes,
      overflowBytes,
      paddingCorrupted,
      canaryCorrupted,
      rbpCorrupted,
      ripHijacked,
      status,
      badgeText,
      outcomeTitle,
      outcomeDetail,
    }
  }, [payloadSize, stackCanaryEnabled, nxEnabled, boundsCheckEnabled])

  const statusToneClass =
    simulation.status === "critical" || simulation.status === "nx_blocked"
      ? "bg-rose-50 dark:bg-rose-950/25 border-rose-200 dark:border-rose-500/35 text-rose-900 dark:text-rose-200"
      : simulation.status === "canary_caught" || simulation.status === "warning"
      ? "bg-amber-50 dark:bg-amber-950/25 border-amber-200 dark:border-amber-500/35 text-amber-900 dark:text-amber-200"
      : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200"

  const badgeToneClass =
    simulation.status === "critical" || simulation.status === "nx_blocked"
      ? "bg-rose-50 dark:bg-rose-950/35 border-rose-200 dark:border-rose-500/35 text-rose-700 dark:text-rose-300"
      : simulation.status === "canary_caught" || simulation.status === "warning"
      ? "bg-amber-50 dark:bg-amber-950/35 border-amber-200 dark:border-amber-500/35 text-amber-800 dark:text-amber-300"
      : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300"

  return (
    <section
      aria-label="Mô phỏng khung ngăn xếp bộ nhớ x86_64"
      className={`rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] overflow-hidden shadow-xs ${className}`.trim()}
    >
      {/* Header */}
      <div
        className={`${
          compact ? "px-4 py-3" : "px-5 py-3.5"
        } bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Layers
            className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0"
            strokeWidth={1.6}
          />
          <div className="min-w-0">
            <h3 className="font-mono-tech text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight truncate">
              x86_64 STACK FRAME SIMULATOR · CWE-121 / CWE-787
            </h3>
            {!compact && (
              <p className="font-sans text-[11px] text-[#475569] dark:text-[#94A3B8]">
                Mô phỏng ghi tràn bộ đệm ngăn xếp và cơ chế phòng vệ cấp trình biên dịch / phần cứng
              </p>
            )}
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 font-mono-tech text-[10px] font-semibold px-2.5 py-1 rounded border whitespace-nowrap ${badgeToneClass}`}
        >
          {simulation.status === "safe" || simulation.status === "mitigated" ? (
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
          )}
          <span>{simulation.badgeText}</span>
        </span>
      </div>

      {/* Body */}
      <div className={`${compact ? "p-4 space-y-4" : "p-5 sm:p-6 space-y-5"}`}>
        {/* Payload Byte Length Controls */}
        <div className="p-4 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor={sliderId}
              className="font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] font-medium"
            >
              Độ dài Payload ghi vào <code className="text-[#1D4ED8] dark:text-[#38BDF8]">buf[16]</code>
            </label>
            <div className="font-mono-tech text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
              Đầu vào:{" "}
              <span className="text-[#1D4ED8] dark:text-[#38BDF8]">{payloadSize} bytes</span>
              {boundsCheckEnabled && payloadSize > 16 && (
                <span className="text-emerald-700 dark:text-emerald-400 ml-1.5">
                  (Ghi thực tế: 16B)
                </span>
              )}
            </div>
          </div>

          <input
            id={sliderId}
            name="payloadByteLength"
            type="range"
            min={4}
            max={48}
            step={1}
            value={payloadSize}
            onChange={(e) => setPayloadSize(Number(e.target.value))}
            className="w-full accent-[#1D4ED8] dark:accent-[#3B82F6] cursor-pointer"
          />

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] shrink-0">
              Kịch bản mẫu:
            </span>
            {PAYLOAD_PRESETS.map((preset) => {
              const active = payloadSize === preset.size
              return (
                <button
                  key={preset.size}
                  type="button"
                  onClick={() => setPayloadSize(preset.size)}
                  className={`px-2.5 py-1 rounded border font-mono-tech text-[11px] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white border-transparent font-semibold"
                      : "bg-white dark:bg-[#121722] text-[#475569] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.08] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                  }`}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Compiler & Hardware Protections */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <ProtectionSwitch
            id={`canary-switch-${uid}`}
            label="Stack Canary"
            flag="-fstack-protector-strong"
            checked={stackCanaryEnabled}
            onToggle={() => setStackCanaryEnabled((prev) => !prev)}
          />
          <ProtectionSwitch
            id={`nx-switch-${uid}`}
            label="NX / DEP"
            flag="-z noexecstack (W^X)"
            checked={nxEnabled}
            onToggle={() => setNxEnabled((prev) => !prev)}
          />
          <ProtectionSwitch
            id={`bounds-switch-${uid}`}
            label="Bounds Check strncpy"
            flag="strncpy(buf, in, 15)"
            checked={boundsCheckEnabled}
            onToggle={() => setBoundsCheckEnabled((prev) => !prev)}
          />
        </div>

        {/* Stack Frame 5-Slot Layout */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono-tech uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] px-1">
            <span>↓ Địa chỉ thấp (Top of Stack)</span>
            <span>Hướng ghi tràn bộ đệm (Lower → Higher Addr)</span>
          </div>

          <div className="space-y-1.5">
            {STACK_SEGMENTS.map((segment) => {
              const written = simulation.effectiveBytes
              const isTouched = written >= segment.byteStart
              const isFullyFilled = written >= segment.byteEnd
              const isOverflown = segment.id !== "buf" && isTouched
              const isCriticalTarget =
                isOverflown &&
                (segment.id === "rip" ||
                  segment.id === "rbp" ||
                  (segment.id === "canary" && !stackCanaryEnabled))

              const canaryDisabledDim = segment.id === "canary" && !stackCanaryEnabled && !isTouched

              const fillPct =
                written < segment.byteStart
                  ? 0
                  : Math.min(
                      100,
                      Math.round(
                        ((Math.min(written, segment.byteEnd) - segment.byteStart + 1) /
                          segment.capacity) *
                          100
                      )
                    )

              return (
                <div
                  key={segment.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    isCriticalTarget
                      ? "bg-rose-50/75 dark:bg-rose-950/25 border-rose-300 dark:border-rose-500/40"
                      : isOverflown
                      ? "bg-amber-50/75 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/35"
                      : "bg-[#FAF9F6] dark:bg-[#0B0E14] border-[#E5E2DC] dark:border-white/[0.08]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8] shrink-0">
                        <div>[{segment.addr}]</div>
                        <div className="text-[10px] opacity-80">{segment.offset}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-sans text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                            {segment.name}
                          </span>
                          <span className="font-mono-tech text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                            ({segment.capacity}B)
                          </span>
                          {canaryDisabledDim && (
                            <span className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded bg-[#ECE9E2] dark:bg-[#1B2335] text-[#64748B] dark:text-[#94A3B8]">
                              TẮT
                            </span>
                          )}
                        </div>
                        <div className="font-sans text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                          {segment.role}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`font-mono-tech text-[11px] font-semibold px-2.5 py-1 rounded border ${
                          isCriticalTarget
                            ? "bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-200"
                            : isOverflown
                            ? "bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-200"
                            : "bg-white dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8]"
                        }`}
                      >
                        {formatCorruptedValue(segment, written)}
                      </span>
                    </div>
                  </div>

                  {/* Byte occupancy bar */}
                  <div className="mt-2 h-1.5 w-full rounded-full bg-[#E5E2DC] dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 ${
                        isCriticalTarget
                          ? "bg-rose-600 dark:bg-rose-500"
                          : isOverflown
                          ? "bg-amber-500"
                          : isFullyFilled
                          ? "bg-[#1D4ED8] dark:bg-[#3B82F6]"
                          : "bg-emerald-600 dark:bg-emerald-500"
                      }`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono-tech uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] px-1">
            <span>↑ Địa chỉ cao (Stack Base / Caller)</span>
            <span>
              NX/DEP: {nxEnabled ? "Khả dụng (Không thực thi Stack)" : "Vô hiệu (Cho phép exec Stack)"}
            </span>
          </div>
        </div>

        {/* Code Contrast & Runtime Diagnosis */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-5 p-3.5 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2">
            <div className="flex items-center gap-1.5 font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
              <Cpu className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" strokeWidth={1.6} />
              <span>Mã nguồn C đang mô phỏng</span>
            </div>
            <pre className="font-mono-tech text-[11px] leading-relaxed text-[#0F172A] dark:text-[#F1F5F9] whitespace-pre-wrap">
              {boundsCheckEnabled
                ? `char buf[16];\nstrncpy(buf, input, sizeof(buf) - 1);\nbuf[sizeof(buf) - 1] = '\\0';`
                : `char buf[16];\n// CWE-121: Không kiểm tra độ dài\nstrcpy(buf, input);`}
            </pre>
          </div>

          <div
            className={`md:col-span-7 p-3.5 rounded-lg border flex items-start gap-2.5 ${statusToneClass}`}
          >
            {simulation.status === "safe" || simulation.status === "mitigated" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={1.7} />
            ) : simulation.status === "nx_blocked" || simulation.status === "canary_caught" ? (
              <Ban className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={1.7} />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={1.7} />
            )}
            <div className="space-y-1 text-xs leading-relaxed">
              <div className="font-sans font-semibold">{simulation.outcomeTitle}</div>
              <p className="font-sans opacity-90">{simulation.outcomeDetail}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MemoryLayoutSimulator

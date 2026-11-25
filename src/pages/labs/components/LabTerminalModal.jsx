import { useState, useRef, useEffect, useCallback } from "react"
import { Terminal, X, Clock, RotateCcw, Copy, Check, CornerDownLeft } from "lucide-react"
import useLabStore from "../../../stores/useLabStore"
import useNotificationStore from "../../../stores/useNotificationStore"
import challengeService from "../../../services/challengeService"

const MITRE_KNOWLEDGE = {
  T1190: {
    name: "Exploit Public-Facing Application",
    tactic: "Initial Access (TA0001)",
    detection:
      "Giám sát nhật ký WAF/Reverse Proxy tìm mẫu bất thường (hex encoding, comment nội tuyến `/**/`), lỗi SQL cú pháp và thời gian phản hồi truy vấn tăng đột biến.",
    mitigation:
      "M1048 (Application Isolation), tách biệt ngữ cảnh dữ liệu bằng Prepared Statements / Parameterized Queries, áp dụng nguyên tắc đặc quyền tối thiểu cho tài khoản CSDL.",
    academicNote:
      "CWE-89 bắt nguồn từ việc trộn lẫn kênh dữ liệu (Data Plane) và kênh điều khiển (Control Plane) trong trình phân tích cú pháp SQL. Tham số hóa truy vấn khóa cấu trúc AST trước khi gắn giá trị đầu vào.",
  },
  "T1059.007": {
    name: "Command and Scripting Interpreter: JavaScript",
    tactic: "Execution (TA0002)",
    detection:
      "Theo dõi vi phạm báo cáo CSP (`report-to` / `Content-Security-Policy-Report-Only`), hành vi gán dữ liệu vào `innerHTML` hoặc `eval()` từ nguồn URL không tin cậy.",
    mitigation:
      "M1021 (Restrict Web-Based Content): sử dụng `textContent`, DOMPurify, bật `HttpOnly` cookie và cấu hình CSP `script-src 'nonce-...' 'strict-dynamic'`.",
    academicNote:
      "CWE-79 (DOM XSS) xảy ra khi dữ liệu từ Source (location.hash, search) đi qua Sink thực thi HTML/JS mà không qua mã hóa ngữ cảnh (Contextual Output Encoding).",
  },
  T1556: {
    name: "Modify Authentication Process",
    tactic: "Credential Access (TA0006) / Defense Evasion",
    detection:
      "Kiểm toán JWT header bất thường (`alg: none`, `alg: HS256` trên endpoint cấu hình RS256) và đối chiếu dấu vết chữ ký xác thực thất bại.",
    mitigation:
      "Cố định thuật toán xác minh ở phía máy chủ (Allow-list `RS256`/`EdDSA`), tuyệt đối không đọc trực tiếp trường `alg` từ token chưa kiểm chứng để chọn khóa.",
    academicNote:
      "Lỗi Key Confusion (CWE-327 / CWE-347) cho phép kẻ tấn công dùng Public Key RSA công khai làm khóa bí mật HMAC đối xứng để ký token giả mạo hợp lệ.",
  },
  T1055: {
    name: "Process Injection",
    tactic: "Defense Evasion (TA0005) / Privilege Escalation",
    detection:
      "Phân tích dump bộ nhớ RAM (Volatility `windows.malfind`, `pstree`) để tìm vùng trang nhớ có quyền `PAGE_EXECUTE_READWRITE` (RWX) không gắn với module trên đĩa.",
    mitigation:
      "Bật Attack Surface Reduction, giám sát API `VirtualAllocEx` / `WriteProcessMemory` / `CreateRemoteThread` qua Sysmon Event ID 8 và 10.",
    academicNote:
      "Pháp chứng bộ nhớ (DFIR) tập trung vào bảng VAD (Virtual Address Descriptor) và PEB để phát hiện DLL tiêm ẩn hoặc Process Hollowing không để lại tệp nhị phân trên ổ cứng.",
  },
  T1071: {
    name: "Application Layer Protocol (C2 / DNS Tunneling)",
    tactic: "Command and Control (TA0011)",
    detection:
      "Phát hiện entropy Shannon cao trong tên miền con DNS, truy vấn `TXT`/`NULL` lặp theo chu kỳ beacon cố định và lưu lượng outbound bất thường.",
    mitigation:
      "Triển khai chữ ký NIDS Suricata/Snort phân tích tầng ứng dụng, lọc egress DNS qua resolver nội bộ và kiểm soát TLS SNI.",
    academicNote:
      "Kênh truyền ngầm (Covert Channel) lợi dụng các giao thức được phép đi qua tường lửa như DNS/HTTP để trích xuất dữ liệu hoặc duy trì tín hiệu C2.",
  },
  "T1557.002": {
    name: "Adversary-in-the-Middle: ARP Cache Poisoning",
    tactic: "Credential Access / Collection",
    detection:
      "Theo dõi gói tin ARP Reply không có ARP Request tương ứng (Gratuitous ARP bất thường) và biến động ánh xạ IP-to-MAC trên switch.",
    mitigation:
      "Kích hoạt Dynamic ARP Inspection (DAI) kết hợp DHCP Snooping và Port Security trên switch truy cập lớp 2.",
    academicNote:
      "Giao thức ARP (RFC 826) không có cơ chế xác thực nguồn gốc bản tin lớp 2, khiến bảng ánh xạ IP-MAC dễ bị đầu độc để chuyển hướng lưu lượng LAN.",
  },
  "T1078.004": {
    name: "Valid Accounts: Cloud Accounts",
    tactic: "Privilege Escalation / Persistence",
    detection:
      "Giám sát CloudTrail lời gọi `sts:AssumeRole`, truy vấn bất thường tới `169.254.169.254` và hành vi sử dụng token tạm thời từ IP ngoài VPC.",
    mitigation:
      "Bắt buộc sử dụng IMDSv2 (`HttpTokens=required`, `HttpPutResponseHopLimit=1`), áp dụng nguyên tắc đặc quyền tối thiểu (Least Privilege) trên chính sách IAM.",
    academicNote:
      "Kết hợp lỗ hổng SSRF (CWE-918) với dịch vụ siêu dữ liệu IMDSv1 cho phép truy xuất chứng chỉ phiên IAM Role trực tiếp qua HTTP GET đơn giản.",
  },
  T1078: {
    name: "Valid Accounts & Broken Access Control",
    tactic: "Initial Access / Lateral Movement",
    detection:
      "Theo dõi chuỗi truy vấn tuần tự qua các định danh đối tượng (`/api/reports/1..N`) từ cùng một phiên người dùng thiếu quyền sở hữu.",
    mitigation:
      "Áp dụng kiểm tra phân quyền cấp đối tượng (Object-Level Authorization) trên máy chủ cho mọi endpoint, sử dụng UUID thay cho ID tự tăng dễ đoán.",
    academicNote:
      "CWE-639 (IDOR / BOLA) xảy ra khi ứng dụng xác thực danh tính người dùng (Authentication) nhưng bỏ qua kiểm tra quyền sở hữu tài nguyên (Authorization).",
  },
  T1573: {
    name: "Encrypted Channel (TLS 1.3 Audit)",
    tactic: "Command and Control / Protocol Security",
    detection:
      "Kiểm toán bắt tay TLS bằng `openssl s_client`, kiểm tra việc thương lượng cipher suite không hỗ trợ Forward Secrecy (RSA key transport) hoặc phiên bản TLS cũ.",
    mitigation:
      "Thực thi TLS 1.3 (RFC 8446) với trao đổi khóa ECDHE (X25519) và mã hóa AEAD (AES-256-GCM / ChaCha20-Poly1305), vô hiệu hóa TLS 1.0/1.1.",
    academicNote:
      "Hoàn hảo bảo mật chuyển tiếp (Perfect Forward Secrecy — PFS) đảm bảo khóa phiên tạm thời bị hủy sau kết nối, ngăn giải mã lưu lượng quá khứ ngay cả khi Private Key máy chủ bị lộ.",
  },
  T1600: {
    name: "Weaken Encryption (RSA Cryptanalysis)",
    tactic: "Defense Evasion / Cryptographic Weakness",
    detection:
      "Kiểm toán độ dài khóa RSA (< 2048 bit), tham số số mũ bí mật `d` nhỏ hoặc hai số nguyên tố `p, q` quá gần nhau khi sinh khóa.",
    mitigation:
      "Sinh khóa chuẩn CSPRNG theo NIST SP 800-57 (RSA >= 2048-bit hoặc ECC P-256/Curve25519), đảm bảo khoảng cách `|p - q|` an toàn.",
    academicNote:
      "Khi `|p - q|` nhỏ hơn `N^(1/4)`, phương pháp phân tích thừa số Fermat có thể tìm ra `p` và `q` chỉ trong vài bước lặp, phá vỡ hoàn toàn bảo mật của khóa công khai RSA.",
  },
  T1203: {
    name: "Exploitation for Client / Binary Execution",
    tactic: "Execution (TA0002)",
    detection:
      "Theo dõi tín hiệu lỗi phân đoạn bộ nhớ (`SIGSEGV`), cảnh báo Stack Smashing Detected từ Stack Canary và bất thường thanh ghi con trỏ lệnh `RIP`/`EIP`.",
    mitigation:
      "Biên dịch với cờ bảo vệ `-fstack-protector-strong`, `NX/DEP`, `PIE/ASLR`, và thay thế `strcpy`/`gets` bằng hàm kiểm soát biên `strncpy`/`snprintf`.",
    academicNote:
      "CWE-121 (Stack-Based Buffer Overflow) xảy ra khi ghi vượt kích thước bộ đệm trên ngăn xếp, làm ghi đè Saved RBP và Return Address (Saved RIP) để chiếm quyền điều khiển luồng thực thi.",
  },
}

const QUICK_COMMANDS = ["help", "nmap", "mitre", "academic-note", "exploit", "status", "clear"]

export function LabTerminalModal() {
  const {
    activeLab,
    isTerminalOpen,
    closeTerminal,
    isRunning,
    timeRemaining,
    terminalLogs,
    addLog,
    clearTerminal,
    submitFlag,
    recordServerSolve,
  } = useLabStore()

  const { success, error } = useNotificationStore()
  const [inputVal, setInputVal] = useState("")
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)

  const terminalEndRef = useRef(null)
  const inputRef = useRef(null)

  const handleClose = useCallback(() => {
    closeTerminal()
  }, [closeTerminal])

  useEffect(() => {
    if (!isTerminalOpen) return

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isTerminalOpen, handleClose])

  useEffect(() => {
    if (isTerminalOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" })
      inputRef.current?.focus()
    }
  }, [terminalLogs, isTerminalOpen])

  if (!isTerminalOpen || !activeLab) return null

  const formatTimer = (seconds) => {
    const safeSeconds = Math.max(0, Number(seconds) || 0)
    const mins = Math.floor(safeSeconds / 60)
    const secs = safeSeconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCopyIp = () => {
    const ip = activeLab.targetIp || "10.10.14.89"
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(ip).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const executeCommand = async (rawCommand) => {
    const cmd = rawCommand.trim()
    if (!cmd) return

    addLog(`researcher@sandbox:~# ${cmd}`, "prompt")
    setHistory((prev) => [cmd, ...prev.slice(0, 29)])
    setHistoryIdx(-1)
    setInputVal("")

    const parts = cmd.split(/\s+/)
    const mainCmd = parts[0].toLowerCase()
    const targetIp = activeLab.targetIp || "10.10.14.89"
    const targetPort = activeLab.targetPort || "8080"
    const mitreCode = activeLab.mitre || "T1190"
    const mitreProfile = MITRE_KNOWLEDGE[mitreCode] || {
      name: "Security Technique Analysis",
      tactic: "Vulnerability Research",
      detection: "Theo dõi nhật ký ứng dụng, lưu lượng mạng và telemetry hệ thống.",
      mitigation: "Áp dụng kiểm chứng đầu vào nghiêm ngặt và nguyên tắc đặc quyền tối thiểu.",
      academicNote:
        activeLab.description ||
        "Phân tích nguyên nhân gốc rễ (Root Cause) và triển khai lớp kiểm soát phòng thủ theo chuẩn OWASP/NIST.",
    }

    switch (mainCmd) {
      case "help":
        addLog("Danh sách lệnh Sandbox CLI khả dụng:", "system")
        addLog("  nmap [ip]          - Quét cổng và nhận diện dịch vụ/lỗ hổng", "stdout")
        addLog("  curl [url]         - Gửi truy vấn HTTP thăm dò endpoint mục tiêu", "stdout")
        addLog("  cat [file]         - Đọc tệp cấu hình hoặc nhật ký hệ thống", "stdout")
        addLog("  mitre              - Tra cứu phân tích MITRE ATT&CK® của bài thí nghiệm", "stdout")
        addLog("  academic-note      - Xem ghi chú học thuật, CWE và nguyên tắc khắc phục", "stdout")
        addLog("  exploit            - Kích hoạt vector kiểm thử lỗ hổng trong Sandbox", "stdout")
        addLog("  submit-flag [val]  - Nộp Flag đã thu hoạch để thẩm định điểm", "stdout")
        addLog("  status             - Kiểm tra trạng thái container và IP mục tiêu", "stdout")
        addLog("  clear              - Xóa sạch màn hình Terminal", "stdout")
        break

      case "mitre":
        addLog(`[MITRE ATT&CK® // ${mitreCode}] ${mitreProfile.name}`, "system")
        addLog(`  Chiến thuật (Tactic) : ${mitreProfile.tactic}`, "stdout")
        addLog(`  Thẻ kỹ thuật (Tags)  : ${(activeLab.tags || ["Security"]).join(", ")}`, "stdout")
        addLog(`  Phát hiện (Detect)   : ${mitreProfile.detection}`, "warning")
        addLog(`  Giảm thiểu (Mitigate): ${mitreProfile.mitigation}`, "success")
        break

      case "academic-note":
        addLog(`[GHI CHÚ HỌC THUẬT] ${activeLab.title}`, "system")
        addLog(`  Cơ chế bản chất      : ${mitreProfile.academicNote}`, "stdout")
        addLog(`  Khuyến nghị phòng thủ: ${mitreProfile.mitigation}`, "success")
        addLog(`  Tham chiếu bài Lab   : ${mitreCode} · ${(activeLab.tags || []).join(" · ")}`, "stdout")
        break

      case "nmap":
        addLog(`Khởi chạy tiến trình quét Nmap 7.94 nhắm vào mục tiêu ${parts[1] || targetIp}...`, "system")
        setTimeout(() => {
          addLog(`Báo cáo kết quả quét Nmap cho mục tiêu ${parts[1] || targetIp}:`, "stdout")
          addLog(`PORT     STATE SERVICE VERSION`, "stdout")
          addLog(`22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu`, "stdout")
          addLog(`80/tcp   open  http    nginx/1.24.0`, "stdout")
          addLog(`${targetPort}/tcp open  app-svc Target Lab Service`, "stdout")
          addLog(`Tham chiếu kỹ thuật: ${mitreCode} (${activeLab.title})`, "warning")
          addLog(
            `[GỢI Ý] Dùng 'mitre' / 'academic-note' để đọc phân tích lý thuyết, hoặc 'curl' / 'exploit' để kiểm thử.`,
            "stdout"
          )
        }, 250)
        break

      case "curl":
        addLog(`HTTP/1.1 200 OK`, "stdout")
        addLog(`Server: CyberPath-Sandbox/2.4`, "stdout")
        addLog(`Content-Type: application/json; charset=utf-8`, "stdout")
        addLog(
          `{"status":"active","target":"${activeLab.title}","mitre":"${mitreCode}","ref":"${
            activeLab.tags?.[0] || "CWE"
          }"}`,
          "stdout"
        )
        break

      case "cat":
        if (parts[1]) {
          addLog(`[FILE: ${parts[1]}]`, "stdout")
          addLog(`// Hệ thống tệp mô phỏng Sandbox cô lập`, "stdout")
          addLog(
            `DIAGNOSTIC: Phát hiện dấu hiệu cấu hình yếu liên quan tới ${
              activeLab.tags?.[0] || mitreCode
            }. Kiểm tra bằng lệnh 'exploit' hoặc 'academic-note'.`,
            "stdout"
          )
        } else {
          addLog("Cú pháp: cat <tên_tệp> (ví dụ: cat /var/log/auth.log)", "stdout")
        }
        break

      case "exploit":
        addLog(`[!] Đang thực thi kiểm chứng vector tấn công (${mitreCode})...`, "warning")
        setTimeout(() => {
          addLog(`[+] Payload kiểm thử đã tái hiện thành công điều kiện lỗ hổng.`, "success")
          if (activeLab.flag) {
            addLog(`>>> ĐÃ THU HOẠCH FLAG: ${activeLab.flag}`, "success")
            addLog(
              `[GỢI Ý] Dùng lệnh 'submit-flag ${activeLab.flag}' hoặc nhập vào thẻ nộp Flag trên trang.`,
              "system"
            )
          } else {
            addLog(`>>> ĐÃ THU HOẠCH FLAG MẪU (OFFLINE): FLAG{SANDBOX_DEMO_2026}`, "success")
            addLog(
              `[LƯU Ý] Thử thách kết nối máy chủ thực: nếu đã đăng nhập, hãy nộp Flag thực từ môi trường bài tập; hoặc dùng FLAG{SANDBOX_DEMO_2026} cho chế độ khách.`,
              "system"
            )
          }
        }, 300)
        break

      case "submit-flag": {
        const submittedFlag = parts.slice(1).join(" ").trim()
        if (!submittedFlag) {
          addLog("Cú pháp: submit-flag FLAG{...}", "stdout")
          break
        }

        if (activeLab.backendId) {
          try {
            const apiRes = await challengeService.submitFlag(activeLab.backendId, submittedFlag)
            if (apiRes?.success && apiRes.data) {
              if (apiRes.data.correct) {
                const earned = apiRes.data.alreadySolved
                  ? 0
                  : (apiRes.data.awardedPoints ?? activeLab.points ?? 0)
                recordServerSolve(activeLab.id, earned)
                const msg = apiRes.data.alreadySolved
                  ? "Thử thách đã được xác nhận hoàn thành trên máy chủ."
                  : `Xác thực Flag thành công trên máy chủ (+${earned} XP).`
                addLog(`[SUCCESS] ${msg}`, "success")
                success("Xác thực Flag thành công", msg)
                break
              }
              const errMsg = "Flag chưa chính xác. Hãy kiểm tra lại kết quả khai thác."
              addLog(`[FAILED] ${errMsg}`, "error")
              error("Flag không hợp lệ", errMsg)
              break
            }
          } catch {
            // Fall through to local validation below
          }
        }

        const localRes = submitFlag(activeLab.id, submittedFlag, activeLab)
        if (localRes.success) {
          addLog(`[SUCCESS] ${localRes.message}`, "success")
          success("Xác thực Flag thành công", localRes.message)
        } else {
          addLog(`[FAILED] ${localRes.message}`, "error")
          error("Flag không hợp lệ", localRes.message)
        }
        break
      }

      case "clear":
        clearTerminal()
        break

      case "status":
        addLog(`Bài thí nghiệm : ${activeLab.title} (${activeLab.id})`, "system")
        addLog(`IP mục tiêu    : ${targetIp}:${targetPort}`, "system")
        addLog(`MITRE ATT&CK®  : ${mitreCode}`, "stdout")
        addLog(`Trạng thái     : ${isRunning ? "ĐANG HOẠT ĐỘNG (Đã kết nối)" : "ĐÃ DỪNG"}`, "stdout")
        addLog(`Thời gian còn  : ${formatTimer(timeRemaining)}`, "stdout")
        break

      default:
        addLog(
          `bash: không tìm thấy lệnh '${mainCmd}'. Gõ 'help' để xem danh sách lệnh hỗ trợ.`,
          "stdout"
        )
        break
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      executeCommand(inputVal)
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length === 0) return
      const nextIdx = Math.min(historyIdx + 1, history.length - 1)
      setHistoryIdx(nextIdx)
      setInputVal(history[nextIdx])
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIdx <= 0) {
        setHistoryIdx(-1)
        setInputVal("")
      } else {
        const nextIdx = historyIdx - 1
        setHistoryIdx(nextIdx)
        setInputVal(history[nextIdx])
      }
    }
  }

  const handleViewportClick = () => {
    const selection = window.getSelection?.()?.toString()
    if (!selection) {
      inputRef.current?.focus()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-[#0F172A]/60 dark:bg-black/75 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-terminal-modal-title"
        className="relative w-full max-w-4xl h-[82vh] flex flex-col bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.1] rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Surrounding Modal Header (Editorial Light / Deep Obsidian Dark) */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/12 border border-blue-200 dark:border-blue-500/25 flex items-center justify-center text-[#1D4ED8] dark:text-[#38BDF8] shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2
                  id="lab-terminal-modal-title"
                  className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate max-w-[180px] sm:max-w-md"
                >
                  {activeLab.title}
                </h2>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono-tech font-semibold bg-white dark:bg-[#0B0E14] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08] whitespace-nowrap shrink-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isRunning ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{isRunning ? "SANDBOX: HOẠT ĐỘNG" : "SANDBOX: TẠM DỪNG"}</span>
                </span>
              </div>
              <div className="text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] truncate">
                MITRE {activeLab.mitre || "T1190"} · Mục tiêu {activeLab.targetIp || "10.10.14.89"}:
                {activeLab.targetPort || "8080"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Countdown Timer */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0B0E14] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.09] font-mono-tech text-xs font-semibold tabular-nums">
              <Clock className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span>{formatTimer(timeRemaining)}</span>
            </div>

            {/* Copy Target IP */}
            <button
              type="button"
              onClick={handleCopyIp}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF9F6] dark:bg-[#0B0E14] dark:hover:bg-[#1B2335] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.09] font-mono-tech text-xs transition-colors cursor-pointer"
              title="Sao chép địa chỉ IP mục tiêu"
              aria-label="Sao chép địa chỉ IP mục tiêu"
            >
              <span>{activeLab.targetIp || "10.10.14.89"}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Clear Terminal */}
            <button
              type="button"
              onClick={clearTerminal}
              className="p-1.5 rounded-lg bg-white hover:bg-[#FAF9F6] dark:bg-[#0B0E14] dark:hover:bg-[#1B2335] text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.09] transition-colors cursor-pointer"
              title="Xóa màn hình Terminal"
              aria-label="Xóa màn hình Terminal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-white hover:bg-rose-50 dark:bg-[#0B0E14] dark:hover:bg-rose-500/15 text-[#475569] dark:text-[#94A3B8] hover:text-rose-600 dark:hover:text-rose-400 border border-[#E5E2DC] dark:border-white/[0.09] transition-colors cursor-pointer"
              title="Đóng Terminal"
              aria-label="Đóng Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Helper Bar */}
        <div className="px-4 py-2 bg-[#FAF9F6] dark:bg-[#121722] border-b border-[#EFEDE7] dark:border-white/[0.06] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] shrink-0 mr-1">
            Lệnh nhanh:
          </span>
          {QUICK_COMMANDS.map((cmdName) => (
            <button
              key={cmdName}
              type="button"
              onClick={() => executeCommand(cmdName)}
              className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-mono-tech font-medium bg-white hover:bg-[#F3F1EC] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.08] transition-colors cursor-pointer"
            >
              {cmdName}
            </button>
          ))}
        </div>

        {/* Intentional Dark Console Viewport (#0B0E14) */}
        <div
          onClick={handleViewportClick}
          className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-1.5 bg-[#0B0E14] font-mono-tech text-xs sm:text-[13px] leading-relaxed select-text cursor-text"
        >
          {terminalLogs.map((log, idx) => {
            const isSystem = log.type === "system"
            const isSuccess = log.type === "success"
            const isWarning = log.type === "warning"
            const isError = log.type === "error"
            const isPrompt = log.type === "prompt"

            return (
              <div
                key={idx}
                className={
                  isSystem
                    ? "text-[#38BDF8]"
                    : isSuccess
                    ? "text-emerald-400 font-semibold"
                    : isWarning
                    ? "text-amber-400"
                    : isError
                    ? "text-rose-400 font-semibold"
                    : isPrompt
                    ? "text-[#F8FAFC] font-semibold"
                    : "text-slate-300"
                }
              >
                {log.text}
              </div>
            )
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Adaptive Command Input Bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#F3F1EC] dark:bg-[#161C2A] border-t border-[#E5E2DC] dark:border-white/[0.08]">
          <label
            htmlFor="lab-terminal-command-input"
            className="text-[#1D4ED8] dark:text-[#38BDF8] font-mono-tech font-semibold text-xs sm:text-sm select-none shrink-0"
          >
            researcher@sandbox:~#
          </label>
          <input
            ref={inputRef}
            id="lab-terminal-command-input"
            name="labTerminalCommand"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập lệnh 'help', 'mitre', 'academic-note', 'exploit' hoặc 'submit-flag FLAG{...}'..."
            aria-label="Nhập lệnh dòng lệnh Sandbox"
            className="flex-1 min-w-0 bg-transparent text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none font-mono-tech text-xs sm:text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={() => executeCommand(inputVal)}
            disabled={!inputVal.trim()}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#2563EB] dark:hover:bg-[#3B82F6] text-white transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>Thực thi</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LabTerminalModal

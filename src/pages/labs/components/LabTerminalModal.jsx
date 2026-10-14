import { useState, useRef, useEffect } from "react"
import { Terminal, X, Clock, RotateCcw, Copy, Check } from "lucide-react"
import useLabStore from "../../../stores/useLabStore"
import useNotificationStore from "../../../stores/useNotificationStore"

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
  } = useLabStore()

  const { success, error } = useNotificationStore()
  const [inputVal, setInputVal] = useState("")
  const [copied, setCopied] = useState(false)
  const terminalEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto scroll to latest output
  useEffect(() => {
    if (isTerminalOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" })
      inputRef.current?.focus()
    }
  }, [terminalLogs, isTerminalOpen])

  if (!isTerminalOpen || !activeLab) return null

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCopyIp = () => {
    navigator.clipboard.writeText(activeLab.targetIp || "10.10.14.89")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCommand = (e) => {
    if (e.key !== "Enter") return
    const cmd = inputVal.trim()
    if (!cmd) return

    // Log prompt with user command
    addLog(`root@kali-sandbox:~# ${cmd}`, "prompt")
    setInputVal("")

    const parts = cmd.split(" ")
    const mainCmd = parts[0].toLowerCase()
    const targetIp = activeLab.targetIp || "10.10.14.89"

    switch (mainCmd) {
      case "help":
        addLog("Available Sandbox CLI Commands:", "system")
        addLog("  nmap [ip]         - Run aggressive vulnerability port scanner", "stdout")
        addLog("  curl [url]        - Query HTTP target endpoint with custom headers", "stdout")
        addLog("  cat [file]        - Read target configuration or exploit source", "stdout")
        addLog("  exploit           - Trigger attack payload against discovered sink", "stdout")
        addLog("  submit-flag [val] - Submit captured flag directly to validator", "stdout")
        addLog("  status            - Display target sandbox container health & IP", "stdout")
        addLog("  clear             - Reset terminal viewport", "stdout")
        break

      case "nmap":
        addLog(`Starting Nmap 7.94 scan against ${targetIp}...`, "system")
        setTimeout(() => {
          addLog(`Nmap scan report for ${targetIp}:`, "stdout")
          addLog(`PORT     STATE SERVICE VERSION`, "stdout")
          addLog(`22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu`, "stdout")
          addLog(`80/tcp   open  http    nginx/1.18.0`, "stdout")
          addLog(`${activeLab.targetPort || "8080"}/tcp open  http-api Vulnerable Service v1.4`, "stdout")
          addLog(`Vulnerability detected: ${activeLab.mitre || "T1190"} (${activeLab.title})`, "warning")
          addLog(`[HINT] Try inspect payload with 'curl http://${targetIp}:${activeLab.targetPort || "8080"}' or run 'exploit'`, "stdout")
        }, 300)
        break

      case "curl":
        addLog(`HTTP/1.1 200 OK`, "stdout")
        addLog(`Server: Cyber-Sandbox/2.4`, "stdout")
        addLog(`Content-Type: application/json; charset=utf-8`, "stdout")
        addLog(`{"status": "vulnerable", "target": "${activeLab.title}", "cwe": "${activeLab.tags?.[0] || 'CWE-89'}"}`, "stdout")
        break

      case "cat":
        if (parts[1]) {
          addLog(`[FILE: ${parts[1]}]`, "stdout")
          addLog(`// Security Sandbox simulated filesystem`, "stdout")
          addLog(`FLAG_HINT: Target memory dump reveals token prefix: FLAG{...}`, "stdout")
        } else {
          addLog("Usage: cat <filename> (e.g., cat /var/log/auth.log)", "stdout")
        }
        break

      case "exploit":
        addLog(`[!] Injecting exploit vector targeting ${activeLab.mitre || "T1190"}...`, "warning")
        setTimeout(() => {
          addLog(`[+] Exploit payload successfully executed!`, "success")
          addLog(`[+] Privilege escalated to root! Memory dump extracted:`, "success")
          addLog(`>>> CAPTURED FLAG: ${activeLab.flag || "FLAG{EXP_V4L1D_2026}"}`, "success")
          addLog(`[TIP] Copy the flag above and use 'submit-flag <FLAG>' or the form on the right!`, "system")
        }, 400)
        break

      case "submit-flag":
        if (parts[1]) {
          const res = submitFlag(activeLab.id, parts[1])
          if (res.success) {
            addLog(`[SUCCESS] ${res.message}`, "success")
            success("Nghiệm thu Flag thành công!", res.message)
          } else {
            addLog(`[FAILED] ${res.message}`, "error")
            error("Xác thực Flag thất bại", res.message)
          }
        } else {
          addLog("Usage: submit-flag FLAG{...}", "stdout")
        }
        break

      case "clear":
        clearTerminal()
        break

      case "status":
        addLog(`Active Lab: ${activeLab.title} (ID: ${activeLab.id})`, "system")
        addLog(`Target IP : ${targetIp}:${activeLab.targetPort || "8080"}`, "system")
        addLog(`Status    : ${isRunning ? "RUNNING (Connected)" : "STOPPED"}`, "stdout")
        addLog(`Remaining : ${formatTimer(timeRemaining)}`, "stdout")
        break

      default:
        addLog(`bash: command not found: ${mainCmd}. Type 'help' for command list.`, "stdout")
        break
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[80vh] flex flex-col bg-slate-950 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-pulse" />
            </div>
            <div className="flex items-center space-x-2 text-cyan-400 font-semibold">
              <Terminal className="w-4 h-4" />
              <span className="truncate max-w-[200px] sm:max-w-md">{activeLab.title}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Countdown timer */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-amber-400 border border-amber-500/20">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-bold">{formatTimer(timeRemaining)}</span>
            </div>

            {/* Target IP chip */}
            <button
              onClick={handleCopyIp}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Click to copy IP"
            >
              <span>{activeLab.targetIp || "10.10.14.89"}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* Clear button */}
            <button
              onClick={clearTerminal}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Clear View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              onClick={closeTerminal}
              className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Logs Viewport */}
        <div className="flex-1 p-4 overflow-y-auto space-y-1.5 text-sm leading-relaxed text-slate-200 select-text">
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
                    ? "text-cyan-400/90"
                    : isSuccess
                    ? "text-emerald-400 font-bold"
                    : isWarning
                    ? "text-amber-400"
                    : isError
                    ? "text-rose-400 font-semibold"
                    : isPrompt
                    ? "text-slate-100 font-semibold"
                    : "text-slate-300"
                }
              >
                {log.text}
              </div>
            )
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Command Input Bar */}
        <div className="flex items-center px-4 py-3 bg-slate-900 border-t border-slate-800">
          <span className="text-emerald-400 font-bold mr-2 select-none">root@kali-sandbox:~#</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleCommand}
            placeholder="Type 'help', 'nmap', 'exploit', or 'submit-flag FLAG{...}'"
            className="flex-1 bg-transparent text-white focus:outline-none font-mono text-sm caret-cyan-400 placeholder-slate-600"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}

export default LabTerminalModal

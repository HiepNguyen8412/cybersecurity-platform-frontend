import { create } from "zustand"

/**
 * useLabStore
 * Manages virtual interactive lab session state, CLI logs, countdown timers, and flag validation.
 */
export const useLabStore = create((set, get) => ({
  activeLab: null,
  isTerminalOpen: false,
  isRunning: false,
  timeRemaining: 2100, // 35 minutes in seconds
  timerInterval: null,
  terminalLogs: [],
  labCatalog: [],
  completedLabs: ["lab-05"], // default one completed for initial showcase
  userPoints: 1250,

  // Register current catalog labs so local flag verification knows each lab's expected flag & points
  setLabCatalog: (labs) => {
    set({ labCatalog: Array.isArray(labs) ? labs : [] })
  },

  // Sync solved lab IDs fetched from authenticated backend responses without duplicate points
  syncSolvedLabs: (solvedIds = []) => {
    if (!Array.isArray(solvedIds) || solvedIds.length === 0) return
    set((state) => {
      const merged = new Set(state.completedLabs)
      let changed = false
      solvedIds.forEach((id) => {
        if (id && !merged.has(id)) {
          merged.add(id)
          changed = true
        }
      })
      return changed ? { completedLabs: Array.from(merged) } : state
    })
  },

  // Record a verified flag submission confirmed by the live backend API
  recordServerSolve: (labId, awardedPoints = 0) => {
    const { completedLabs, userPoints } = get()
    if (!labId) return { alreadySolved: false }

    if (completedLabs.includes(labId)) {
      return { alreadySolved: true }
    }

    const pointsToAdd = Number.isFinite(Number(awardedPoints)) ? Number(awardedPoints) : 0
    set({
      completedLabs: [...completedLabs, labId],
      userPoints: userPoints + Math.max(0, pointsToAdd),
    })
    return { alreadySolved: false, points: pointsToAdd }
  },

  // Launch a new or existing lab session
  startLab: (lab) => {
    if (get().timerInterval) {
      clearInterval(get().timerInterval)
    }

    const durationSeconds =
      Number.isFinite(Number(lab?.durationMinutes)) && Number(lab.durationMinutes) > 0
        ? Number(lab.durationMinutes) * 60
        : 2100

    const initialLogs = [
      {
        text: `[HỆ THỐNG] Đang khởi tạo môi trường Sandbox cô lập cho "${lab?.title || "Phòng Thí Nghiệm"}"...`,
        type: "system",
      },
      {
        text: `[MẠNG LƯỚI] Đã cấp phát địa chỉ mục tiêu: ${lab?.targetIp || "10.10.14.89"} (Cổng: ${lab?.targetPort || "8080"})`,
        type: "system",
      },
      {
        text: `[KỸ THUẬT] Tham chiếu MITRE ATT&CK®: ${lab?.mitre || "T1190"}`,
        type: "system",
      },
      {
        text: `[TRẠNG THÁI] Container thực nghiệm đã sẵn sàng. Gõ 'help' để xem danh sách lệnh CLI.`,
        type: "success",
      },
    ]

    const interval = setInterval(() => {
      const { timeRemaining, stopLab } = get()
      if (timeRemaining <= 1) {
        stopLab()
      } else {
        set({ timeRemaining: timeRemaining - 1 })
      }
    }, 1000)

    set({
      activeLab: lab,
      isRunning: true,
      isTerminalOpen: true,
      timeRemaining: durationSeconds,
      timerInterval: interval,
      terminalLogs: initialLogs,
    })
  },

  // Terminate active lab session
  stopLab: () => {
    if (get().timerInterval) {
      clearInterval(get().timerInterval)
    }
    set((state) => ({
      isRunning: false,
      timerInterval: null,
      terminalLogs: [
        ...state.terminalLogs,
        {
          text: "[HỆ THỐNG] Phiên thực hành đã kết thúc và tài nguyên container đã được thu hồi.",
          type: "system",
        },
      ],
    }))
  },

  openTerminal: () => set({ isTerminalOpen: true }),
  closeTerminal: () => set({ isTerminalOpen: false }),

  // Append new output/input log to terminal
  addLog: (text, type = "stdout") => {
    set((state) => ({
      terminalLogs: [
        ...state.terminalLogs,
        { text, type, timestamp: new Date().toLocaleTimeString("vi-VN") },
      ],
    }))
  },

  clearTerminal: () => {
    set({
      terminalLogs: [
        {
          text: "[HỆ THỐNG] Đã làm mới màn hình Terminal. Gõ 'help' để xem danh sách lệnh.",
          type: "system",
        },
      ],
    })
  },

  // Validate and submit flag locally (used directly for local labs or as fallback when backend is unavailable/401)
  submitFlag: (labId, flagInput, labMeta = null) => {
    const { activeLab, labCatalog, completedLabs, userPoints } = get()
    const targetLab =
      labMeta ||
      (activeLab && activeLab.id === labId ? activeLab : null) ||
      labCatalog.find((item) => item.id === labId || item.backendId === labId) ||
      null

    const cleanFlag = String(flagInput || "").trim()

    if (!/^FLAG\{.+\}$/.test(cleanFlag)) {
      return {
        success: false,
        message: "Sai định dạng! Flag phải tuân theo chuẩn FLAG{...}",
      }
    }

    if (completedLabs.includes(labId)) {
      return {
        success: false,
        message: "Bạn đã hoàn thành và ghi nhận điểm cho bài thí nghiệm này.",
      }
    }

    const expectedFlag = targetLab?.flag
    const isCorrect = expectedFlag
      ? cleanFlag === expectedFlag
      : cleanFlag === "FLAG{SANDBOX_DEMO_2026}" || cleanFlag.length >= 12

    if (isCorrect) {
      const earned = targetLab?.points || 400
      set({
        completedLabs: [...completedLabs, labId],
        userPoints: userPoints + earned,
      })
      return {
        success: true,
        message: `Xác thực Flag thành công (+${earned} XP).`,
        points: earned,
      }
    }

    return {
      success: false,
      message: "Flag chưa chính xác. Hãy kiểm tra lại kết quả khai thác trong Terminal.",
    }
  },
}))

export default useLabStore

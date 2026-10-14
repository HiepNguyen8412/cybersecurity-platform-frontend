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
  completedLabs: ["lab-05"], // default one completed for realistic demo
  userPoints: 1250,

  // Launch a new or existing lab session
  startLab: (lab) => {
    // Clear any existing timer
    if (get().timerInterval) {
      clearInterval(get().timerInterval)
    }

    const initialLogs = [
      { text: `[SYSTEM] Provisioning secure sandbox environment for "${lab.title}"...`, type: "system" },
      { text: `[NETWORK] Assigned virtual target IP: ${lab.targetIp || "10.10.14.89"} (Port: ${lab.targetPort || "8080"})`, type: "system" },
      { text: `[STATUS] Attack container ready. Type 'help' for available CLI commands.`, type: "success" },
      { text: `root@kali-sandbox:~# `, type: "prompt" },
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
      timeRemaining: 2100,
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
        { text: "[SYSTEM] Lab session terminated and resources deallocated.", type: "system" },
      ],
    }))
  },

  openTerminal: () => set({ isTerminalOpen: true }),
  closeTerminal: () => set({ isTerminalOpen: false }),

  // Append new output/input log to terminal
  addLog: (text, type = "stdout") => {
    set((state) => ({
      terminalLogs: [...state.terminalLogs, { text, type, timestamp: new Date().toLocaleTimeString() }],
    }))
  },

  clearTerminal: () => {
    set({
      terminalLogs: [{ text: "root@kali-sandbox:~# ", type: "prompt" }],
    })
  },

  // Validate and submit flag
  submitFlag: (labId, flagInput) => {
    const { activeLab, completedLabs, userPoints } = get()
    const targetLab = activeLab && activeLab.id === labId ? activeLab : null
    const cleanFlag = flagInput.trim()

    if (!cleanFlag.startsWith("FLAG{") || !cleanFlag.endsWith("}")) {
      return {
        success: false,
        message: "Sai định dạng! Flag phải tuân theo chuẩn FLAG{...}",
      }
    }

    if (completedLabs.includes(labId)) {
      return {
        success: false,
        message: "Bạn đã giải xong và nhận điểm bài Lab này rồi!",
      }
    }

    // Check if matching lab flag (or generic fallback match)
    const expectedFlag = targetLab?.flag
    const isCorrect = expectedFlag ? cleanFlag === expectedFlag : cleanFlag.length >= 10

    if (isCorrect) {
      const earned = targetLab?.points || 400
      set({
        completedLabs: [...completedLabs, labId],
        userPoints: userPoints + earned,
      })
      return {
        success: true,
        message: `Chính xác! Flag được xác nhận thành công. Bạn nhận được +${earned} điểm thưởng!`,
        points: earned,
      }
    }

    return {
      success: false,
      message: "Flag không chính xác! Hãy kiểm tra lại kết quả khai thác trong Terminal.",
    }
  },
}))

export default useLabStore

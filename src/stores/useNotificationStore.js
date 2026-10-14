import { create } from "zustand"

/**
 * useNotificationStore
 * Global Toast Notification Management Store
 */
export const useNotificationStore = create((set, get) => ({
  notifications: [],

  addNotification: ({ type = "info", title = "", message = "", duration = 4000 }) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7)
    const newNotification = { id, type, title, message, duration }

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, duration)
    }

    return id
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearAll: () => set({ notifications: [] }),

  // Convenient helper functions
  success: (title, message = "") =>
    get().addNotification({ type: "success", title, message }),

  error: (title, message = "") =>
    get().addNotification({ type: "error", title, message, duration: 6000 }),

  warning: (title, message = "") =>
    get().addNotification({ type: "warning", title, message, duration: 5000 }),

  info: (title, message = "") =>
    get().addNotification({ type: "info", title, message }),
}))

export default useNotificationStore

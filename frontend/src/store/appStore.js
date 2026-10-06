import { create } from "zustand";

let notificationId = 0;

export const useAppStore = create((set) => ({
  notifications: [],
  loading: {},
  addNotification: (notification) => {
    const id = ++notificationId;
    set((state) => ({ notifications: [...state.notifications, { id, type: "info", ...notification }] }));
    return id;
  },
  removeNotification: (id) =>
    set((state) => ({ notifications: state.notifications.filter((item) => item.id !== id) })),
  clearNotifications: () => set({ notifications: [] }),
  setLoading: (key, isLoading) =>
    set((state) => ({ loading: { ...state.loading, [key]: Boolean(isLoading) } })),
  clearLoading: (key) =>
    set((state) => {
      const loading = { ...state.loading };
      delete loading[key];
      return { loading };
    }),
}));

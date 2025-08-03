import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,

      setUser: (userData) =>
        set(() => ({
          user: userData,
        })),

      setToken: (token) =>
        set(() => ({
          token,
        })),

      setRefreshToken: (refreshToken) =>
        set(() => ({
          refreshToken,
        })),

      logout: () =>
        set(() => ({
          user: null,
          token: null,
          refreshToken: null,
        })),

      updateProfile: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
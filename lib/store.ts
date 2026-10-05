import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
};

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

/** 로그인 세션 상태 (sessionStorage에 persist하여 새로고침 시 유지) */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "airdust_auth",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
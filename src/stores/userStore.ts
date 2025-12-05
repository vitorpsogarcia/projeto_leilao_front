import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../models/user";

type UserStore = {
  user: User | null;
  clearUser: () => void;
  setUser: (user: User) => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "usuario",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;

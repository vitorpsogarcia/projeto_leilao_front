import { create } from "zustand";
import type { User } from "../models/user";

type UserStore = {
  user: User | null;
  clearUser: () => void;
  setUser: (user: User) => void;
  loadUserFromStorage: () => void;
};

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => {
    localStorage.setItem("usuario", JSON.stringify(user));
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem("usuario");
    set({ user: null });
  },
  loadUserFromStorage: () => {
    try {
      const usuario = localStorage.getItem("usuario");
      if (usuario) {
        const userData = JSON.parse(usuario);
        set({ user: userData });
      }
    } catch (error) {
      console.error("Erro ao carregar usuário do localStorage:", error);
      localStorage.removeItem("usuario");
    }
  },
}));

export default useUserStore;

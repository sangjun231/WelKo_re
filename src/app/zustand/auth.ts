import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface userState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<userState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));



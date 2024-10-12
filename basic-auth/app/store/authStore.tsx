import { create } from "zustand";
import { User } from "firebase/auth";

// Define the AuthState interface
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Create the auth store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  logout: () => set({ user: null }),
}));

import { create } from 'zustand';
import { User } from 'firebase/auth';
import { UserRole } from '@/types';

interface AuthState {
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setUserRole: (role: UserRole | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userRole: null,
  isLoading: true,
  error: null,
  setUser: (user) => set({ user, isLoading: false, error: null }),
  setUserRole: (userRole) => set({ userRole }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  logout: () => set({ user: null, userRole: null, isLoading: false, error: null }),
  clearError: () => set({ error: null }),
}));
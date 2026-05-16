import { create } from 'zustand';
import { User } from '../../shared/types/bank';

interface AuthState { token: string | null; user: User | null; setToken: (token: string | null) => void; setUser: (user: User | null) => void; logout: () => void }
export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('bb_token'), user: null,
  setToken: (token) => { token ? localStorage.setItem('bb_token', token) : localStorage.removeItem('bb_token'); set({ token }); },
  setUser: (user) => set({ user }),
  logout: () => { localStorage.removeItem('bb_token'); set({ token: null, user: null }); }
}));

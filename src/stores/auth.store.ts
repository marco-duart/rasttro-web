import { create } from 'zustand';

interface AuthUser {
  id: string;
  email: string;
  isSuperAdmin: boolean;
  createdAt: string;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isBootstrapping: boolean;
  setSession: (accessToken: string, user?: AuthUser | null) => void;
  setUser: (user: AuthUser) => void;
  clear: () => void;
  setBootstrapped: () => void;
}

const REFRESH_TOKEN_KEY = 'rasttro:refreshToken';

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isBootstrapping: true,
  setSession: (accessToken, user) => set((state) => ({ accessToken, user: user ?? state.user })),
  setUser: (user) => set({ user }),
  clear: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    set({ accessToken: null, user: null });
  },
  setBootstrapped: () => set({ isBootstrapping: false }),
}));

export function saveRefreshToken(token: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

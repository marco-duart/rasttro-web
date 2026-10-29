import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore, getRefreshToken, saveRefreshToken, clearRefreshToken } from '../stores/auth.store';
import { useClubStore } from '../stores/club.store';
import { env } from '../config/env';

export const http = axios.create({
  baseURL: `${env.VITE_API_URL}/api/v1`,
});

http.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  const { currentClubId } = useClubStore.getState();

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  if (currentClubId && !config.headers.get('x-club-id')) {
    config.headers.set('x-club-id', currentClubId);
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
      `${http.defaults.baseURL}/auth/refresh`,
      { refreshToken },
    );
    useAuthStore.getState().setSession(data.accessToken);
    saveRefreshToken(data.refreshToken);
    return data.accessToken;
  } catch {
    clearRefreshToken();
    useAuthStore.getState().clear();
    return null;
  }
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && original && !original._retry && !original.url?.includes('/auth/')) {
      original._retry = true;
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.set('Authorization', `Bearer ${newToken}`);
        return http(original);
      }
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/entrar')) {
        window.location.href = '/entrar';
      }
    }

    // Membro desligado (ou inativo/suspenso) no meio da sessão: sai do clube e volta para a escolha de clube,
    // onde ele aparece como "Acesso encerrado".
    if (
      error.response?.status === 403 &&
      (error.response.data as { code?: string } | undefined)?.code === 'MEMBER_INACTIVE' &&
      typeof window !== 'undefined' &&
      window.location.pathname !== '/selecionar-clube'
    ) {
      useClubStore.getState().setCurrentClubId(null);
      window.location.href = '/selecionar-clube';
    }

    return Promise.reject(error);
  },
);

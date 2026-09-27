import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authApi, type LoginInput, type SignupClubInput } from './api';
import { useAuthStore, saveRefreshToken, getRefreshToken, clearRefreshToken } from '../../stores/auth.store';
import { useClubStore } from '../../stores/club.store';
import { toast } from '../../stores/toast.store';
import type { AuthTokenResponse } from '../../api/types';

function applySession(data: AuthTokenResponse) {
  useAuthStore.getState().setSession(data.accessToken, data.user ?? null);
  saveRefreshToken(data.refreshToken);
}

export function useSignupClub() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (input: SignupClubInput) => authApi.signupClub(input),
    onSuccess: (data) => {
      applySession(data);
      if (data.club) useClubStore.getState().setCurrentClubId(data.club.id);
      toast.success(`Clube "${data.club?.name}" criado! Bem-vindo ao Rasttro.`);
      navigate('/', { replace: true });
    },
  });
}

export function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (data) => {
      applySession(data);
      navigate('/selecionar-clube', { replace: true });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  return () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) authApi.logout(refreshToken).catch(() => undefined);
    clearRefreshToken();
    useAuthStore.getState().clear();
    useClubStore.getState().setCurrentClubId(null);
    navigate('/entrar', { replace: true });
  };
}

export function useMyClubs() {
  return useQuery({ queryKey: ['clubs', 'mine'], queryFn: authApi.myClubs });
}

export function useBootstrapSession() {
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const accessToken = useAuthStore((s) => s.accessToken);

  const query = useQuery({
    queryKey: ['auth', 'bootstrap'],
    queryFn: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return null;
      const data = await authApi.refresh(refreshToken);
      useAuthStore.getState().setSession(data.accessToken);
      saveRefreshToken(data.refreshToken);
      const me = await authApi.me();
      useAuthStore.getState().setUser(me);
      return me;
    },
    enabled: isBootstrapping,
    retry: false,
  });

  useEffect(() => {
    if (!query.isLoading && isBootstrapping) useAuthStore.getState().setBootstrapped();
  }, [query.isLoading, isBootstrapping]);

  return { isBootstrapping: isBootstrapping && query.isLoading, isAuthenticated: Boolean(accessToken) };
}

export function useCurrentUser() {
  return useAuthStore((s) => s.user);
}

export { toast };

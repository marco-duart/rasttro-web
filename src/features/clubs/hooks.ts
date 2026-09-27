import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clubsApi } from './api';
import { useClubStore } from '../../stores/club.store';
import { toast } from '../../stores/toast.store';

export function useCurrentClub() {
  const currentClubId = useClubStore((s) => s.currentClubId);
  return useQuery({
    queryKey: ['clubs', 'current', currentClubId],
    queryFn: clubsApi.current,
    enabled: Boolean(currentClubId),
    staleTime: 60_000,
  });
}

export function useCurrentPermissions() {
  const currentClubId = useClubStore((s) => s.currentClubId);
  const query = useQuery({
    queryKey: ['clubs', 'current', 'permissions', currentClubId],
    queryFn: clubsApi.currentPermissions,
    enabled: Boolean(currentClubId),
    staleTime: 60_000,
  });
  const permissions = new Set(query.data?.permissions ?? []);
  return {
    ...query,
    has: (...keys: string[]) => keys.some((k) => permissions.has(k)),
  };
}

export function useChapters() {
  return useQuery({ queryKey: ['chapters'], queryFn: clubsApi.listChapters });
}

export function useUpdateClub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clubsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', 'current'] });
      toast.success('Configurações do clube atualizadas.');
    },
  });
}

export function useCreateChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clubsApi.createChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      toast.success('Regional criado.');
    },
  });
}

export function useUpdateChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Parameters<typeof clubsApi.updateChapter>[1]) =>
      clubsApi.updateChapter(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      toast.success('Regional atualizado.');
    },
  });
}

export function useRemoveChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clubsApi.removeChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      toast.success('Regional removido.');
    },
  });
}

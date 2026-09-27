import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { titlesApi } from './api';
import { toast } from '../../stores/toast.store';

export function useTitles() {
  return useQuery({ queryKey: ['titles'], queryFn: titlesApi.list });
}

export function useMemberTitles(memberId: string | undefined) {
  return useQuery({
    queryKey: ['titles', 'member', memberId],
    queryFn: () => titlesApi.listForMember(memberId as string),
    enabled: Boolean(memberId),
  });
}

export function useMyTitles() {
  return useQuery({ queryKey: ['titles', 'me'], queryFn: titlesApi.myTitles });
}

export function useCreateTitle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: titlesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles'] });
      toast.success('Título criado.');
    },
  });
}

export function useUpdateTitle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Parameters<typeof titlesApi.update>[1]) => titlesApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles'] });
      toast.success('Título atualizado.');
    },
  });
}

export function useRemoveTitle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: titlesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Título removido.');
    },
  });
}

export function useAwardTitle(memberId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { titleId: string; notes?: string }) => titlesApi.award(memberId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles', 'member', memberId] });
      queryClient.invalidateQueries({ queryKey: ['members', 'detail', memberId] });
      queryClient.invalidateQueries({ queryKey: ['titles'] });
      toast.success('Título atribuído.');
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? 'Não foi possível atribuir o título.');
    },
  });
}

export function useRevokeTitle(memberId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (titleId: string) => titlesApi.revoke(memberId, titleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles', 'member', memberId] });
      queryClient.invalidateQueries({ queryKey: ['members', 'detail', memberId] });
      queryClient.invalidateQueries({ queryKey: ['titles'] });
      toast.success('Título revogado.');
    },
  });
}

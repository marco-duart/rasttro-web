import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from './api';
import { toast } from '../../stores/toast.store';

export function useRoles() {
  return useQuery({ queryKey: ['roles'], queryFn: rolesApi.list });
}

export function usePermissionCatalog() {
  return useQuery({ queryKey: ['roles', 'permission-catalog'], queryFn: rolesApi.permissionCatalog, staleTime: Infinity });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Cargo criado.');
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Parameters<typeof rolesApi.update>[1]) => rolesApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Cargo atualizado.');
    },
  });
}

export function useRemoveRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Cargo removido.');
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? 'Não foi possível remover o cargo.');
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesApi.assign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Cargo atribuído.');
    },
  });
}

export function useEndRoleAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesApi.endAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Cargo encerrado.');
    },
  });
}

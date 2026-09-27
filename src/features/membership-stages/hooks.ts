import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stagesApi } from './api';
import { toast } from '../../stores/toast.store';

export function useMembershipStages() {
  return useQuery({ queryKey: ['membership-stages'], queryFn: stagesApi.list });
}

export function useStageRequirements(stageId?: string) {
  return useQuery({
    queryKey: ['membership-stages', 'requirements', stageId],
    queryFn: () => stagesApi.listRequirements(stageId),
  });
}

export function useCreateStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stagesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-stages'] });
      toast.success('Estágio criado.');
    },
  });
}

export function useUpdateStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Parameters<typeof stagesApi.update>[1]) => stagesApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-stages'] });
      toast.success('Estágio atualizado.');
    },
  });
}

export function useRemoveStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stagesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-stages'] });
      toast.success('Estágio removido.');
    },
  });
}

export function useCreateRequirement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stagesApi.createRequirement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-stages', 'requirements'] });
      toast.success('Requisito adicionado.');
    },
  });
}

export function useRemoveRequirement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stagesApi.removeRequirement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-stages', 'requirements'] });
      toast.success('Requisito removido.');
    },
  });
}

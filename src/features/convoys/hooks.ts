import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { convoysApi } from './api';
import { toast } from '../../stores/toast.store';
import type { ConvoyParticipantStatus, ConvoyRole, ConvoyStopType } from '../../api/types';

export function useConvoys(upcoming?: boolean) {
  return useQuery({ queryKey: ['convoys', { upcoming }], queryFn: () => convoysApi.list(upcoming) });
}

export function useConvoy(id: string | undefined) {
  return useQuery({ queryKey: ['convoys', id], queryFn: () => convoysApi.findOne(id as string), enabled: Boolean(id) });
}

export function useConvoyStatusBoard(id: string | undefined) {
  return useQuery({
    queryKey: ['convoys', id, 'status-board'],
    queryFn: () => convoysApi.statusBoard(id as string),
    enabled: Boolean(id),
    refetchInterval: 15_000,
  });
}

function useInvalidateConvoy(id: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['convoys', id] });
    queryClient.invalidateQueries({ queryKey: ['convoys'] });
  };
}

export function useCreateConvoy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: convoysApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convoys'] });
      toast.success('Comboio criado.');
    },
  });
}

export function useAddStop(convoyId: string) {
  const invalidate = useInvalidateConvoy(convoyId);
  return useMutation({
    mutationFn: (input: { sequence: number; type: ConvoyStopType; location: string }) => convoysApi.addStop(convoyId, input),
    onSuccess: invalidate,
  });
}

export function useAssignConvoyRole(convoyId: string) {
  const invalidate = useInvalidateConvoy(convoyId);
  return useMutation({
    mutationFn: (input: { memberId: string; role: ConvoyRole }) => convoysApi.assignRole(convoyId, input),
    onSuccess: invalidate,
  });
}

export function useUnassignConvoyRole(convoyId: string) {
  const invalidate = useInvalidateConvoy(convoyId);
  return useMutation({
    mutationFn: (assignmentId: string) => convoysApi.unassignRole(convoyId, assignmentId),
    onSuccess: invalidate,
  });
}

export function useJoinConvoy(convoyId: string) {
  const invalidate = useInvalidateConvoy(convoyId);
  return useMutation({
    mutationFn: (motorcycleId?: string) => convoysApi.join(convoyId, motorcycleId),
    onSuccess: () => {
      invalidate();
      toast.success('Você entrou no comboio!');
    },
  });
}

export function useCheckInConvoy(convoyId: string) {
  const invalidate = useInvalidateConvoy(convoyId);
  return useMutation({
    mutationFn: () => convoysApi.checkIn(convoyId),
    onSuccess: () => {
      invalidate();
      toast.success('Check-in feito no ponto de encontro!');
    },
  });
}

export function useUpdateParticipant(convoyId: string) {
  const invalidate = useInvalidateConvoy(convoyId);
  return useMutation({
    mutationFn: ({ participantId, status }: { participantId: string; status: ConvoyParticipantStatus }) =>
      convoysApi.updateParticipant(convoyId, participantId, status),
    onSuccess: invalidate,
  });
}

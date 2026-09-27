import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { membersApi, type ListMembersParams } from './api';
import { useClubStore } from '../../stores/club.store';
import { toast } from '../../stores/toast.store';
import type { CreateMemberDto } from '../../api/generated/models/CreateMemberDto';
import type { MemberStatus } from '../../api/types';

const clubKey = () => useClubStore.getState().currentClubId;

export function useMembers(params: ListMembersParams) {
  return useQuery({
    queryKey: ['members', clubKey(), params],
    queryFn: () => membersApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useMember(id: string | undefined) {
  return useQuery({
    queryKey: ['members', 'detail', id],
    queryFn: () => membersApi.findOne(id as string),
    enabled: Boolean(id),
  });
}

export function useMemberTimeline(id: string | undefined) {
  return useQuery({
    queryKey: ['members', 'timeline', id],
    queryFn: () => membersApi.timeline(id as string),
    enabled: Boolean(id),
  });
}

export function useMemberRequirements(id: string | undefined) {
  return useQuery({
    queryKey: ['members', 'requirements', id],
    queryFn: () => membersApi.requirements(id as string),
    enabled: Boolean(id),
  });
}

export function useMemberMotorcycles(id: string | undefined) {
  return useQuery({
    queryKey: ['members', 'motorcycles', id],
    queryFn: () => membersApi.motorcycles(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMemberDto) => membersApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Membro cadastrado.');
    },
  });
}

export function useUpdateMember(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<CreateMemberDto> & { status?: MemberStatus }) => membersApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Membro atualizado.');
    },
  });
}

export function useDeactivateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => membersApi.deactivate(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Membro desligado.');
    },
  });
}

export function useChangeMemberStage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { stageId: string; sponsorMemberId?: string; notes?: string }) => membersApi.changeStage(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Estágio atualizado.');
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { meetingsApi } from './api';
import { toast } from '../../stores/toast.store';
import type { AttendanceStatus } from '../../api/types';

export function useMeetings() {
  return useQuery({ queryKey: ['meetings'], queryFn: meetingsApi.list });
}

export function useMeeting(id: string | undefined) {
  return useQuery({ queryKey: ['meetings', id], queryFn: () => meetingsApi.findOne(id as string), enabled: Boolean(id) });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: meetingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast.success('Reunião criada — convocação enviada a todos os membros ativos.');
    },
  });
}

export function useMarkAttendance(meetingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { memberId: string; status: AttendanceStatus; justification?: string }) => meetingsApi.markAttendance(meetingId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meetings', meetingId] }),
  });
}

export function useCheckInMeeting(meetingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => meetingsApi.checkIn(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings', meetingId] });
      toast.success('Presença confirmada!');
    },
  });
}

export function useAddDecision(meetingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (description: string) => meetingsApi.addDecision(meetingId, description),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meetings', meetingId] }),
  });
}

export function useUpsertMinute(meetingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { content: string; isFinal?: boolean }) => meetingsApi.upsertMinute(meetingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings', meetingId] });
      toast.success('Ata salva.');
    },
  });
}

export function useRemoveMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: meetingsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast.success('Reunião cancelada.');
    },
  });
}

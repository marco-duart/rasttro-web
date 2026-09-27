import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from './api';
import { toast } from '../../stores/toast.store';
import type { RsvpStatus } from '../../api/types';

export function useEvents(upcoming?: boolean) {
  return useQuery({ queryKey: ['events', { upcoming }], queryFn: () => eventsApi.list(upcoming) });
}

export function useEvent(id: string | undefined) {
  return useQuery({ queryKey: ['events', id], queryFn: () => eventsApi.findOne(id as string), enabled: Boolean(id) });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Evento criado.');
    },
  });
}

export function useCancelEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Evento cancelado.');
    },
  });
}

export function useRsvpEvent(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { status: RsvpStatus; guestCount?: number }) => eventsApi.rsvp(eventId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      toast.success('Presença atualizada.');
    },
  });
}

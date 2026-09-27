import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { announcementsApi } from './api';
import { toast } from '../../stores/toast.store';

export function useAnnouncementsFeed() {
  return useQuery({ queryKey: ['announcements', 'me'], queryFn: announcementsApi.myFeed });
}

export function useAllAnnouncements() {
  return useQuery({ queryKey: ['announcements', 'all'], queryFn: announcementsApi.listAll });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Comunicado publicado.');
    },
  });
}

export function useRemoveAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Comunicado removido.');
    },
  });
}

import { http } from '../../api/http';
import type { Announcement, AnnouncementAudience, AnnouncementPriority } from '../../api/types';

export const announcementsApi = {
  myFeed: () => http.get<Announcement[]>('/announcements/me').then((r) => r.data),
  listAll: () => http.get<Announcement[]>('/announcements').then((r) => r.data),
  create: (input: { title: string; body: string; audience?: AnnouncementAudience; priority?: AnnouncementPriority; requiresConfirmation?: boolean }) =>
    http.post<Announcement>('/announcements', input).then((r) => r.data),
  remove: (id: string) => http.delete(`/announcements/${id}`).then((r) => r.data),
  markRead: (id: string) => http.post(`/announcements/${id}/read`).then((r) => r.data),
  confirm: (id: string) => http.post(`/announcements/${id}/confirm`).then((r) => r.data),
};

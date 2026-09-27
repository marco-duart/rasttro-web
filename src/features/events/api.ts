import { http } from '../../api/http';
import type { EventEntity, EventType, RsvpStatus } from '../../api/types';

export const eventsApi = {
  list: (upcoming?: boolean) => http.get<EventEntity[]>('/events', { params: { upcoming } }).then((r) => r.data),
  findOne: (id: string) => http.get<EventEntity>(`/events/${id}`).then((r) => r.data),
  create: (input: { title: string; type?: EventType; description?: string; startsAt: string; location?: string }) =>
    http.post<EventEntity>('/events', input).then((r) => r.data),
  cancel: (id: string) => http.delete(`/events/${id}`).then((r) => r.data),
  rsvp: (id: string, input: { status: RsvpStatus; guestCount?: number }) => http.post(`/events/${id}/rsvp`, input).then((r) => r.data),
  attendanceSummary: (id: string) => http.get(`/events/${id}/attendance-summary`).then((r) => r.data),
};

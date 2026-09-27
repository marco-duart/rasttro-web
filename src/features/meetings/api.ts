import { http } from '../../api/http';
import type { AttendanceStatus, Meeting, MeetingType } from '../../api/types';

export const meetingsApi = {
  list: () => http.get<Meeting[]>('/meetings').then((r) => r.data),
  findOne: (id: string) => http.get<Meeting>(`/meetings/${id}`).then((r) => r.data),
  create: (input: { title: string; type?: MeetingType; startsAt: string; location?: string; agenda?: string; mandatory?: boolean }) =>
    http.post<Meeting>('/meetings', input).then((r) => r.data),
  update: (id: string, input: Partial<{ title: string; startsAt: string; location: string; agenda: string; status: string }>) =>
    http.patch<Meeting>(`/meetings/${id}`, input).then((r) => r.data),
  remove: (id: string) => http.delete(`/meetings/${id}`).then((r) => r.data),
  markAttendance: (id: string, input: { memberId: string; status: AttendanceStatus; justification?: string }) =>
    http.post(`/meetings/${id}/attendance`, input).then((r) => r.data),
  checkIn: (id: string) => http.post(`/meetings/${id}/check-in`).then((r) => r.data),
  addDecision: (id: string, description: string) => http.post(`/meetings/${id}/decisions`, { description }).then((r) => r.data),
  upsertMinute: (id: string, input: { content: string; isFinal?: boolean }) => http.post(`/meetings/${id}/minute`, input).then((r) => r.data),
};

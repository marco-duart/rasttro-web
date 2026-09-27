import { http } from '../../api/http';
import type { Convoy, ConvoyRole, ConvoyStatusBoard, ConvoyStopType, ConvoyParticipantStatus } from '../../api/types';

export const convoysApi = {
  list: (upcoming?: boolean) => http.get<Convoy[]>('/convoys', { params: { upcoming } }).then((r) => r.data),
  findOne: (id: string) => http.get<Convoy>(`/convoys/${id}`).then((r) => r.data),
  create: (input: { departureAt: string; meetingPoint: string; destination?: string; routeUrl?: string; eventId?: string }) =>
    http.post<Convoy>('/convoys', input).then((r) => r.data),
  cancel: (id: string) => http.delete(`/convoys/${id}`).then((r) => r.data),
  statusBoard: (id: string) => http.get<ConvoyStatusBoard>(`/convoys/${id}/status-board`).then((r) => r.data),
  addStop: (id: string, input: { sequence: number; type: ConvoyStopType; location: string; estimatedAt?: string }) =>
    http.post(`/convoys/${id}/stops`, input).then((r) => r.data),
  removeStop: (id: string, stopId: string) => http.delete(`/convoys/${id}/stops/${stopId}`).then((r) => r.data),
  assignRole: (id: string, input: { memberId: string; role: ConvoyRole }) => http.post(`/convoys/${id}/assignments`, input).then((r) => r.data),
  unassignRole: (id: string, assignmentId: string) => http.delete(`/convoys/${id}/assignments/${assignmentId}`).then((r) => r.data),
  join: (id: string, motorcycleId?: string) => http.post(`/convoys/${id}/join`, { motorcycleId }).then((r) => r.data),
  leave: (id: string) => http.post(`/convoys/${id}/leave`).then((r) => r.data),
  checkIn: (id: string) => http.post(`/convoys/${id}/check-in`).then((r) => r.data),
  updateParticipant: (id: string, participantId: string, status: ConvoyParticipantStatus) =>
    http.patch(`/convoys/${id}/participants/${participantId}`, { status }).then((r) => r.data),
};

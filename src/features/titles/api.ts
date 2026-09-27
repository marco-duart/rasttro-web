import { http } from '../../api/http';
import type { Member, MemberTitle, Title } from '../../api/types';

export const titlesApi = {
  list: () => http.get<Title[]>('/titles').then((r) => r.data),
  create: (input: { name: string; description?: string; color?: string }) =>
    http.post<Title>('/titles', input).then((r) => r.data),
  update: (id: string, input: Partial<{ name: string; description: string; color: string }>) =>
    http.patch<Title>(`/titles/${id}`, input).then((r) => r.data),
  remove: (id: string) => http.delete(`/titles/${id}`).then((r) => r.data),

  listForMember: (memberId: string) => http.get<MemberTitle[]>(`/members/${memberId}/titles`).then((r) => r.data),
  award: (memberId: string, input: { titleId: string; notes?: string }) =>
    http.post<MemberTitle>(`/members/${memberId}/titles`, input).then((r) => r.data),
  revoke: (memberId: string, titleId: string) => http.delete(`/members/${memberId}/titles/${titleId}`).then((r) => r.data),

  myTitles: () => http.get<MemberTitle[]>('/members/me/titles').then((r) => r.data),
  setMyDisplayTitle: (titleId: string | null) =>
    http.patch<Member>('/members/me/display-title', { titleId }).then((r) => r.data),
};

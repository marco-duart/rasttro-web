import { http } from '../../api/http';
import type { AuthTokenResponse, Invite } from '../../api/types';

export interface InvitePreview {
  club: { name: string; logoUrl: string | null; slug: string };
  chapter: { name: string } | null;
  roleOnAccept: string | null;
  expiresAt: string;
}

export interface AcceptInviteInput {
  fullName: string;
  email?: string;
  password?: string;
}

export const invitesApi = {
  preview: (code: string) => http.get<InvitePreview>(`/invites/public/${code}`).then((r) => r.data),
  accept: (code: string, input: AcceptInviteInput) =>
    http.post<AuthTokenResponse>(`/invites/public/${code}/accept`, input).then((r) => r.data),
  list: () => http.get<Invite[]>('/invites').then((r) => r.data),
  create: (input: { chapterId?: string; roleIdOnAccept?: string; membershipStageIdOnAccept?: string; expiresInDays?: number }) =>
    http.post<Invite>('/invites', input).then((r) => r.data),
  revoke: (id: string) => http.delete(`/invites/${id}`).then((r) => r.data),
};

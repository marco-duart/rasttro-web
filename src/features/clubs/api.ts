import { http } from '../../api/http';
import type { Chapter, Club, PixKeyType } from '../../api/types';

export const clubsApi = {
  current: () => http.get<Club>('/clubs/current').then((r) => r.data),
  currentPermissions: () => http.get<{ permissions: string[] }>('/clubs/current/permissions').then((r) => r.data),
  update: (input: Partial<Pick<Club, 'name' | 'legalName' | 'description' | 'primaryColor' | 'secondaryColor' | 'email' | 'phone'>>) =>
    http.patch<Club>('/clubs/current', input).then((r) => r.data),
  setBrandingImage: (kind: 'logo' | 'cover', publicId: string) =>
    http.put<Club>(`/clubs/current/${kind}`, { publicId }).then((r) => r.data),
  removeBrandingImage: (kind: 'logo' | 'cover') => http.delete<Club>(`/clubs/current/${kind}`).then((r) => r.data),
  updatePaymentSettings: (input: {
    pixKeyType?: PixKeyType;
    pixKey?: string | null;
    pixRecipientName?: string;
    pixCity?: string;
    paymentInstructions?: string | null;
  }) => http.patch<Club>('/clubs/current/payment-settings', input).then((r) => r.data),
  listChapters: () => http.get<Chapter[]>('/chapters').then((r) => r.data),
  createChapter: (input: { name: string; code?: string; city?: string; state?: string }) =>
    http.post<Chapter>('/chapters', input).then((r) => r.data),
  updateChapter: (id: string, input: Partial<{ name: string; code: string; city: string; state: string }>) =>
    http.patch<Chapter>(`/chapters/${id}`, input).then((r) => r.data),
  removeChapter: (id: string) => http.delete(`/chapters/${id}`).then((r) => r.data),
};

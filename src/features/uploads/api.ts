import axios from 'axios';
import { http } from '../../api/http';

export type UploadPurpose = 'member_avatar' | 'club_logo' | 'club_cover' | 'motorcycle_photo';

export interface UploadTicket {
  uploadUrl: string;
  fields: Record<string, string>;
  publicId: string;
  expiresAt: string;
  maxBytes: number;
}

export const uploadsApi = {
  createTicket: (input: { purpose: UploadPurpose; targetId?: string }) =>
    http.post<UploadTicket>('/uploads/tickets', input).then((r) => r.data),
  sendToStorage: (ticket: UploadTicket, file: File, onProgress: (ratio: number) => void) => {
    const form = new FormData();
    Object.entries(ticket.fields).forEach(([key, value]) => form.append(key, value));
    form.append('file', file);
    return axios.post(ticket.uploadUrl, form, {
      onUploadProgress: (event) => onProgress(event.total ? event.loaded / event.total : 0),
    });
  },
};

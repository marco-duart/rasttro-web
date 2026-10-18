import { http } from '../../api/http';

export type CheckInTarget = 'meeting' | 'event' | 'convoy';

const QR_PATH: Record<CheckInTarget, string> = {
  meeting: 'meetings',
  event: 'events',
  convoy: 'convoys',
};

export interface CheckInQr {
  token: string;
  expiresAt: string;
  url: string;
  qrDataUrl: string;
}

export interface CheckInResult {
  type: CheckInTarget;
  targetId: string;
  title: string;
  alreadyCheckedIn: boolean;
  memberName: string;
}

export interface CheckInSummary {
  checkedIn: number;
  recent: string[];
}

export const checkInApi = {
  issue: (target: CheckInTarget, id: string) =>
    http.post<CheckInQr>(`/${QR_PATH[target]}/${id}/check-in-qr`).then((r) => r.data),
  redeem: (token: string) => http.post<CheckInResult>('/check-in', { token }).then((r) => r.data),
  summary: (target: CheckInTarget, id: string) =>
    http.get<CheckInSummary>('/check-in/summary', { params: { type: target, id } }).then((r) => r.data),
};

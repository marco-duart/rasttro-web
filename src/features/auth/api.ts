import { http } from '../../api/http';
import type { AuthTokenResponse, AuthUser, MyClub } from '../../api/types';

export interface SignupClubInput {
  email: string;
  password: string;
  fullName: string;
  clubName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  signupClub: (input: SignupClubInput) => http.post<AuthTokenResponse>('/auth/signup-club', input).then((r) => r.data),
  login: (input: LoginInput) => http.post<AuthTokenResponse>('/auth/login', input).then((r) => r.data),
  refresh: (refreshToken: string) =>
    http.post<AuthTokenResponse>('/auth/refresh', { refreshToken }).then((r) => r.data),
  logout: (refreshToken: string) => http.post('/auth/logout', { refreshToken }).then((r) => r.data),
  me: () => http.get<AuthUser>('/auth/me').then((r) => r.data),
  changePassword: (currentPassword: string, newPassword: string) =>
    http.post('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),
  myClubs: () => http.get<MyClub[]>('/clubs/mine').then((r) => r.data),
};

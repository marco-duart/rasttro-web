import { http } from '../../api/http';
import type { Role, RoleAssignment, PermissionScope } from '../../api/types';

export interface RolePermissionInput {
  permission: string;
  scope: PermissionScope;
}

export const rolesApi = {
  permissionCatalog: () => http.get<string[]>('/roles/permission-catalog').then((r) => r.data),
  list: () => http.get<Role[]>('/roles').then((r) => r.data),
  create: (input: { name: string; description?: string; color?: string; rank?: number; permissions: RolePermissionInput[] }) =>
    http.post<Role>('/roles', input).then((r) => r.data),
  update: (id: string, input: Partial<{ name: string; description: string; color: string; rank: number; permissions: RolePermissionInput[] }>) =>
    http.patch<Role>(`/roles/${id}`, input).then((r) => r.data),
  remove: (id: string) => http.delete(`/roles/${id}`).then((r) => r.data),
  assign: (input: { memberId: string; roleId: string; chapterId?: string; startsAt?: string }) =>
    http.post<RoleAssignment>('/roles/assignments', input).then((r) => r.data),
  endAssignment: (id: string) => http.delete(`/roles/assignments/${id}`).then((r) => r.data),
};

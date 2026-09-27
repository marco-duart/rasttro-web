import { http } from '../../api/http';
import type { MembershipStage, MembershipRequirement } from '../../api/types';

export const stagesApi = {
  list: () => http.get<MembershipStage[]>('/membership-stages').then((r) => r.data),
  create: (input: { name: string; order: number; isProspectStage?: boolean; isEffectiveStage?: boolean }) =>
    http.post<MembershipStage>('/membership-stages', input).then((r) => r.data),
  update: (id: string, input: Partial<{ name: string; order: number; isProspectStage: boolean; isEffectiveStage: boolean; isActive: boolean }>) =>
    http.patch<MembershipStage>(`/membership-stages/${id}`, input).then((r) => r.data),
  remove: (id: string) => http.delete(`/membership-stages/${id}`).then((r) => r.data),
  listRequirements: (stageId?: string) =>
    http.get<MembershipRequirement[]>('/membership-stages/requirements', { params: { stageId } }).then((r) => r.data),
  createRequirement: (input: { stageId: string; description: string; targetCount?: number; isMandatory?: boolean }) =>
    http.post<MembershipRequirement>('/membership-stages/requirements', input).then((r) => r.data),
  removeRequirement: (id: string) => http.delete(`/membership-stages/requirements/${id}`).then((r) => r.data),
};

import { http } from '../../api/http';
import type {
  Member,
  MemberStatus,
  Motorcycle,
  Paginated,
  TimelineEntry,
  MembershipRequirement,
} from '../../api/types';
import type { CreateMemberDto } from '../../api/generated/models/CreateMemberDto';

export interface ListMembersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  chapterId?: string;
  membershipStageId?: string;
  status?: MemberStatus;
}

export const membersApi = {
  list: (params: ListMembersParams) => http.get<Paginated<Member>>('/members', { params }).then((r) => r.data),
  findOne: (id: string) => http.get<Member>(`/members/${id}`).then((r) => r.data),
  create: (input: CreateMemberDto) => http.post<Member>('/members', input).then((r) => r.data),
  update: (id: string, input: Partial<CreateMemberDto> & { status?: MemberStatus }) =>
    http.patch<Member>(`/members/${id}`, input).then((r) => r.data),
  deactivate: (id: string, reason?: string) => http.delete<Member>(`/members/${id}`, { data: { reason } }).then((r) => r.data),
  changeStage: (id: string, input: { stageId: string; sponsorMemberId?: string; notes?: string }) =>
    http.post<Member>(`/members/${id}/stage`, input).then((r) => r.data),
  timeline: (id: string) => http.get<TimelineEntry[]>(`/members/${id}/timeline`).then((r) => r.data),
  requirements: (id: string) => http.get<MembershipRequirement[]>(`/members/${id}/requirements`).then((r) => r.data),
  updateRequirementProgress: (id: string, requirementId: string, input: { completedCount?: number; completedAt?: string | null }) =>
    http.patch(`/members/${id}/requirements/${requirementId}`, input).then((r) => r.data),
  motorcycles: (memberId: string) => http.get<Motorcycle[]>(`/motorcycles/member/${memberId}`).then((r) => r.data),
  addMotorcycle: (input: { memberId: string } & Partial<Motorcycle>) =>
    http.post<Motorcycle>('/motorcycles', input).then((r) => r.data),
  removeMotorcycle: (id: string) => http.delete(`/motorcycles/${id}`).then((r) => r.data),
};

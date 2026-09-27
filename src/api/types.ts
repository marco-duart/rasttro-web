export type PermissionScope = 'SELF' | 'CHAPTER' | 'CLUB';
export type ClubStatus = 'ACTIVE' | 'SUSPENDED' | 'CANCELED';
export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'LEFT';
export type FeeFrequency = 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
export type ChargeStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'WAIVED' | 'CANCELLED';
export type PaymentMethod = 'PIX' | 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'OTHER';
export type TransactionType = 'INCOME' | 'EXPENSE';
export type MeetingType = 'ORDINARY' | 'EXTRAORDINARY' | 'ASSEMBLY' | 'BOARD';
export type MeetingStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type AttendanceStatus = 'EXPECTED' | 'CONFIRMED' | 'PRESENT' | 'ABSENT' | 'JUSTIFIED_ABSENCE';
export type EventType = 'MEETUP' | 'PARTY' | 'SOCIAL_ACTION' | 'CLUB_ANNIVERSARY' | 'VISIT' | 'EXTERNAL' | 'TRIP' | 'RIDE';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
export type RsvpStatus = 'CONFIRMED' | 'MAYBE' | 'DECLINED' | 'NO_RESPONSE';
export type ConvoyStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type ConvoyStopType = 'FUEL' | 'FOOD' | 'REST' | 'REGROUP' | 'INTERMEDIATE_DESTINATION';
export type ConvoyRole = 'CAPTAIN' | 'REAR_GUARD' | 'ASSISTANT' | 'ROAD_SUPPORT';
export type ConvoyParticipantStatus = 'CONFIRMED' | 'CHECKED_IN' | 'ARRIVED' | 'NO_SHOW' | 'CANCELLED';
export type AnnouncementAudience = 'GENERAL' | 'BOARD' | 'REGIONAL' | 'PROSPECTS' | 'EVENT_PARTICIPANTS';
export type AnnouncementPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface Plan {
  id: string;
  key: string;
  name: string;
  description: string | null;
  moduleKeys: string[];
  memberLimit: number | null;
  priceCents: number;
  isDefault: boolean;
}

export interface Subscription {
  id: string;
  clubId: string;
  planId: string;
  status: SubscriptionStatus;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  activatedAt: string | null;
  cancelledAt: string | null;
  notes: string | null;
  plan: Plan;
}

export interface Club {
  id: string;
  name: string;
  legalName: string | null;
  slug: string;
  logoUrl: string | null;
  coverUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  foundedAt: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: Record<string, unknown> | null;
  timezone: string;
  currency: string;
  status: ClubStatus;
  createdAt: string;
  updatedAt: string;
  subscription: Subscription | null;
}

export interface Chapter {
  id: string;
  clubId: string;
  name: string;
  code: string | null;
  city: string | null;
  state: string | null;
  status: ClubStatus;
}

export interface Role {
  id: string;
  clubId: string;
  name: string;
  description: string | null;
  color: string | null;
  rank: number;
  isSystemDefault: boolean;
  permissions: RolePermission[];
  _count?: { assignments: number };
}

export interface RolePermission {
  id: string;
  roleId: string;
  permission: string;
  scope: PermissionScope;
}

export interface RoleAssignment {
  id: string;
  memberId: string;
  roleId: string;
  chapterId: string | null;
  startsAt: string;
  endsAt: string | null;
  role: Role;
  chapter?: Chapter | null;
}

export interface MembershipStage {
  id: string;
  clubId: string;
  name: string;
  order: number;
  isProspectStage: boolean;
  isEffectiveStage: boolean;
  isActive: boolean;
  _count?: { members: number; requirements: number };
}

export interface MembershipRequirement {
  id: string;
  clubId: string;
  stageId: string;
  description: string;
  targetCount: number;
  isMandatory: boolean;
  progress?: { completedCount: number; completedAt: string | null } | MemberRequirementProgress[];
}

export interface MemberRequirementProgress {
  completedCount: number;
  completedAt: string | null;
  notes: string | null;
}

export interface Motorcycle {
  id: string;
  memberId: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  licensePlate: string | null;
  nickname: string | null;
  isPrimary: boolean;
}

export interface Member {
  id: string;
  clubId: string;
  userId: string | null;
  chapterId: string | null;
  fullName: string;
  nickname: string | null;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  photoUrl: string | null;
  joinedAt: string | null;
  status: MemberStatus;
  membershipStageId: string | null;
  bloodType: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  notes: string | null;
  memberNumber: number | null;
  isFounder: boolean;
  displayTitleId: string | null;
  chapter?: Chapter | null;
  membershipStage?: MembershipStage | null;
  roleAssignments?: RoleAssignment[];
  motorcycles?: Motorcycle[];
  displayTitle?: Title | null;
  titles?: MemberTitle[];
}

export interface Title {
  id: string;
  clubId: string;
  name: string;
  description: string | null;
  color: string | null;
  _count?: { memberTitles: number };
}

export interface MemberTitle {
  id: string;
  memberId: string;
  titleId: string;
  awardedAt: string;
  notes: string | null;
  title: Title;
  awardedBy?: { id: string; fullName: string; nickname: string | null } | null;
}

export interface MemberSummary {
  id: string;
  fullName: string;
  nickname: string | null;
  photoUrl: string | null;
}

export interface TimelineEntry {
  type: 'stage' | 'role' | 'role_end' | 'meeting' | 'event' | 'payment' | 'title';
  date: string;
  title: string;
  description?: string;
}

export interface FinancialCategory {
  id: string;
  clubId: string;
  name: string;
  kind: TransactionType | null;
  isDefault: boolean;
}

export interface MembershipFeeRule {
  id: string;
  clubId: string;
  chapterId: string | null;
  name: string;
  amountCents: number;
  frequency: FeeFrequency;
  dueDay: number;
  isActive: boolean;
}

export interface Charge {
  id: string;
  clubId: string;
  memberId: string;
  feeRuleId: string | null;
  referenceMonth: string;
  amountCents: number;
  dueDate: string;
  status: ChargeStatus;
  paidAt: string | null;
  paymentMethod: PaymentMethod | null;
  waivedReason: string | null;
  cancelledReason: string | null;
  notes: string | null;
  member?: MemberSummary;
}

export interface FinancialTransaction {
  id: string;
  clubId: string;
  chapterId: string | null;
  type: TransactionType;
  categoryId: string | null;
  amountCents: number;
  occurredAt: string;
  description: string | null;
  attachmentUrl: string | null;
  chargeId: string | null;
  category?: FinancialCategory | null;
}

export interface FinanceSummary {
  incomeCents: number;
  expenseCents: number;
  charges: { status: ChargeStatus; count: number; amountCents: number }[];
}

export interface Meeting {
  id: string;
  clubId: string;
  chapterId: string | null;
  title: string;
  type: MeetingType;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  agenda: string | null;
  mandatory: boolean;
  status: MeetingStatus;
  attendance?: MeetingAttendance[];
  decisions?: MeetingDecision[];
  minute?: MeetingMinute | null;
  _count?: { attendance: number; decisions: number };
}

export interface MeetingAttendance {
  id: string;
  meetingId: string;
  memberId: string;
  status: AttendanceStatus;
  justification: string | null;
  checkedInAt: string | null;
  member: MemberSummary;
}

export interface MeetingDecision {
  id: string;
  meetingId: string;
  description: string;
  decidedAt: string;
}

export interface MeetingMinute {
  id: string;
  meetingId: string;
  content: string;
  attachmentUrl: string | null;
  isFinal: boolean;
  publishedAt: string | null;
}

export interface EventEntity {
  id: string;
  clubId: string;
  chapterId: string | null;
  title: string;
  type: EventType;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  coverImageUrl: string | null;
  status: EventStatus;
  rsvps?: EventRsvp[];
  convoys?: Convoy[];
  _count?: { rsvps: number; convoys: number };
}

export interface EventRsvp {
  id: string;
  eventId: string;
  memberId: string;
  status: RsvpStatus;
  guestCount: number;
  member?: MemberSummary;
}

export interface Convoy {
  id: string;
  clubId: string;
  eventId: string | null;
  departureAt: string;
  meetingPoint: string;
  destination: string | null;
  routeUrl: string | null;
  estimatedDistanceKm: number | null;
  estimatedDurationMin: number | null;
  notes: string | null;
  status: ConvoyStatus;
  stops?: ConvoyStop[];
  assignments?: ConvoyAssignment[];
  participants?: ConvoyParticipant[];
  event?: { id: string; title: string } | null;
  _count?: { participants: number };
}

export interface ConvoyStop {
  id: string;
  convoyId: string;
  sequence: number;
  type: ConvoyStopType;
  location: string;
  estimatedAt: string | null;
  notes: string | null;
}

export interface ConvoyAssignment {
  id: string;
  convoyId: string;
  memberId: string;
  role: ConvoyRole;
  member: MemberSummary;
}

export interface ConvoyParticipant {
  id: string;
  convoyId: string;
  memberId: string;
  motorcycleId: string | null;
  status: ConvoyParticipantStatus;
  checkedInAt: string | null;
  arrivedAt: string | null;
  member: MemberSummary & { phone?: string | null };
  motorcycle?: Motorcycle | null;
}

export interface ConvoyStatusBoard {
  confirmed: number;
  checkedInOrArrived: number;
  pending: MemberSummary[];
}

export interface Announcement {
  id: string;
  clubId: string;
  chapterId: string | null;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  priority: AnnouncementPriority;
  requiresConfirmation: boolean;
  attachmentUrl: string | null;
  publishedAt: string;
  expiresAt: string | null;
  readAt?: string | null;
  confirmedAt?: string | null;
  _count?: { reads: number };
}

export interface Invite {
  id: string;
  clubId: string;
  chapterId: string | null;
  email: string | null;
  phone: string | null;
  code: string;
  status: InviteStatus;
  expiresAt: string;
  createdAt: string;
  chapter?: Chapter | null;
  roleOnAccept?: Role | null;
  stageOnAccept?: MembershipStage | null;
}

export interface MembershipCard {
  member: {
    id: string;
    fullName: string;
    nickname: string | null;
    photoUrl: string | null;
    memberNumber: number | null;
    status: MemberStatus;
  };
  club: { name: string; logoUrl: string | null; primaryColor: string | null };
  stage: string | null;
  roles: string[];
  displayTitle: string | null;
  qrDataUrl: string;
  verifyUrl: string;
}

export interface AuthUser {
  id: string;
  email: string;
  isSuperAdmin: boolean;
  createdAt: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  user?: AuthUser;
  club?: Club;
  member?: Member;
}

export interface MyClub {
  club: Club;
  member: {
    id: string;
    fullName: string;
    nickname: string | null;
    photoUrl: string | null;
    status: MemberStatus;
    chapter: Chapter | null;
    membershipStage: MembershipStage | null;
    roles: string[];
  };
}

export interface AuditLogEntry {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  before: unknown;
  after: unknown;
  createdAt: string;
}

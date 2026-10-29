// Rótulos (e cores) de todos os enums mostrados nas telas. Um lugar só: a API devolve os códigos em inglês
// (CONFIRMED, PENDING, HIGH...) e nenhuma tela deve mostrar esses códigos crus.
import type {
  AnnouncementAudience,
  AnnouncementPriority,
  AttendanceStatus,
  ChargeStatus,
  ConvoyParticipantStatus,
  ConvoyRole,
  ConvoyStopType,
  EventType,
  InviteStatus,
  MeetingStatus,
  MeetingType,
  MemberStatus,
  RsvpStatus,
} from '../api/types';

export type Tone = 'success' | 'neutral' | 'warning' | 'danger' | 'brand';

export const memberStatusLabel: Record<MemberStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  SUSPENDED: 'Suspenso',
  LEFT: 'Desligado',
};
export const memberStatusTone: Record<MemberStatus, Tone> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  SUSPENDED: 'warning',
  LEFT: 'danger',
};

export const chargeStatusLabel: Record<ChargeStatus, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  OVERDUE: 'Vencido',
  WAIVED: 'Isento',
  CANCELLED: 'Cancelado',
};
export const chargeStatusTone: Record<ChargeStatus, Tone> = {
  PENDING: 'neutral',
  PAID: 'success',
  OVERDUE: 'danger',
  WAIVED: 'warning',
  CANCELLED: 'neutral',
};

export const meetingStatusLabel: Record<MeetingStatus, string> = {
  SCHEDULED: 'Agendada',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
};
export const meetingStatusTone: Record<MeetingStatus, Tone> = {
  SCHEDULED: 'neutral',
  IN_PROGRESS: 'brand',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

export const meetingTypeLabel: Record<MeetingType, string> = {
  ORDINARY: 'Reunião ordinária',
  EXTRAORDINARY: 'Reunião extraordinária',
  ASSEMBLY: 'Assembleia',
  BOARD: 'Reunião de diretoria',
};

export const attendanceLabel: Record<AttendanceStatus, string> = {
  EXPECTED: 'Aguardando',
  CONFIRMED: 'Confirmado',
  PRESENT: 'Presente',
  ABSENT: 'Ausente',
  JUSTIFIED_ABSENCE: 'Falta justificada',
};
export const attendanceTone: Record<AttendanceStatus, Tone> = {
  EXPECTED: 'neutral',
  CONFIRMED: 'neutral',
  PRESENT: 'success',
  ABSENT: 'danger',
  JUSTIFIED_ABSENCE: 'warning',
};

export const eventTypeLabel: Record<EventType, string> = {
  MEETUP: 'Encontro',
  PARTY: 'Confraternização',
  SOCIAL_ACTION: 'Ação social',
  CLUB_ANNIVERSARY: 'Aniversário do clube',
  VISIT: 'Visita a outro clube',
  EXTERNAL: 'Evento externo',
  TRIP: 'Viagem',
  RIDE: 'Passeio',
};

export const rsvpLabel: Record<RsvpStatus, string> = {
  CONFIRMED: 'Vou',
  MAYBE: 'Talvez',
  DECLINED: 'Não vou',
  NO_RESPONSE: 'Sem resposta',
};

export const convoyRoleLabel: Record<ConvoyRole, string> = {
  CAPTAIN: 'Capitão de estrada',
  REAR_GUARD: 'Ferrolho',
  ASSISTANT: 'Assistente',
  ROAD_SUPPORT: 'Apoio de estrada',
};

export const convoyParticipantStatusLabel: Record<ConvoyParticipantStatus, string> = {
  CONFIRMED: 'Confirmado',
  CHECKED_IN: 'No ponto',
  ARRIVED: 'Chegou',
  NO_SHOW: 'Não foi',
  CANCELLED: 'Cancelado',
};
export const convoyParticipantStatusTone: Record<ConvoyParticipantStatus, Tone> = {
  CONFIRMED: 'neutral',
  CHECKED_IN: 'success',
  ARRIVED: 'success',
  NO_SHOW: 'danger',
  CANCELLED: 'neutral',
};

export const convoyStopTypeLabel: Record<ConvoyStopType, string> = {
  FUEL: 'Combustível',
  FOOD: 'Comida',
  REST: 'Descanso',
  REGROUP: 'Reagrupamento',
  INTERMEDIATE_DESTINATION: 'Destino intermediário',
};

export const announcementPriorityLabel: Record<AnnouncementPriority, string> = {
  LOW: 'Baixa',
  NORMAL: 'Normal',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};
export const announcementPriorityTone: Record<AnnouncementPriority, Tone> = {
  LOW: 'neutral',
  NORMAL: 'brand',
  HIGH: 'warning',
  URGENT: 'danger',
};

export const announcementAudienceLabel: Record<AnnouncementAudience, string> = {
  GENERAL: 'Geral',
  BOARD: 'Diretoria',
  REGIONAL: 'Regional',
  PROSPECTS: 'Prospects',
  EVENT_PARTICIPANTS: 'Participantes de evento',
};

export const inviteStatusLabel: Record<InviteStatus, string> = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceito',
  EXPIRED: 'Expirado',
  REVOKED: 'Revogado',
};
export const inviteStatusTone: Record<InviteStatus, Tone> = {
  PENDING: 'brand',
  ACCEPTED: 'success',
  EXPIRED: 'neutral',
  REVOKED: 'danger',
};

export type EmailStatus = 'PENDING' | 'SENDING' | 'SENT' | 'FAILED' | 'CANCELLED' | 'SUPPRESSED';
export const emailStatusLabel: Record<EmailStatus, string> = {
  PENDING: 'Na fila',
  SENDING: 'Enviando',
  SENT: 'Enviado',
  FAILED: 'Falhou',
  CANCELLED: 'Cancelado',
  SUPPRESSED: 'Bloqueado',
};
export const emailStatusTone: Record<EmailStatus, Tone> = {
  PENDING: 'brand',
  SENDING: 'brand',
  SENT: 'success',
  FAILED: 'danger',
  CANCELLED: 'neutral',
  SUPPRESSED: 'warning',
};

export const auditActionLabel: Record<string, string> = {
  'club.created': 'Clube criado',
  'club.updated': 'Clube atualizado',
  'club.branding_updated': 'Identidade visual atualizada',
  'club.branding_removed': 'Identidade visual removida',
  'club.payment_settings.updated': 'Dados de pagamento alterados',
  'member.created': 'Membro cadastrado',
  'member.updated': 'Membro atualizado',
  'member.deactivated': 'Membro desligado',
  'member.stage_changed': 'Estágio alterado',
  'member.photo_updated': 'Foto do membro atualizada',
  'member.photo_removed': 'Foto do membro removida',
  'role.assigned': 'Cargo atribuído',
  'role.unassigned': 'Cargo encerrado',
  'title.created': 'Título criado',
  'title.updated': 'Título atualizado',
  'title.awarded': 'Título concedido',
  'title.revoked': 'Título retirado',
  'title.removed': 'Título removido',
  'charge.created': 'Cobrança criada',
  'charge.paid': 'Cobrança paga',
  'charge.waived': 'Cobrança isentada',
  'charge.cancelled': 'Cobrança cancelada',
  'transaction.created': 'Lançamento criado',
  'transaction.updated': 'Lançamento atualizado',
  'transaction.deleted': 'Lançamento removido',
  'invite.created': 'Convite criado',
  'invite.accepted': 'Convite aceito',
  'meeting.created': 'Reunião criada',
  'event.created': 'Evento criado',
  'convoy.created': 'Comboio criado',
  'convoy.emergency_sheet.viewed': 'Ficha de emergência do comboio aberta',
  'announcement.created': 'Comunicado publicado',
  'checkin.qr': 'Check-in por QR',
  'checkin.card': 'Check-in por carteirinha',
  'auth.password_changed': 'Senha alterada',
  'auth.password_reset': 'Senha redefinida',
};

/** Ação da auditoria em português; uma ação nova ainda sem tradução aparece como está, sem quebrar a tela. */
export const auditActionText = (action: string): string => auditActionLabel[action] ?? action;

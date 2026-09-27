import type { EventType } from '../../api/types';

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

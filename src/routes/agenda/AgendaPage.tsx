import { useState } from 'react';
import { useNavigate } from 'react-router';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { CalendarDays, Gavel, PartyPopper, Bike } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { useMeetings } from '../../features/meetings/hooks';
import { useEvents } from '../../features/events/hooks';
import { useConvoys } from '../../features/convoys/hooks';
import { formatDateTime } from '../../lib/format';

type AgendaEntry = { id: string; date: string; title: string; subtitle?: string; kind: 'meeting' | 'event' | 'convoy'; to: string };

export function AgendaPage() {
  const navigate = useNavigate();
  const { data: meetings, isLoading: loadingMeetings } = useMeetings();
  const { data: events, isLoading: loadingEvents } = useEvents(true);
  const { data: convoys, isLoading: loadingConvoys } = useConvoys(true);

  const isLoading = loadingMeetings || loadingEvents || loadingConvoys;
  // Lazy init: leitura de "agora" só na montagem, não a cada render (regra de pureza do React).
  const [now] = useState(() => Date.now());

  const entries: AgendaEntry[] = [
    ...(meetings ?? [])
      .filter((m) => new Date(m.startsAt).getTime() >= now && m.status !== 'CANCELLED')
      .map((m) => ({ id: m.id, date: m.startsAt, title: m.title, subtitle: m.location ?? undefined, kind: 'meeting' as const, to: `/reunioes/${m.id}` })),
    ...(events ?? []).map((e) => ({ id: e.id, date: e.startsAt, title: e.title, subtitle: e.location ?? undefined, kind: 'event' as const, to: `/eventos/${e.id}` })),
    ...(convoys ?? []).map((c) => ({ id: c.id, date: c.departureAt, title: `Comboio: ${c.meetingPoint}`, subtitle: c.destination ?? undefined, kind: 'convoy' as const, to: `/comboios/${c.id}` })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const icons = { meeting: Gavel, event: PartyPopper, convoy: Bike };
  const kindLabel = { meeting: 'Reunião', event: 'Evento', convoy: 'Comboio' };

  return (
    <div>
      <PageHeader title="Agenda" description="Próximas reuniões, eventos e comboios do clube." />
      {isLoading ? (
        <Spinner />
      ) : entries.length === 0 ? (
        <EmptyState icon={<CalendarDays size={32} />} title="Nada agendado" description="Quando houver reuniões, eventos ou comboios futuros, eles aparecem aqui." />
      ) : (
        <Flex direction="column" gap="2">
          {entries.map((entry) => {
            const Icon = icons[entry.kind];
            return (
              <Card key={`${entry.kind}-${entry.id}`} onClick={() => navigate(entry.to)} className={css({ cursor: 'pointer', _hover: { borderColor: 'brand' } })}>
                <Flex align="center" gap="3">
                  <div className={css({ color: 'brand', flexShrink: 0 })}>
                    <Icon size={20} />
                  </div>
                  <div className={css({ flex: 1 })}>
                    <Flex align="center" gap="2">
                      <p className={css({ fontWeight: '600' })}>{entry.title}</p>
                      <Badge tone="neutral">{kindLabel[entry.kind]}</Badge>
                    </Flex>
                    <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>
                      {formatDateTime(entry.date)}
                      {entry.subtitle && ` · ${entry.subtitle}`}
                    </p>
                  </div>
                </Flex>
              </Card>
            );
          })}
        </Flex>
      )}
    </div>
  );
}

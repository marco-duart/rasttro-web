import { useParams, useNavigate, Link } from 'react-router';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { ArrowLeft, MapPin, Bike } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Avatar } from '../../design-system/Avatar';
import { Spinner } from '../../design-system/Spinner';
import { useEvent, useRsvpEvent } from '../../features/events/hooks';
import { formatDateTime } from '../../lib/format';
import { eventTypeLabel } from '../../features/events/constants';
import type { RsvpStatus } from '../../api/types';

const rsvpLabel: Record<RsvpStatus, string> = { CONFIRMED: 'Vou', MAYBE: 'Talvez', DECLINED: 'Não vou', NO_RESPONSE: 'Responder' };

export function EventDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading } = useEvent(id);
  const rsvp = useRsvpEvent(id);

  if (isLoading || !event) return <Spinner />;

  const confirmed = event.rsvps?.filter((r) => r.status === 'CONFIRMED') ?? [];
  const maybe = event.rsvps?.filter((r) => r.status === 'MAYBE') ?? [];

  return (
    <div>
      <button onClick={() => navigate('/eventos')} className={css({ display: 'flex', alignItems: 'center', gap: '1', color: 'text.muted', mb: '3', cursor: 'pointer', fontSize: '14px' })}>
        <ArrowLeft size={16} /> Voltar aos eventos
      </button>

      <PageHeader title={event.title} description={formatDateTime(event.startsAt)} />

      <Grid columns={{ base: 1, lg: 2 }} gap="5">
        <Card>
          <Badge tone="brand">{eventTypeLabel[event.type]}</Badge>
          {event.description && <p className={css({ mt: '3', fontSize: '14px', whiteSpace: 'pre-wrap' })}>{event.description}</p>}
          {event.location && (
            <Flex align="center" gap="1" mt="3" className={css({ color: 'text.muted', fontSize: '14px' })}>
              <MapPin size={14} /> {event.location}
            </Flex>
          )}

          <p className={css({ textStyle: 'label', color: 'text.muted', mt: '5', mb: '2' })}>Você vai?</p>
          <Flex gap="2">
            {(['CONFIRMED', 'MAYBE', 'DECLINED'] as RsvpStatus[]).map((status) => (
              <Button key={status} variant="secondary" size="sm" loading={rsvp.isPending} onClick={() => rsvp.mutate({ status })}>
                {rsvpLabel[status]}
              </Button>
            ))}
          </Flex>

          {event.convoys && event.convoys.length > 0 && (
            <div className={css({ mt: '5' })}>
              <p className={css({ textStyle: 'label', color: 'text.muted', mb: '2' })}>Comboios vinculados</p>
              {event.convoys.map((c) => (
                <Link key={c.id} to={`/comboios/${c.id}`} className={css({ display: 'flex', alignItems: 'center', gap: '2', color: 'brand', fontSize: '14px', mb: '1' })}>
                  <Bike size={14} /> Saída {formatDateTime(c.departureAt)} — {c.meetingPoint}
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className={css({ textStyle: 'h3', mb: '3' })}>Confirmados ({confirmed.length})</h2>
          <Flex direction="column" gap="2" maxH="200px" overflowY="auto" mb="4">
            {confirmed.map((r) => (
              <Flex key={r.id} align="center" gap="2">
                <Avatar name={r.member?.fullName ?? '?'} photoUrl={r.member?.photoUrl} size={26} />
                <span className={css({ fontSize: '14px' })}>{r.member?.fullName}</span>
                {r.guestCount > 0 && <Badge tone="neutral">+{r.guestCount}</Badge>}
              </Flex>
            ))}
            {confirmed.length === 0 && <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>Ninguém confirmou ainda.</p>}
          </Flex>
          {maybe.length > 0 && (
            <>
              <h3 className={css({ textStyle: 'label', color: 'text.muted', mb: '2' })}>Talvez ({maybe.length})</h3>
              <Flex direction="column" gap="2">
                {maybe.map((r) => (
                  <Flex key={r.id} align="center" gap="2">
                    <Avatar name={r.member?.fullName ?? '?'} photoUrl={r.member?.photoUrl} size={24} />
                    <span className={css({ fontSize: '13px', color: 'text.muted' })}>{r.member?.fullName}</span>
                  </Flex>
                ))}
              </Flex>
            </>
          )}
        </Card>
      </Grid>
    </div>
  );
}

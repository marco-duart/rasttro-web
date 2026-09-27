import { useState } from 'react';
import { useNavigate } from 'react-router';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { PartyPopper, Plus, MapPin, Users } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { useEvents } from '../../features/events/hooks';
import { useCurrentPermissions } from '../../features/clubs/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import { formatDateTime } from '../../lib/format';
import { EventFormDialog } from './EventFormDialog';
import { eventTypeLabel } from '../../features/events/constants';

export function EventsListPage() {
  const navigate = useNavigate();
  const { has } = useCurrentPermissions();
  const { data: events, isLoading } = useEvents();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Eventos"
        description="Encontros, passeios, ações sociais e viagens do clube."
        actions={
          has(PERMISSIONS.EVENTS_MANAGE) && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus size={16} /> Novo evento
            </Button>
          )
        }
      />

      {isLoading ? (
        <Spinner />
      ) : !events || events.length === 0 ? (
        <EmptyState icon={<PartyPopper size={32} />} title="Nenhum evento cadastrado" />
      ) : (
        <Grid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
          {events.map((event) => (
            <Card key={event.id} onClick={() => navigate(`/eventos/${event.id}`)} className={css({ cursor: 'pointer', _hover: { borderColor: 'brand' } })}>
              <Badge tone="brand">{eventTypeLabel[event.type]}</Badge>
              <p className={css({ fontWeight: '700', mt: '2' })}>{event.title}</p>
              <p className={css({ textStyle: 'bodySm', color: 'text.muted', mt: '1' })}>{formatDateTime(event.startsAt)}</p>
              <Flex gap="4" mt="2" className={css({ color: 'text.muted', fontSize: '13px' })}>
                {event.location && (
                  <Flex align="center" gap="1">
                    <MapPin size={13} /> {event.location}
                  </Flex>
                )}
                <Flex align="center" gap="1">
                  <Users size={13} /> {event._count?.rsvps ?? 0}
                </Flex>
              </Flex>
            </Card>
          ))}
        </Grid>
      )}

      <EventFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}

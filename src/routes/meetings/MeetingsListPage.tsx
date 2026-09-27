import { useState } from 'react';
import { useNavigate } from 'react-router';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { Gavel, Plus, MapPin, Users } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { useMeetings } from '../../features/meetings/hooks';
import { useCurrentPermissions } from '../../features/clubs/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import { formatDateTime } from '../../lib/format';
import { MeetingFormDialog } from './MeetingFormDialog';
import type { MeetingStatus } from '../../api/types';

const statusTone: Record<MeetingStatus, 'success' | 'neutral' | 'warning' | 'danger' | 'brand'> = {
  SCHEDULED: 'neutral',
  IN_PROGRESS: 'brand',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

export function MeetingsListPage() {
  const navigate = useNavigate();
  const { has } = useCurrentPermissions();
  const { data: meetings, isLoading } = useMeetings();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Reuniões"
        description="Convocação, pauta, presença e decisões."
        actions={
          has(PERMISSIONS.MEETINGS_MANAGE) && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus size={16} /> Nova reunião
            </Button>
          )
        }
      />

      {isLoading ? (
        <Spinner />
      ) : !meetings || meetings.length === 0 ? (
        <EmptyState icon={<Gavel size={32} />} title="Nenhuma reunião registrada" />
      ) : (
        <Flex direction="column" gap="3">
          {meetings.map((meeting) => (
            <Card key={meeting.id} onClick={() => navigate(`/reunioes/${meeting.id}`)} className={css({ cursor: 'pointer', _hover: { borderColor: 'brand' } })}>
              <Flex justify="space-between" align="center" wrap="wrap" gap="2">
                <div>
                  <Flex align="center" gap="2">
                    <p className={css({ fontWeight: '700' })}>{meeting.title}</p>
                    {meeting.mandatory && <Badge tone="warning">Obrigatória</Badge>}
                    <Badge tone={statusTone[meeting.status] ?? 'neutral'}>{meeting.status}</Badge>
                  </Flex>
                  <Flex gap="4" mt="1" className={css({ color: 'text.muted', fontSize: '13px' })}>
                    <span>{formatDateTime(meeting.startsAt)}</span>
                    {meeting.location && (
                      <Flex align="center" gap="1">
                        <MapPin size={13} /> {meeting.location}
                      </Flex>
                    )}
                    <Flex align="center" gap="1">
                      <Users size={13} /> {meeting._count?.attendance ?? 0} convocado(s)
                    </Flex>
                  </Flex>
                </div>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      <MeetingFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}

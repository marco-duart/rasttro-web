import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Avatar } from '../../design-system/Avatar';
import { Select } from '../../design-system/Select';
import { Textarea } from '../../design-system/Textarea';
import { Input } from '../../design-system/Input';
import { Spinner } from '../../design-system/Spinner';
import { useMeeting, useMarkAttendance, useCheckInMeeting, useAddDecision, useUpsertMinute } from '../../features/meetings/hooks';
import { useCurrentPermissions } from '../../features/clubs/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import { formatDateTime } from '../../lib/format';
import type { AttendanceStatus } from '../../api/types';

const attendanceLabel: Record<AttendanceStatus, string> = {
  EXPECTED: 'Aguardando',
  CONFIRMED: 'Confirmado',
  PRESENT: 'Presente',
  ABSENT: 'Ausente',
  JUSTIFIED_ABSENCE: 'Falta justificada',
};

const attendanceTone: Record<AttendanceStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  EXPECTED: 'neutral',
  CONFIRMED: 'neutral',
  PRESENT: 'success',
  ABSENT: 'danger',
  JUSTIFIED_ABSENCE: 'warning',
};

export function MeetingDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { has } = useCurrentPermissions();
  const canManage = has(PERMISSIONS.MEETINGS_MANAGE);
  const canManageMinutes = has(PERMISSIONS.MEETINGS_MINUTES_MANAGE);

  const { data: meeting, isLoading } = useMeeting(id);
  const markAttendance = useMarkAttendance(id);
  const checkIn = useCheckInMeeting(id);
  const addDecision = useAddDecision(id);
  const upsertMinute = useUpsertMinute(id);

  const [decisionText, setDecisionText] = useState('');
  const [minuteText, setMinuteText] = useState('');

  if (isLoading || !meeting) return <Spinner />;

  return (
    <div>
      <button onClick={() => navigate('/reunioes')} className={css({ display: 'flex', alignItems: 'center', gap: '1', color: 'text.muted', mb: '3', cursor: 'pointer', fontSize: '14px' })}>
        <ArrowLeft size={16} /> Voltar às reuniões
      </button>

      <PageHeader
        title={meeting.title}
        description={[formatDateTime(meeting.startsAt), meeting.location].filter(Boolean).join(' · ')}
        actions={
          !canManage && (
            <Button onClick={() => checkIn.mutate()} loading={checkIn.isPending}>
              <CheckCircle2 size={16} /> Confirmar minha presença
            </Button>
          )
        }
      />

      {meeting.agenda && (
        <Card className={css({ mb: '5' })}>
          <h2 className={css({ textStyle: 'h3', mb: '2' })}>Pauta</h2>
          <p className={css({ whiteSpace: 'pre-wrap', fontSize: '14px', color: 'text.muted' })}>{meeting.agenda}</p>
        </Card>
      )}

      <Grid columns={{ base: 1, lg: 2 }} gap="5">
        <Card>
          <h2 className={css({ textStyle: 'h3', mb: '3' })}>Presença ({meeting.attendance?.length ?? 0})</h2>
          <Flex direction="column" gap="2" maxH="400px" overflowY="auto">
            {meeting.attendance?.map((a) => (
              <Flex key={a.id} align="center" justify="space-between" gap="2">
                <Flex align="center" gap="2" minW="0">
                  <Avatar name={a.member.fullName} photoUrl={a.member.photoUrl} size={26} />
                  <span className={css({ fontSize: '14px', truncate: true })}>{a.member.fullName}</span>
                </Flex>
                {canManage ? (
                  <Select
                    value={a.status}
                    onChange={(e) => markAttendance.mutate({ memberId: a.memberId, status: e.target.value as AttendanceStatus })}
                    className={css({ w: 'auto', h: '30px', fontSize: '12px', py: '0' })}
                  >
                    {Object.entries(attendanceLabel).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Badge tone={attendanceTone[a.status]}>{attendanceLabel[a.status]}</Badge>
                )}
              </Flex>
            ))}
          </Flex>
        </Card>

        <Flex direction="column" gap="5">
          <Card>
            <h2 className={css({ textStyle: 'h3', mb: '3' })}>Decisões</h2>
            <Flex direction="column" gap="2" mb="3">
              {meeting.decisions?.length ? (
                meeting.decisions.map((d) => (
                  <p key={d.id} className={css({ fontSize: '14px' })}>
                    • {d.description}
                  </p>
                ))
              ) : (
                <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>Nenhuma decisão registrada.</p>
              )}
            </Flex>
            {canManage && (
              <Flex gap="2">
                <Input value={decisionText} onChange={(e) => setDecisionText(e.target.value)} placeholder="Nova decisão..." />
                <Button
                  disabled={!decisionText.trim()}
                  onClick={() => addDecision.mutate(decisionText, { onSuccess: () => setDecisionText('') })}
                >
                  Adicionar
                </Button>
              </Flex>
            )}
          </Card>

          {canManageMinutes && (
            <Card>
              <h2 className={css({ textStyle: 'h3', mb: '3' })}>Ata</h2>
              <Textarea
                defaultValue={meeting.minute?.content ?? ''}
                onChange={(e) => setMinuteText(e.target.value)}
                rows={6}
                placeholder="Redija a ata da reunião..."
              />
              <Flex justify="flex-end" gap="2" mt="3">
                <Button
                  variant="secondary"
                  loading={upsertMinute.isPending}
                  onClick={() => upsertMinute.mutate({ content: minuteText || meeting.minute?.content || '', isFinal: false })}
                >
                  Salvar rascunho
                </Button>
                <Button
                  loading={upsertMinute.isPending}
                  onClick={() => upsertMinute.mutate({ content: minuteText || meeting.minute?.content || '', isFinal: true })}
                >
                  Publicar ata
                </Button>
              </Flex>
              {meeting.minute?.isFinal && <Badge tone="success" className={css({ mt: '2' })}>Publicada</Badge>}
            </Card>
          )}
        </Flex>
      </Grid>
    </div>
  );
}

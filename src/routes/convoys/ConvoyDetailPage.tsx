import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { ArrowLeft, Navigation, Flag, Shield, Phone, Plus } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Avatar } from '../../design-system/Avatar';
import { Select } from '../../design-system/Select';
import { Spinner } from '../../design-system/Spinner';
import { StatTile } from '../../design-system/StatTile';
import {
  useConvoy,
  useConvoyStatusBoard,
  useJoinConvoy,
  useCheckInConvoy,
  useAssignConvoyRole,
  useUnassignConvoyRole,
} from '../../features/convoys/hooks';
import { useMembers } from '../../features/members/hooks';
import { useCurrentPermissions } from '../../features/clubs/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import { formatDateTime } from '../../lib/format';
import type { ConvoyRole } from '../../api/types';

const roleLabel: Record<ConvoyRole, string> = {
  CAPTAIN: 'Capitão de estrada',
  REAR_GUARD: 'Ferrolho',
  ASSISTANT: 'Assistente',
  ROAD_SUPPORT: 'Apoio de estrada',
};

export function ConvoyDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { has } = useCurrentPermissions();
  const canManage = has(PERMISSIONS.CONVOYS_MANAGE);

  const { data: convoy, isLoading } = useConvoy(id);
  const { data: board } = useConvoyStatusBoard(id);
  const { data: membersPage } = useMembers({ pageSize: 200 });
  const join = useJoinConvoy(id);
  const checkIn = useCheckInConvoy(id);
  const assignRole = useAssignConvoyRole(id);
  const unassignRole = useUnassignConvoyRole(id);

  const [roleMember, setRoleMember] = useState('');
  const [roleValue, setRoleValue] = useState<ConvoyRole>('CAPTAIN');

  if (isLoading || !convoy) return <Spinner />;

  return (
    <div>
      <button onClick={() => navigate('/comboios')} className={css({ display: 'flex', alignItems: 'center', gap: '1', color: 'text.muted', mb: '3', cursor: 'pointer', fontSize: '14px' })}>
        <ArrowLeft size={16} /> Voltar aos comboios
      </button>

      <PageHeader
        title={convoy.meetingPoint}
        description={`Saída ${formatDateTime(convoy.departureAt)}${convoy.destination ? ` → ${convoy.destination}` : ''}`}
        actions={
          <Flex gap="2">
            {convoy.routeUrl && (
              <a href={convoy.routeUrl} target="_blank" rel="noreferrer">
                <Button variant="secondary">
                  <Navigation size={16} /> Abrir rota
                </Button>
              </a>
            )}
            <Button onClick={() => join.mutate(undefined)} loading={join.isPending}>
              Confirmar presença
            </Button>
            <Button variant="secondary" onClick={() => checkIn.mutate()} loading={checkIn.isPending}>
              <Flag size={16} /> Cheguei no ponto
            </Button>
          </Flex>
        }
      />

      <Grid columns={{ base: 2, md: 3 }} gap="4" mb="5">
        <StatTile label="Confirmados" value={board?.confirmed ?? convoy._count?.participants ?? 0} tone="brand" />
        <StatTile label="No ponto / chegaram" value={board?.checkedInOrArrived ?? 0} tone="success" />
        <StatTile label="Ainda não chegaram" value={board?.pending.length ?? 0} tone="warning" />
      </Grid>

      <Grid columns={{ base: 1, lg: 2 }} gap="5">
        <Card>
          <h2 className={css({ textStyle: 'h3', mb: '3' })}>Papéis da viagem</h2>
          <Flex direction="column" gap="2" mb={canManage ? '4' : '0'}>
            {convoy.assignments?.length ? (
              convoy.assignments.map((a) => (
                <Flex key={a.id} align="center" justify="space-between">
                  <Flex align="center" gap="2">
                    <Shield size={14} color="var(--colors-brand)" />
                    <span className={css({ fontSize: '14px' })}>
                      {roleLabel[a.role]}: {a.member.fullName}
                    </span>
                  </Flex>
                  {canManage && (
                    <button onClick={() => unassignRole.mutate(a.id)} className={css({ color: 'text.muted', cursor: 'pointer', fontSize: '12px' })}>
                      remover
                    </button>
                  )}
                </Flex>
              ))
            ) : (
              <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>Nenhum papel definido ainda.</p>
            )}
          </Flex>
          {canManage && (
            <Flex gap="2" wrap="wrap">
              <Select value={roleMember} onChange={(e) => setRoleMember(e.target.value)} className={css({ flex: 1, minW: '160px' })}>
                <option value="">Selecione o membro</option>
                {membersPage?.data.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName}
                  </option>
                ))}
              </Select>
              <Select value={roleValue} onChange={(e) => setRoleValue(e.target.value as ConvoyRole)} className={css({ flex: 1, minW: '140px' })}>
                {Object.entries(roleLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Button
                size="sm"
                disabled={!roleMember}
                onClick={() => assignRole.mutate({ memberId: roleMember, role: roleValue }, { onSuccess: () => setRoleMember('') })}
              >
                <Plus size={14} /> Definir
              </Button>
            </Flex>
          )}

          {convoy.stops && convoy.stops.length > 0 && (
            <div className={css({ mt: '5' })}>
              <h3 className={css({ textStyle: 'label', color: 'text.muted', mb: '2' })}>Paradas</h3>
              <Flex direction="column" gap="1.5">
                {convoy.stops
                  .sort((a, b) => a.sequence - b.sequence)
                  .map((s) => (
                    <p key={s.id} className={css({ fontSize: '14px' })}>
                      {s.sequence}. {s.location}
                    </p>
                  ))}
              </Flex>
            </div>
          )}
        </Card>

        <Card>
          <h2 className={css({ textStyle: 'h3', mb: '3' })}>Participantes</h2>
          <Flex direction="column" gap="2" maxH="420px" overflowY="auto">
            {convoy.participants?.map((p) => (
              <Flex key={p.id} align="center" justify="space-between">
                <Flex align="center" gap="2">
                  <Avatar name={p.member.fullName} photoUrl={p.member.photoUrl} size={28} />
                  <div>
                    <p className={css({ fontSize: '14px', fontWeight: '600' })}>{p.member.fullName}</p>
                    {canManage && p.member.phone && (
                      <Flex align="center" gap="1" className={css({ color: 'text.muted', fontSize: '12px' })}>
                        <Phone size={11} /> {p.member.phone}
                      </Flex>
                    )}
                  </div>
                </Flex>
                <Badge tone={p.status === 'ARRIVED' || p.status === 'CHECKED_IN' ? 'success' : p.status === 'NO_SHOW' ? 'danger' : 'neutral'}>
                  {p.status}
                </Badge>
              </Flex>
            ))}
            {!convoy.participants?.length && <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>Ninguém confirmou ainda.</p>}
          </Flex>
        </Card>
      </Grid>
    </div>
  );
}

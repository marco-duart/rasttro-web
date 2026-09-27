import { useState } from 'react';
import { useNavigate } from 'react-router';
import { UserPlus, Users } from 'lucide-react';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Input } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { Button } from '../../design-system/Button';
import { Badge } from '../../design-system/Badge';
import { Avatar } from '../../design-system/Avatar';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { Pagination } from '../../design-system/Pagination';
import { useMembers } from '../../features/members/hooks';
import { useMembershipStages } from '../../features/membership-stages/hooks';
import { useChapters } from '../../features/clubs/hooks';
import { useCurrentPermissions } from '../../features/clubs/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import { MemberFormDialog } from './MemberFormDialog';
import type { MemberStatus } from '../../api/types';

const statusLabel: Record<MemberStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  SUSPENDED: 'Suspenso',
  LEFT: 'Desligado',
};

const statusTone: Record<MemberStatus, 'success' | 'neutral' | 'warning' | 'danger'> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  SUSPENDED: 'warning',
  LEFT: 'danger',
};

export function MembersListPage() {
  const navigate = useNavigate();
  const { has } = useCurrentPermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [membershipStageId, setMembershipStageId] = useState('');
  const [status, setStatus] = useState<MemberStatus | ''>('ACTIVE');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isFetching } = useMembers({
    page,
    pageSize: 20,
    search: search || undefined,
    chapterId: chapterId || undefined,
    membershipStageId: membershipStageId || undefined,
    status: status || undefined,
  });
  const { data: stages } = useMembershipStages();
  const { data: chapters } = useChapters();

  const canManage = has(PERMISSIONS.MEMBERS_MANAGE);

  return (
    <div>
      <PageHeader
        title="Membros"
        description="Quadro de membros do clube — busque por nome ou apelido."
        actions={
          canManage && (
            <Button onClick={() => setDialogOpen(true)}>
              <UserPlus size={16} /> Novo membro
            </Button>
          )
        }
      />

      <Card className={css({ mb: '4' })}>
        <Flex gap="3" wrap="wrap" align="flex-end">
          <div className={css({ flex: '2', minW: '220px' })}>
            <Input
              placeholder="Buscar por nome ou apelido"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className={css({ flex: '1', minW: '160px' })}>
            <Select value={status} onChange={(e) => { setStatus(e.target.value as MemberStatus | ''); setPage(1); }}>
              <option value="">Todos os status</option>
              {Object.entries(statusLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className={css({ flex: '1', minW: '160px' })}>
            <Select value={membershipStageId} onChange={(e) => { setMembershipStageId(e.target.value); setPage(1); }}>
              <option value="">Todos os estágios</option>
              {stages?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          {chapters && chapters.length > 0 && (
            <div className={css({ flex: '1', minW: '160px' })}>
              <Select value={chapterId} onChange={(e) => { setChapterId(e.target.value); setPage(1); }}>
                <option value="">Todos os regionais</option>
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </Flex>
      </Card>

      {isLoading ? (
        <Spinner />
      ) : !data || data.data.length === 0 ? (
        <EmptyState icon={<Users size={32} />} title="Nenhum membro encontrado" description="Ajuste os filtros ou cadastre o primeiro membro." />
      ) : (
        <Card className={css({ p: '0', opacity: isFetching ? 0.7 : 1 })}>
          <table className={css({ width: '100%', borderCollapse: 'collapse' })}>
            <thead>
              <tr className={css({ borderBottom: '1px solid', borderColor: 'border' })}>
                {['Membro', 'Estágio', 'Cargo', 'Regional', 'Status'].map((h) => (
                  <th key={h} className={css({ textAlign: 'left', p: '3', textStyle: 'label', color: 'text.muted' })}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((member) => (
                <tr
                  key={member.id}
                  onClick={() => navigate(`/membros/${member.id}`)}
                  className={css({ borderBottom: '1px solid', borderColor: 'border', cursor: 'pointer', _hover: { bg: 'surface.elevated' }, _last: { borderBottom: 'none' } })}
                >
                  <td className={css({ p: '3' })}>
                    <Flex align="center" gap="2.5">
                      <Avatar name={member.fullName} photoUrl={member.photoUrl} size={32} />
                      <div>
                        <p className={css({ fontWeight: '600', fontSize: '14px' })}>{member.fullName}</p>
                        {member.nickname && <p className={css({ textStyle: 'caption', color: 'text.muted' })}>"{member.nickname}"</p>}
                      </div>
                    </Flex>
                  </td>
                  <td className={css({ p: '3', fontSize: '14px', color: 'text.muted' })}>{member.membershipStage?.name ?? '—'}</td>
                  <td className={css({ p: '3', fontSize: '14px', color: 'text.muted' })}>
                    {member.roleAssignments?.map((ra) => ra.role.name).join(', ') || '—'}
                  </td>
                  <td className={css({ p: '3', fontSize: '14px', color: 'text.muted' })}>{member.chapter?.name ?? '—'}</td>
                  <td className={css({ p: '3' })}>
                    <Badge tone={statusTone[member.status]}>{statusLabel[member.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {data && <Pagination meta={data.meta} onPageChange={setPage} />}

      {dialogOpen && <MemberFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />}
    </div>
  );
}

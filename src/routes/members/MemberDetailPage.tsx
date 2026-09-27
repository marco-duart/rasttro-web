import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { ArrowLeft, Bike, Phone, Mail, Shield, TrendingUp, UserX, Receipt, Award } from 'lucide-react';
import { Card } from '../../design-system/Card';
import { Avatar } from '../../design-system/Avatar';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { Select } from '../../design-system/Select';
import { ConfirmDialog } from '../../design-system/ConfirmDialog';
import { Dialog } from '../../design-system/Dialog';
import { useMember, useMemberTimeline, useMemberMotorcycles, useDeactivateMember, useChangeMemberStage } from '../../features/members/hooks';
import { useMembershipStages } from '../../features/membership-stages/hooks';
import { useRoles, useAssignRole, useEndRoleAssignment } from '../../features/roles/hooks';
import { useMemberCharges } from '../../features/finance/hooks';
import { useMemberTitles, useTitles, useAwardTitle, useRevokeTitle } from '../../features/titles/hooks';
import { useCurrentPermissions } from '../../features/clubs/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import { formatCentsToBRL, formatDate } from '../../lib/format';
import type { MemberStatus } from '../../api/types';

const statusLabel: Record<MemberStatus, string> = { ACTIVE: 'Ativo', INACTIVE: 'Inativo', SUSPENDED: 'Suspenso', LEFT: 'Desligado' };
const statusTone: Record<MemberStatus, 'success' | 'neutral' | 'warning' | 'danger'> = { ACTIVE: 'success', INACTIVE: 'neutral', SUSPENDED: 'warning', LEFT: 'danger' };

export function MemberDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { has } = useCurrentPermissions();
  const canManage = has(PERMISSIONS.MEMBERS_MANAGE);
  const canManageRoles = has(PERMISSIONS.ROLES_MANAGE);
  const canManageProspects = has(PERMISSIONS.PROSPECTS_MANAGE, PERMISSIONS.PROSPECTS_APPROVE);
  const canManageTitles = has(PERMISSIONS.TITLES_MANAGE);

  const { data: member, isLoading } = useMember(id);
  const { data: timeline } = useMemberTimeline(id);
  const { data: motorcycles } = useMemberMotorcycles(id);
  const { data: charges } = useMemberCharges(id);
  const { data: stages } = useMembershipStages();
  const { data: roles } = useRoles();
  const { data: memberTitles } = useMemberTitles(id);
  const { data: titleCatalog } = useTitles();

  const deactivate = useDeactivateMember();
  const changeStage = useChangeMemberStage(id);
  const assignRole = useAssignRole();
  const endAssignment = useEndRoleAssignment();
  const awardTitle = useAwardTitle(id);
  const revokeTitle = useRevokeTitle(id);

  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState('');
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [titleDialogOpen, setTitleDialogOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('');

  if (isLoading || !member) return <Spinner />;

  return (
    <div>
      <button onClick={() => navigate('/membros')} className={css({ display: 'flex', alignItems: 'center', gap: '1', color: 'text.muted', mb: '3', cursor: 'pointer', fontSize: '14px' })}>
        <ArrowLeft size={16} /> Voltar aos membros
      </button>

      <Card className={css({ mb: '5' })}>
        <Flex gap="4" align="flex-start" wrap="wrap">
          <Avatar name={member.fullName} photoUrl={member.photoUrl} size={64} />
          <div className={css({ flex: 1, minW: '200px' })}>
            <Flex align="center" gap="2" wrap="wrap">
              <h1 className={css({ textStyle: 'h2' })}>{member.fullName}</h1>
              {member.nickname && <span className={css({ color: 'text.muted' })}>"{member.nickname}"</span>}
              <Badge tone={statusTone[member.status]}>{statusLabel[member.status]}</Badge>
              {member.isFounder && <Badge tone="brand">Fundador</Badge>}
              {member.displayTitle && (
                <Badge tone="warning">
                  <Award size={12} /> {member.displayTitle.name}
                </Badge>
              )}
            </Flex>
            <Flex gap="4" mt="2" wrap="wrap" className={css({ color: 'text.muted', fontSize: '14px' })}>
              {member.phone && (
                <Flex align="center" gap="1">
                  <Phone size={14} /> {member.phone}
                </Flex>
              )}
              {member.email && (
                <Flex align="center" gap="1">
                  <Mail size={14} /> {member.email}
                </Flex>
              )}
              <span>Membro nº {member.memberNumber ?? '—'}</span>
              <span>Desde {formatDate(member.joinedAt)}</span>
            </Flex>
            <Flex gap="2" mt="2" wrap="wrap">
              {member.roleAssignments?.map((ra) => (
                <Badge key={ra.id} tone="neutral">
                  <Shield size={12} /> {ra.role.name}
                  {canManageRoles && (
                    <button onClick={() => endAssignment.mutate(ra.id)} className={css({ ml: '1', cursor: 'pointer' })} aria-label={`Remover cargo ${ra.role.name}`}>
                      ×
                    </button>
                  )}
                </Badge>
              ))}
              {member.membershipStage && <Badge tone="brand">{member.membershipStage.name}</Badge>}
            </Flex>
          </div>
          <Flex gap="2" wrap="wrap">
            {canManageRoles && (
              <Button variant="secondary" size="sm" onClick={() => setRoleDialogOpen(true)}>
                <Shield size={14} /> Atribuir cargo
              </Button>
            )}
            {canManageProspects && (
              <Button variant="secondary" size="sm" onClick={() => setStageDialogOpen(true)}>
                <TrendingUp size={14} /> Mudar estágio
              </Button>
            )}
            {canManageTitles && (
              <Button variant="secondary" size="sm" onClick={() => setTitleDialogOpen(true)}>
                <Award size={14} /> Atribuir título
              </Button>
            )}
            {canManage && member.status === 'ACTIVE' && (
              <Button variant="danger" size="sm" onClick={() => setConfirmDeactivate(true)}>
                <UserX size={14} /> Desligar
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>

      <Grid columns={{ base: 1, lg: 2 }} gap="5">
        <Card>
          <h2 className={css({ textStyle: 'h3', mb: '3' })}>Linha do tempo</h2>
          {!timeline || timeline.length === 0 ? (
            <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>Sem eventos registrados ainda.</p>
          ) : (
            <Flex direction="column" gap="3">
              {timeline.map((entry, idx) => (
                <div key={idx} className={css({ display: 'flex', gap: '3', fontSize: '14px' })}>
                  <span className={css({ color: 'text.muted', flexShrink: 0, minW: '90px' })}>{formatDate(entry.date)}</span>
                  <span>{entry.title}</span>
                </div>
              ))}
            </Flex>
          )}
        </Card>

        <Flex direction="column" gap="5">
          <Card>
            <Flex align="center" justify="space-between" mb="3">
              <h2 className={css({ textStyle: 'h3' })}>Títulos</h2>
              <Award size={18} color="var(--colors-text-muted)" />
            </Flex>
            {!memberTitles || memberTitles.length === 0 ? (
              <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>Nenhum título recebido ainda.</p>
            ) : (
              <Flex direction="column" gap="2">
                {memberTitles.map((mt) => (
                  <Flex key={mt.id} align="center" justify="space-between">
                    <div>
                      <p className={css({ fontSize: '14px', fontWeight: '600' })}>{mt.title.name}</p>
                      {mt.notes && <p className={css({ textStyle: 'caption', color: 'text.muted' })}>{mt.notes}</p>}
                    </div>
                    {canManageTitles && (
                      <button
                        onClick={() => revokeTitle.mutate(mt.titleId)}
                        className={css({ color: 'text.muted', cursor: 'pointer', fontSize: '12px', _hover: { color: 'danger' } })}
                      >
                        revogar
                      </button>
                    )}
                  </Flex>
                ))}
              </Flex>
            )}
          </Card>

          <Card>
            <Flex align="center" justify="space-between" mb="3">
              <h2 className={css({ textStyle: 'h3' })}>Motocicletas</h2>
              <Bike size={18} color="var(--colors-text-muted)" />
            </Flex>
            {!motorcycles || motorcycles.length === 0 ? (
              <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>Nenhuma moto cadastrada.</p>
            ) : (
              <Flex direction="column" gap="2">
                {motorcycles.map((m) => (
                  <div key={m.id} className={css({ fontSize: '14px' })}>
                    {m.brand} {m.model} {m.year ? `(${m.year})` : ''} {m.nickname && `— "${m.nickname}"`}
                    {m.isPrimary && (
                      <Badge tone="brand" className={css({ ml: '2' })}>
                        Principal
                      </Badge>
                    )}
                  </div>
                ))}
              </Flex>
            )}
          </Card>

          {has(PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_MANAGE) && (
            <Card>
              <Flex align="center" justify="space-between" mb="3">
                <h2 className={css({ textStyle: 'h3' })}>Mensalidades</h2>
                <Receipt size={18} color="var(--colors-text-muted)" />
              </Flex>
              {!charges || charges.length === 0 ? (
                <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>Nenhuma cobrança ainda.</p>
              ) : (
                <Flex direction="column" gap="2">
                  {charges.slice(0, 6).map((c) => (
                    <Flex key={c.id} justify="space-between" fontSize="14px">
                      <span>{formatDate(c.referenceMonth)}</span>
                      <span>{formatCentsToBRL(c.amountCents)}</span>
                      <Badge tone={c.status === 'PAID' ? 'success' : c.status === 'OVERDUE' ? 'danger' : 'neutral'}>{c.status}</Badge>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Card>
          )}
        </Flex>
      </Grid>

      <ConfirmDialog
        open={confirmDeactivate}
        title="Desligar este membro?"
        description={`${member.fullName} perderá o status de membro ativo. Esta ação fica registrada no histórico.`}
        confirmLabel="Desligar"
        danger
        loading={deactivate.isPending}
        onConfirm={() => deactivate.mutate({ id }, { onSuccess: () => setConfirmDeactivate(false) })}
        onClose={() => setConfirmDeactivate(false)}
      />

      <Dialog open={stageDialogOpen} onClose={() => setStageDialogOpen(false)} title="Mudar estágio">
        <Flex direction="column" gap="4">
          <Select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
            <option value="">Selecione o novo estágio</option>
            {stages?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Flex justify="flex-end" gap="2">
            <Button variant="ghost" onClick={() => setStageDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!selectedStage}
              loading={changeStage.isPending}
              onClick={() => changeStage.mutate({ stageId: selectedStage }, { onSuccess: () => setStageDialogOpen(false) })}
            >
              Confirmar
            </Button>
          </Flex>
        </Flex>
      </Dialog>

      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} title="Atribuir cargo">
        <Flex direction="column" gap="4">
          <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="">Selecione o cargo</option>
            {roles?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Select>
          <Flex justify="flex-end" gap="2">
            <Button variant="ghost" onClick={() => setRoleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!selectedRole}
              loading={assignRole.isPending}
              onClick={() => assignRole.mutate({ memberId: id, roleId: selectedRole }, { onSuccess: () => setRoleDialogOpen(false) })}
            >
              Confirmar
            </Button>
          </Flex>
        </Flex>
      </Dialog>

      <Dialog open={titleDialogOpen} onClose={() => setTitleDialogOpen(false)} title="Atribuir título">
        <Flex direction="column" gap="4">
          <Select value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)}>
            <option value="">Selecione o título</option>
            {titleCatalog
              ?.filter((t) => !memberTitles?.some((mt) => mt.titleId === t.id))
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </Select>
          <Flex justify="flex-end" gap="2">
            <Button variant="ghost" onClick={() => setTitleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!selectedTitle}
              loading={awardTitle.isPending}
              onClick={() =>
                awardTitle.mutate(
                  { titleId: selectedTitle },
                  { onSuccess: () => { setTitleDialogOpen(false); setSelectedTitle(''); } },
                )
              }
            >
              Confirmar
            </Button>
          </Flex>
        </Flex>
      </Dialog>
    </div>
  );
}

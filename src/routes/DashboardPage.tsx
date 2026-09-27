import { useNavigate } from 'react-router';
import { css } from 'styled-system/css';
import { Grid, Flex } from 'styled-system/jsx';
import { Users, UserPlus, Wallet, AlertTriangle, Gavel, PartyPopper, ArrowRight } from 'lucide-react';
import { PageHeader } from '../design-system/PageHeader';
import { StatTile } from '../design-system/StatTile';
import { Card } from '../design-system/Card';
import { Button } from '../design-system/Button';
import { useMembers } from '../features/members/hooks';
import { useMembershipStages } from '../features/membership-stages/hooks';
import { useFinanceSummary } from '../features/finance/hooks';
import { useMeetings } from '../features/meetings/hooks';
import { useEvents } from '../features/events/hooks';
import { useCurrentPermissions, useCurrentClub } from '../features/clubs/hooks';
import { PERMISSIONS } from '../lib/permissions';
import { formatCentsToBRL, formatDateTime } from '../lib/format';

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: club } = useCurrentClub();
  const { has } = useCurrentPermissions();
  const { data: activeMembers } = useMembers({ status: 'ACTIVE', pageSize: 1 });
  const { data: stages } = useMembershipStages();
  const canSeeFinance = has(PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_MANAGE);
  const { data: financeSummary } = useFinanceSummary();
  const { data: meetings } = useMeetings();
  const { data: events } = useEvents(true);

  const prospectStages = stages?.filter((s) => s.isProspectStage) ?? [];
  const prospectsCount = prospectStages.reduce((sum, s) => sum + (s._count?.members ?? 0), 0);

  const nextMeeting = meetings?.filter((m) => new Date(m.startsAt) > new Date() && m.status !== 'CANCELLED').sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
  const nextEvent = events?.[0];
  const overdue = financeSummary?.charges.find((c) => c.status === 'OVERDUE');

  return (
    <div>
      <PageHeader title={`Olá, ${club?.name ?? ''} 👋`} description="Aqui está o que precisa da sua atenção agora." />

      <Grid columns={{ base: 2, md: 4 }} gap="4" mb="6">
        <StatTile
          label="Membros ativos"
          value={activeMembers?.meta.total ?? '—'}
          icon={<Users size={18} />}
          tone="brand"
          action={
            <button onClick={() => navigate('/membros')} className={css({ color: 'brand', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '1', cursor: 'pointer' })}>
              Ver todos <ArrowRight size={12} />
            </button>
          }
        />
        {prospectStages.length > 0 && (
          <StatTile
            label="Prospects"
            value={prospectsCount}
            hint="Veja o funil completo"
            icon={<UserPlus size={18} />}
            action={
              <button onClick={() => navigate('/prospects')} className={css({ color: 'brand', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '1', cursor: 'pointer' })}>
                Abrir funil <ArrowRight size={12} />
              </button>
            }
          />
        )}
        {canSeeFinance && financeSummary && (
          <>
            <StatTile
              label="Saldo do mês"
              value={formatCentsToBRL(financeSummary.incomeCents - financeSummary.expenseCents)}
              icon={<Wallet size={18} />}
              tone={financeSummary.incomeCents - financeSummary.expenseCents >= 0 ? 'success' : 'danger'}
              action={
                <button onClick={() => navigate('/financeiro')} className={css({ color: 'brand', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '1', cursor: 'pointer' })}>
                  Ver financeiro <ArrowRight size={12} />
                </button>
              }
            />
            <StatTile
              label="Inadimplência"
              value={overdue?.count ?? 0}
              hint={overdue ? formatCentsToBRL(overdue.amountCents) : 'Tudo em dia'}
              icon={<AlertTriangle size={18} />}
              tone={overdue ? 'warning' : 'success'}
              action={
                <button onClick={() => navigate('/financeiro/mensalidades')} className={css({ color: 'brand', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '1', cursor: 'pointer' })}>
                  Ver cobranças <ArrowRight size={12} />
                </button>
              }
            />
          </>
        )}
      </Grid>

      <Grid columns={{ base: 1, md: 2 }} gap="5">
        <Card>
          <Flex align="center" justify="space-between" mb="3">
            <h2 className={css({ textStyle: 'h3' })}>Próxima reunião</h2>
            <Gavel size={18} color="var(--colors-text-muted)" />
          </Flex>
          {nextMeeting ? (
            <>
              <p className={css({ fontWeight: '600' })}>{nextMeeting.title}</p>
              <p className={css({ textStyle: 'bodySm', color: 'text.muted', mb: '3' })}>{formatDateTime(nextMeeting.startsAt)}</p>
              <Button variant="secondary" size="sm" onClick={() => navigate(`/reunioes/${nextMeeting.id}`)}>
                Ver detalhes
              </Button>
            </>
          ) : (
            <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>Nenhuma reunião agendada.</p>
          )}
        </Card>

        <Card>
          <Flex align="center" justify="space-between" mb="3">
            <h2 className={css({ textStyle: 'h3' })}>Próximo evento</h2>
            <PartyPopper size={18} color="var(--colors-text-muted)" />
          </Flex>
          {nextEvent ? (
            <>
              <p className={css({ fontWeight: '600' })}>{nextEvent.title}</p>
              <p className={css({ textStyle: 'bodySm', color: 'text.muted', mb: '3' })}>{formatDateTime(nextEvent.startsAt)}</p>
              <Button variant="secondary" size="sm" onClick={() => navigate(`/eventos/${nextEvent.id}`)}>
                Ver detalhes
              </Button>
            </>
          ) : (
            <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>Nenhum evento agendado.</p>
          )}
        </Card>
      </Grid>
    </div>
  );
}

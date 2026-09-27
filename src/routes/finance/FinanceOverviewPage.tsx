import { css } from 'styled-system/css';
import { Grid, Flex } from 'styled-system/jsx';
import { TrendingUp, TrendingDown, Wallet, AlertCircle, RefreshCw } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { StatTile } from '../../design-system/StatTile';
import { Card } from '../../design-system/Card';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { useFinanceSummary, useGenerateMonth } from '../../features/finance/hooks';
import { useCurrentPermissions } from '../../features/clubs/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import { formatCentsToBRL } from '../../lib/format';

export function FinanceOverviewPage() {
  const { data: summary, isLoading } = useFinanceSummary();
  const { has } = useCurrentPermissions();
  const generateMonth = useGenerateMonth();

  if (isLoading || !summary) return <Spinner />;

  const balance = summary.incomeCents - summary.expenseCents;
  const overdue = summary.charges.find((c) => c.status === 'OVERDUE');
  const pending = summary.charges.find((c) => c.status === 'PENDING');

  return (
    <div>
      <PageHeader
        title="Financeiro"
        description="Visão geral do mês corrente."
        actions={
          has(PERMISSIONS.FINANCE_MANAGE) && (
            <Button variant="secondary" onClick={() => generateMonth.mutate()} loading={generateMonth.isPending}>
              <RefreshCw size={16} /> Gerar mensalidades do mês
            </Button>
          )
        }
      />

      <Grid columns={{ base: 2, md: 4 }} gap="4" mb="5">
        <StatTile label="Receitas do mês" value={formatCentsToBRL(summary.incomeCents)} icon={<TrendingUp size={18} />} tone="success" />
        <StatTile label="Despesas do mês" value={formatCentsToBRL(summary.expenseCents)} icon={<TrendingDown size={18} />} tone="danger" />
        <StatTile label="Saldo do mês" value={formatCentsToBRL(balance)} icon={<Wallet size={18} />} tone={balance >= 0 ? 'success' : 'danger'} />
        <StatTile
          label="Mensalidades vencidas"
          value={overdue?.count ?? 0}
          hint={overdue ? formatCentsToBRL(overdue.amountCents) : undefined}
          icon={<AlertCircle size={18} />}
          tone="warning"
        />
      </Grid>

      <Card>
        <h2 className={css({ textStyle: 'h3', mb: '3' })}>Cobranças por status</h2>
        <Flex gap="6" wrap="wrap">
          {summary.charges.map((c) => (
            <div key={c.status}>
              <p className={css({ textStyle: 'caption', color: 'text.muted' })}>{c.status}</p>
              <p className={css({ fontWeight: '700' })}>{c.count}</p>
              <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>{formatCentsToBRL(c.amountCents)}</p>
            </div>
          ))}
          {summary.charges.length === 0 && <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>Nenhuma cobrança neste período.</p>}
        </Flex>
        {pending && <p className={css({ textStyle: 'caption', color: 'text.muted', mt: '3' })}>{pending.count} cobrança(s) pendente(s) aguardando pagamento.</p>}
      </Card>
    </div>
  );
}

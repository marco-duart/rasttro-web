import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { Receipt, Plus, CheckCircle2, Ban, XCircle } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Select } from '../../design-system/Select';
import { Input } from '../../design-system/Input';
import { Field } from '../../design-system/Field';
import { Dialog } from '../../design-system/Dialog';
import { Avatar } from '../../design-system/Avatar';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { Pagination } from '../../design-system/Pagination';
import { useCharges, useFeeRules, useCreateFeeRule, useRegisterPayment, useWaiveCharge, useCancelCharge } from '../../features/finance/hooks';
import { useCurrentPermissions } from '../../features/clubs/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import { formatCentsToBRL, formatMonth, formatDate } from '../../lib/format';
import type { ChargeStatus, PaymentMethod } from '../../api/types';

const statusLabel: Record<ChargeStatus, string> = { PENDING: 'Pendente', PAID: 'Pago', OVERDUE: 'Vencido', WAIVED: 'Isento', CANCELLED: 'Cancelado' };
const statusTone: Record<ChargeStatus, 'neutral' | 'success' | 'danger' | 'warning'> = { PENDING: 'neutral', PAID: 'success', OVERDUE: 'danger', WAIVED: 'warning', CANCELLED: 'neutral' };

interface FeeRuleForm {
  amountReais: string;
  dueDay: number;
}

export function ChargesPage() {
  const { has } = useCurrentPermissions();
  const canManage = has(PERMISSIONS.FINANCE_MANAGE);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ChargeStatus | ''>('');
  const { data, isLoading } = useCharges({ page, pageSize: 20, status: status || undefined });
  const { data: feeRules } = useFeeRules();
  const createFeeRule = useCreateFeeRule();
  const registerPayment = useRegisterPayment();
  const waiveCharge = useWaiveCharge();
  const cancelCharge = useCancelCharge();
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FeeRuleForm>({ defaultValues: { dueDay: 10 } });

  const activeRule = feeRules?.find((r) => r.isActive);

  return (
    <div>
      <PageHeader
        title="Mensalidades"
        description={activeRule ? `Regra atual: ${formatCentsToBRL(activeRule.amountCents)} · vencimento dia ${activeRule.dueDay}` : 'Nenhuma regra de mensalidade configurada.'}
        actions={
          canManage && (
            <Button variant="secondary" onClick={() => setRuleDialogOpen(true)}>
              <Plus size={16} /> {activeRule ? 'Nova regra' : 'Configurar mensalidade'}
            </Button>
          )
        }
      />

      <Flex gap="3" mb="4">
        <Select value={status} onChange={(e) => { setStatus(e.target.value as ChargeStatus | ''); setPage(1); }} className={css({ maxW: '220px' })}>
          <option value="">Todos os status</option>
          {Object.entries(statusLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Flex>

      {isLoading ? (
        <Spinner />
      ) : !data || data.data.length === 0 ? (
        <EmptyState icon={<Receipt size={32} />} title="Nenhuma cobrança encontrada" />
      ) : (
        <Card className={css({ p: '0' })}>
          <table className={css({ width: '100%', borderCollapse: 'collapse' })}>
            <thead>
              <tr className={css({ borderBottom: '1px solid', borderColor: 'border' })}>
                {['Membro', 'Referência', 'Valor', 'Vencimento', 'Status', canManage ? 'Ações' : ''].map((h) => (
                  <th key={h} className={css({ textAlign: 'left', p: '3', textStyle: 'label', color: 'text.muted' })}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((charge) => (
                <tr key={charge.id} className={css({ borderBottom: '1px solid', borderColor: 'border', _last: { borderBottom: 'none' } })}>
                  <td className={css({ p: '3' })}>
                    <Flex align="center" gap="2">
                      <Avatar name={charge.member?.fullName ?? '?'} photoUrl={charge.member?.photoUrl} size={26} />
                      <span className={css({ fontSize: '14px' })}>{charge.member?.fullName}</span>
                    </Flex>
                  </td>
                  <td className={css({ p: '3', fontSize: '14px', color: 'text.muted', textTransform: 'capitalize' })}>{formatMonth(charge.referenceMonth)}</td>
                  <td className={css({ p: '3', fontSize: '14px' })}>{formatCentsToBRL(charge.amountCents)}</td>
                  <td className={css({ p: '3', fontSize: '14px', color: 'text.muted' })}>{formatDate(charge.dueDate)}</td>
                  <td className={css({ p: '3' })}>
                    <Badge tone={statusTone[charge.status]}>{statusLabel[charge.status]}</Badge>
                  </td>
                  <td className={css({ p: '3' })}>
                    {canManage && (charge.status === 'PENDING' || charge.status === 'OVERDUE') && (
                      <Flex gap="1">
                        <button
                          title="Registrar pagamento"
                          onClick={() => registerPayment.mutate({ id: charge.id, paymentMethod: 'PIX' as PaymentMethod })}
                          className={css({ color: 'success', cursor: 'pointer' })}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button title="Isentar" onClick={() => waiveCharge.mutate({ id: charge.id })} className={css({ color: 'warning', cursor: 'pointer' })}>
                          <Ban size={18} />
                        </button>
                        <button title="Cancelar" onClick={() => cancelCharge.mutate({ id: charge.id })} className={css({ color: 'danger', cursor: 'pointer' })}>
                          <XCircle size={18} />
                        </button>
                      </Flex>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {data && <Pagination meta={data.meta} onPageChange={setPage} />}

      <Dialog open={ruleDialogOpen} onClose={() => setRuleDialogOpen(false)} title="Regra de mensalidade" description="Valor cobrado mensalmente de cada membro ativo.">
        <form
          onSubmit={handleSubmit((values) => {
            const amountCents = Math.round(Number(values.amountReais.replace(',', '.')) * 100);
            createFeeRule.mutate({ amountCents, dueDay: Number(values.dueDay) }, { onSuccess: () => { reset(); setRuleDialogOpen(false); } });
          })}
          className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
        >
          <Field label="Valor (R$)" required>
            <Input {...register('amountReais', { required: true })} placeholder="50,00" />
          </Field>
          <Field label="Dia de vencimento" required>
            <Input type="number" min={1} max={28} {...register('dueDay', { required: true })} />
          </Field>
          <Flex justify="flex-end" gap="2">
            <Button type="button" variant="ghost" onClick={() => setRuleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={createFeeRule.isPending}>
              Salvar
            </Button>
          </Flex>
        </form>
      </Dialog>
    </div>
  );
}

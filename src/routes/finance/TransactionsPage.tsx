import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { Landmark, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Select } from '../../design-system/Select';
import { Input } from '../../design-system/Input';
import { Field } from '../../design-system/Field';
import { Dialog } from '../../design-system/Dialog';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { Pagination } from '../../design-system/Pagination';
import { useTransactions, useCategories, useCreateTransaction, useRemoveTransaction } from '../../features/finance/hooks';
import { useCurrentPermissions } from '../../features/clubs/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import { formatCentsToBRL, formatDate } from '../../lib/format';
import type { TransactionType } from '../../api/types';

interface FormValues {
  type: TransactionType;
  amountReais: string;
  occurredAt: string;
  categoryId?: string;
  description?: string;
}

export function TransactionsPage() {
  const { has } = useCurrentPermissions();
  const canManage = has(PERMISSIONS.FINANCE_MANAGE);
  const [page, setPage] = useState(1);
  const [type, setType] = useState<TransactionType | ''>('');
  const { data, isLoading } = useTransactions({ page, pageSize: 20, type: type || undefined });
  const { data: categories } = useCategories();
  const create = useCreateTransaction();
  const remove = useRemoveTransaction();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: { type: 'EXPENSE' } });

  return (
    <div>
      <PageHeader
        title="Caixa"
        description={data ? `Receitas: ${formatCentsToBRL(data.totals.incomeCents)} · Despesas: ${formatCentsToBRL(data.totals.expenseCents)}` : undefined}
        actions={
          canManage && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus size={16} /> Novo lançamento
            </Button>
          )
        }
      />

      <Flex gap="3" mb="4">
        <Select value={type} onChange={(e) => { setType(e.target.value as TransactionType | ''); setPage(1); }} className={css({ maxW: '200px' })}>
          <option value="">Receitas e despesas</option>
          <option value="INCOME">Receitas</option>
          <option value="EXPENSE">Despesas</option>
        </Select>
      </Flex>

      {isLoading ? (
        <Spinner />
      ) : !data || data.data.length === 0 ? (
        <EmptyState icon={<Landmark size={32} />} title="Nenhum lançamento encontrado" />
      ) : (
        <Card className={css({ p: '0' })}>
          <table className={css({ width: '100%', borderCollapse: 'collapse' })}>
            <thead>
              <tr className={css({ borderBottom: '1px solid', borderColor: 'border' })}>
                {['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', ''].map((h) => (
                  <th key={h} className={css({ textAlign: 'left', p: '3', textStyle: 'label', color: 'text.muted' })}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((t) => (
                <tr key={t.id} className={css({ borderBottom: '1px solid', borderColor: 'border', _last: { borderBottom: 'none' } })}>
                  <td className={css({ p: '3', fontSize: '14px', color: 'text.muted' })}>{formatDate(t.occurredAt)}</td>
                  <td className={css({ p: '3', fontSize: '14px' })}>{t.description ?? '—'}</td>
                  <td className={css({ p: '3', fontSize: '14px', color: 'text.muted' })}>{t.category?.name ?? '—'}</td>
                  <td className={css({ p: '3' })}>
                    <Badge tone={t.type === 'INCOME' ? 'success' : 'danger'}>{t.type === 'INCOME' ? 'Receita' : 'Despesa'}</Badge>
                  </td>
                  <td className={css({ p: '3', fontSize: '14px', fontWeight: '600' })}>{formatCentsToBRL(t.amountCents)}</td>
                  <td className={css({ p: '3' })}>
                    {canManage && !t.chargeId && (
                      <button onClick={() => remove.mutate(t.id)} className={css({ color: 'text.muted', cursor: 'pointer', _hover: { color: 'danger' } })}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {data && <Pagination meta={data.meta} onPageChange={setPage} />}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Novo lançamento">
        <form
          onSubmit={handleSubmit((values) => {
            const amountCents = Math.round(Number(values.amountReais.replace(',', '.')) * 100);
            create.mutate(
              { ...values, amountCents, occurredAt: new Date(values.occurredAt).toISOString() },
              { onSuccess: () => { reset(); setDialogOpen(false); } },
            );
          })}
          className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
        >
          <Flex gap="4">
            <Field label="Tipo">
              <Select {...register('type')}>
                <option value="EXPENSE">Despesa</option>
                <option value="INCOME">Receita</option>
              </Select>
            </Field>
            <Field label="Data" required>
              <Input type="date" {...register('occurredAt', { required: true })} />
            </Field>
          </Flex>
          <Field label="Valor (R$)" required>
            <Input {...register('amountReais', { required: true })} placeholder="150,00" />
          </Field>
          <Field label="Categoria">
            <Select {...register('categoryId')}>
              <option value="">Sem categoria</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Descrição">
            <Input {...register('description')} />
          </Field>
          <Flex justify="flex-end" gap="2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={create.isPending}>
              Registrar
            </Button>
          </Flex>
        </form>
      </Dialog>
    </div>
  );
}

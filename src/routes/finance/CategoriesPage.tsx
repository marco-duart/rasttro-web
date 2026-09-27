import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { Tags, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Input } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { Field } from '../../design-system/Field';
import { Dialog } from '../../design-system/Dialog';
import { Spinner } from '../../design-system/Spinner';
import { useCategories, useCreateCategory, useRemoveCategory } from '../../features/finance/hooks';
import type { TransactionType } from '../../api/types';

interface FormValues {
  name: string;
  kind?: TransactionType;
}

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const create = useCreateCategory();
  const remove = useRemoveCategory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  return (
    <div>
      <PageHeader
        title="Categorias financeiras"
        description="Organize receitas e despesas por categoria."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus size={16} /> Nova categoria
          </Button>
        }
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <Grid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
          {categories?.map((c) => (
            <Card key={c.id}>
              <Flex justify="space-between" align="center">
                <div>
                  <p className={css({ fontWeight: '600' })}>{c.name}</p>
                  {c.kind && <Badge tone={c.kind === 'INCOME' ? 'success' : 'danger'}>{c.kind === 'INCOME' ? 'Receita' : 'Despesa'}</Badge>}
                </div>
                {!c.isDefault && (
                  <button onClick={() => remove.mutate(c.id)} className={css({ color: 'text.muted', cursor: 'pointer', _hover: { color: 'danger' } })}>
                    <Trash2 size={16} />
                  </button>
                )}
              </Flex>
            </Card>
          ))}
        </Grid>
      )}

      {categories?.length === 0 && <div className={css({ color: 'text.muted', textAlign: 'center', py: '10' })}><Tags size={32} /></div>}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Nova categoria">
        <form
          onSubmit={handleSubmit((values) => create.mutate(values, { onSuccess: () => { reset(); setDialogOpen(false); } }))}
          className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
        >
          <Field label="Nome" required>
            <Input {...register('name', { required: true })} />
          </Field>
          <Field label="Tipo (opcional)">
            <Select {...register('kind')}>
              <option value="">Ambos</option>
              <option value="INCOME">Receita</option>
              <option value="EXPENSE">Despesa</option>
            </Select>
          </Field>
          <Flex justify="flex-end" gap="2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={create.isPending}>
              Criar
            </Button>
          </Flex>
        </form>
      </Dialog>
    </div>
  );
}

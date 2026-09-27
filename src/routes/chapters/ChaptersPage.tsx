import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { Plus, MapPinned, Trash2 } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Button } from '../../design-system/Button';
import { Input } from '../../design-system/Input';
import { Field } from '../../design-system/Field';
import { Dialog } from '../../design-system/Dialog';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { ConfirmDialog } from '../../design-system/ConfirmDialog';
import { useChapters, useCreateChapter, useRemoveChapter } from '../../features/clubs/hooks';
import type { Chapter } from '../../api/types';

interface FormValues {
  name: string;
  code?: string;
  city?: string;
  state?: string;
}

export function ChaptersPage() {
  const { data: chapters, isLoading } = useChapters();
  const create = useCreateChapter();
  const remove = useRemoveChapter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<Chapter | null>(null);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  return (
    <div>
      <PageHeader
        title="Regionais"
        description="Se o clube tem capítulos ou regionais, organize-os aqui."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus size={16} /> Novo regional
          </Button>
        }
      />

      {isLoading ? (
        <Spinner />
      ) : !chapters || chapters.length === 0 ? (
        <EmptyState icon={<MapPinned size={32} />} title="Nenhum regional cadastrado" description="Clubes sem regionais podem ignorar esta tela." />
      ) : (
        <Grid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
          {chapters.map((chapter) => (
            <Card key={chapter.id}>
              <Flex justify="space-between" align="flex-start">
                <div>
                  <p className={css({ fontWeight: '700' })}>{chapter.name}</p>
                  <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>
                    {[chapter.city, chapter.state].filter(Boolean).join(' - ') || 'Sem localização'}
                  </p>
                  {chapter.code && <p className={css({ textStyle: 'caption', color: 'text.muted' })}>Código: {chapter.code}</p>}
                </div>
                <button onClick={() => setConfirmRemove(chapter)} className={css({ cursor: 'pointer', color: 'text.muted', _hover: { color: 'danger' } })}>
                  <Trash2 size={16} />
                </button>
              </Flex>
            </Card>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Novo regional">
        <form
          onSubmit={handleSubmit((values) => create.mutate(values, { onSuccess: () => { reset(); setDialogOpen(false); } }))}
          className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
        >
          <Field label="Nome" required>
            <Input {...register('name', { required: true })} placeholder="Regional Goiás" />
          </Field>
          <Grid columns={3} gap="3">
            <Field label="Código">
              <Input {...register('code')} />
            </Field>
            <Field label="Cidade">
              <Input {...register('city')} />
            </Field>
            <Field label="Estado">
              <Input {...register('state')} maxLength={2} />
            </Field>
          </Grid>
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

      <ConfirmDialog
        open={Boolean(confirmRemove)}
        title={`Remover "${confirmRemove?.name}"?`}
        danger
        confirmLabel="Remover"
        loading={remove.isPending}
        onConfirm={() => confirmRemove && remove.mutate(confirmRemove.id, { onSuccess: () => setConfirmRemove(null) })}
        onClose={() => setConfirmRemove(null)}
      />
    </div>
  );
}

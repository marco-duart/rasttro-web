import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { Dialog } from '../../design-system/Dialog';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Button } from '../../design-system/Button';
import { useCreateTitle, useUpdateTitle } from '../../features/titles/hooks';
import type { Title } from '../../api/types';

interface FormValues {
  name: string;
  description: string;
  color: string;
}

export function TitleFormDialog({ open, onClose, title }: { open: boolean; onClose: () => void; title?: Title | null }) {
  const create = useCreateTitle();
  const update = useUpdateTitle();
  const isEditing = Boolean(title);

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: title
      ? { name: title.name, description: title.description ?? '', color: title.color ?? '#D97721' }
      : { name: '', description: '', color: '#D97721' },
  });

  const onSubmit = handleSubmit((values) => {
    const onSuccess = () => onClose();
    if (isEditing && title) update.mutate({ id: title.id, ...values }, { onSuccess });
    else create.mutate(values, { onSuccess });
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar título' : 'Novo título'}
      description="Reconhecimento honorífico — não concede nenhuma permissão, é só distinção."
    >
      <form onSubmit={onSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Grid columns={3} gap="3">
          <div className={css({ gridColumn: 'span 2' })}>
            <Field label="Nome" required>
              <Input {...register('name', { required: true })} placeholder="Veterano" />
            </Field>
          </div>
          <Field label="Cor">
            <Input type="color" {...register('color')} className={css({ p: '1', h: '44px' })} />
          </Field>
        </Grid>
        <Field label="Descrição" hint="Critério de concessão, se quiser deixar registrado.">
          <Input {...register('description')} placeholder="10+ anos de estrada" />
        </Field>
        <Flex justify="flex-end" gap="2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={create.isPending || update.isPending}>
            Salvar
          </Button>
        </Flex>
      </form>
    </Dialog>
  );
}

import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { Dialog } from '../../design-system/Dialog';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { Textarea } from '../../design-system/Textarea';
import { Button } from '../../design-system/Button';
import { useCreateEvent } from '../../features/events/hooks';
import { eventTypeLabel } from '../../features/events/constants';
import type { EventType } from '../../api/types';

interface FormValues {
  title: string;
  type: EventType;
  startsAt: string;
  location?: string;
  description?: string;
}

export function EventFormDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateEvent();
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: { type: 'MEETUP' } });

  const onSubmit = handleSubmit((values) => {
    create.mutate({ ...values, startsAt: new Date(values.startsAt).toISOString() }, { onSuccess: () => { reset(); onClose(); } });
  });

  return (
    <Dialog open={open} onClose={onClose} title="Novo evento">
      <form onSubmit={onSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Field label="Título" required>
          <Input {...register('title', { required: true })} />
        </Field>
        <Grid columns={2} gap="4">
          <Field label="Tipo">
            <Select {...register('type')}>
              {Object.entries(eventTypeLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Data e hora" required>
            <Input type="datetime-local" {...register('startsAt', { required: true })} />
          </Field>
        </Grid>
        <Field label="Local">
          <Input {...register('location')} />
        </Field>
        <Field label="Descrição">
          <Textarea {...register('description')} rows={3} />
        </Field>
        <Flex justify="flex-end" gap="2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={create.isPending}>
            Criar evento
          </Button>
        </Flex>
      </form>
    </Dialog>
  );
}

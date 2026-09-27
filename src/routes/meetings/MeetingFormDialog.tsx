import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { Dialog } from '../../design-system/Dialog';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { Textarea } from '../../design-system/Textarea';
import { Button } from '../../design-system/Button';
import { useCreateMeeting } from '../../features/meetings/hooks';
import type { MeetingType } from '../../api/types';

interface FormValues {
  title: string;
  type: MeetingType;
  startsAt: string;
  location?: string;
  agenda?: string;
  mandatory: boolean;
}

const typeLabel: Record<MeetingType, string> = {
  ORDINARY: 'Reunião ordinária',
  EXTRAORDINARY: 'Reunião extraordinária',
  ASSEMBLY: 'Assembleia',
  BOARD: 'Reunião de diretoria',
};

export function MeetingFormDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateMeeting();
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: { type: 'ORDINARY', mandatory: false } });

  const onSubmit = handleSubmit((values) => {
    create.mutate(
      { ...values, startsAt: new Date(values.startsAt).toISOString() },
      { onSuccess: () => { reset(); onClose(); } },
    );
  });

  return (
    <Dialog open={open} onClose={onClose} title="Nova reunião" description="Todos os membros ativos são convocados automaticamente.">
      <form onSubmit={onSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Field label="Título" required>
          <Input {...register('title', { required: true })} placeholder="Reunião mensal de setembro" />
        </Field>
        <Grid columns={2} gap="4">
          <Field label="Tipo">
            <Select {...register('type')}>
              {Object.entries(typeLabel).map(([value, label]) => (
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
          <Input {...register('location')} placeholder="Sede do clube" />
        </Field>
        <Field label="Pauta">
          <Textarea {...register('agenda')} rows={4} />
        </Field>
        <label className={css({ display: 'flex', alignItems: 'center', gap: '2', fontSize: '14px' })}>
          <input type="checkbox" {...register('mandatory')} /> Presença obrigatória
        </label>
        <Flex justify="flex-end" gap="2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={create.isPending}>
            Criar reunião
          </Button>
        </Flex>
      </form>
    </Dialog>
  );
}

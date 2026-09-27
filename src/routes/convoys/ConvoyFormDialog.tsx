import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { Dialog } from '../../design-system/Dialog';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Button } from '../../design-system/Button';
import { useCreateConvoy } from '../../features/convoys/hooks';

interface FormValues {
  departureAt: string;
  meetingPoint: string;
  destination?: string;
  routeUrl?: string;
}

export function ConvoyFormDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateConvoy();
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit = handleSubmit((values) => {
    create.mutate({ ...values, departureAt: new Date(values.departureAt).toISOString() }, { onSuccess: () => { reset(); onClose(); } });
  });

  return (
    <Dialog open={open} onClose={onClose} title="Novo comboio">
      <form onSubmit={onSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Grid columns={2} gap="4">
          <Field label="Saída" required>
            <Input type="datetime-local" {...register('departureAt', { required: true })} />
          </Field>
          <Field label="Ponto de encontro" required>
            <Input {...register('meetingPoint', { required: true })} placeholder="Posto Ipiranga, BR-060" />
          </Field>
        </Grid>
        <Field label="Destino">
          <Input {...register('destination')} placeholder="Pirenópolis - GO" />
        </Field>
        <Field label="Link da rota (Google Maps/Waze)">
          <Input {...register('routeUrl')} placeholder="https://maps.google.com/..." />
        </Field>
        <Flex justify="flex-end" gap="2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={create.isPending}>
            Criar comboio
          </Button>
        </Flex>
      </form>
    </Dialog>
  );
}

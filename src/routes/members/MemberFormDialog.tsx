import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { css } from 'styled-system/css';
import { Grid } from 'styled-system/jsx';
import { Dialog } from '../../design-system/Dialog';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { Button } from '../../design-system/Button';
import { useCreateMember } from '../../features/members/hooks';
import { useMembershipStages } from '../../features/membership-stages/hooks';
import { useChapters } from '../../features/clubs/hooks';

const schema = z.object({
  fullName: z.string().min(2, 'Informe o nome completo.'),
  nickname: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
  chapterId: z.string().optional(),
  membershipStageId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface MemberFormDialogProps {
  open: boolean;
  onClose: () => void;
}

export function MemberFormDialog({ open, onClose }: MemberFormDialogProps) {
  const create = useCreateMember();
  const { data: stages } = useMembershipStages();
  const { data: chapters } = useChapters();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    create.mutate(
      { ...values, email: values.email || undefined },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={onClose} title="Novo membro" description="Cadastro manual — o membro também pode entrar sozinho via convite.">
      <form onSubmit={handleSubmit(onSubmit)} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Field label="Nome completo" error={errors.fullName?.message} required>
          <Input {...register('fullName')} />
        </Field>
        <Grid columns={2} gap="4">
          <Field label="Apelido">
            <Input {...register('nickname')} />
          </Field>
          <Field label="Telefone">
            <Input {...register('phone')} />
          </Field>
        </Grid>
        <Field label="E-mail" error={errors.email?.message}>
          <Input type="email" {...register('email')} />
        </Field>
        <Grid columns={2} gap="4">
          <Field label="Estágio inicial">
            <Select {...register('membershipStageId')}>
              <option value="">Selecione</option>
              {stages?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Regional">
            <Select {...register('chapterId')}>
              <option value="">Nenhum</option>
              {chapters?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
        </Grid>
        <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2', mt: '2' })}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={create.isPending}>
            Cadastrar
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

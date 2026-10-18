import { Link, useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { css } from 'styled-system/css';
import { AuthLayout } from './AuthLayout';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Button } from '../../design-system/Button';
import { authApi } from '../../features/auth/api';
import { apiErrorMessage } from '../../lib/errors';
import { toast } from '../../stores/toast.store';

const schema = z
  .object({
    newPassword: z.string().min(8, 'Use pelo menos 8 caracteres.').max(72, 'No máximo 72 caracteres.'),
    confirm: z.string(),
  })
  .refine((values) => values.newPassword === values.confirm, { path: ['confirm'], message: 'As senhas não conferem.' });
type FormValues = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') ?? '';
  const reset = useMutation({
    mutationFn: (values: FormValues) => authApi.resetPassword(token, values.newPassword),
    onSuccess: () => {
      toast.success('Senha alterada. Entre com a nova senha.');
      navigate('/entrar', { replace: true });
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <AuthLayout title="Link inválido">
        <p className={css({ textStyle: 'body' })}>Este link de redefinição está incompleto. Peça um novo.</p>
        <p className={css({ mt: '4', textAlign: 'center' })}>
          <Link to="/esqueci-senha" className={css({ color: 'brand', fontWeight: '600' })}>
            Pedir novo link
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Criar nova senha" subtitle="Escolha uma senha nova para a sua conta.">
      <form onSubmit={handleSubmit((values) => reset.mutate(values))} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Field label="Nova senha" htmlFor="newPassword" error={errors.newPassword?.message} required>
          <Input id="newPassword" type="password" autoComplete="new-password" {...register('newPassword')} />
        </Field>
        <Field label="Repita a senha" htmlFor="confirm" error={errors.confirm?.message} required>
          <Input id="confirm" type="password" autoComplete="new-password" {...register('confirm')} />
        </Field>
        {reset.isError && (
          <p role="alert" className={css({ textStyle: 'bodySm', color: 'danger' })}>
            {apiErrorMessage(reset.error, 'Não foi possível alterar a senha.')}{' '}
            <Link to="/esqueci-senha" className={css({ color: 'brand', fontWeight: '600' })}>
              Pedir novo link
            </Link>
          </p>
        )}
        <Button type="submit" fullWidth loading={reset.isPending}>
          Salvar nova senha
        </Button>
      </form>
    </AuthLayout>
  );
}

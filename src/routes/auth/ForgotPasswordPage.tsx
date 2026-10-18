import { Link } from 'react-router';
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

const schema = z.object({ email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.') });
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const request = useMutation({ mutationFn: (values: FormValues) => authApi.forgotPassword(values.email) });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <AuthLayout title="Esqueci minha senha" subtitle="Informe seu e-mail e enviaremos um link para criar uma nova senha.">
      {request.isSuccess ? (
        <p role="status" className={css({ textStyle: 'body', color: 'text' })}>
          Se o e-mail estiver cadastrado, o link chega em instantes. Confira também a caixa de spam.
        </p>
      ) : (
        <form onSubmit={handleSubmit((values) => request.mutate(values))} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
          <Field label="E-mail" htmlFor="email" error={errors.email?.message} required>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
          </Field>
          {request.isError && (
            <p role="alert" className={css({ textStyle: 'bodySm', color: 'danger' })}>
              {apiErrorMessage(request.error, 'Não foi possível enviar agora.')}
            </p>
          )}
          <Button type="submit" fullWidth loading={request.isPending}>
            Enviar link
          </Button>
        </form>
      )}
      <p className={css({ textStyle: 'bodySm', color: 'text.muted', mt: '5', textAlign: 'center' })}>
        <Link to="/entrar" className={css({ color: 'brand', fontWeight: '600' })}>
          Voltar para o login
        </Link>
      </p>
    </AuthLayout>
  );
}

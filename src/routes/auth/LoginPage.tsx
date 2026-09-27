import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { css } from 'styled-system/css';
import { AuthLayout } from './AuthLayout';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Button } from '../../design-system/Button';
import { useLogin } from '../../features/auth/hooks';
import type { AxiosError } from 'axios';

const schema = z.object({
  email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => login.mutate(values);

  const serverError = (login.error as AxiosError<{ message?: string }> | null)?.response?.data?.message;

  return (
    <AuthLayout title="Entrar" subtitle="Acesse o painel de gestão do seu motoclube.">
      <form onSubmit={handleSubmit(onSubmit)} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Field label="E-mail" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" autoComplete="email" placeholder="voce@clube.com.br" {...register('email')} />
        </Field>
        <Field label="Senha" htmlFor="password" error={errors.password?.message} required>
          <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
        </Field>
        {serverError && (
          <p role="alert" className={css({ textStyle: 'bodySm', color: 'danger' })}>
            {serverError}
          </p>
        )}
        <Button type="submit" fullWidth loading={login.isPending}>
          Entrar
        </Button>
      </form>
      <p className={css({ textStyle: 'bodySm', color: 'text.muted', mt: '5', textAlign: 'center' })}>
        Ainda não tem clube cadastrado?{' '}
        <Link to="/criar-clube" className={css({ color: 'brand', fontWeight: '600' })}>
          Criar meu motoclube
        </Link>
      </p>
    </AuthLayout>
  );
}

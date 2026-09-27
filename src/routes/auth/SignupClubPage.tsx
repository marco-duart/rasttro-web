import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { css } from 'styled-system/css';
import { AuthLayout } from './AuthLayout';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Button } from '../../design-system/Button';
import { useSignupClub } from '../../features/auth/hooks';
import type { AxiosError } from 'axios';

const schema = z.object({
  clubName: z.string().min(2, 'Informe o nome do clube.'),
  fullName: z.string().min(2, 'Informe seu nome completo.'),
  email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
});

type FormValues = z.infer<typeof schema>;

export function SignupClubPage() {
  const signup = useSignupClub();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const serverError = (signup.error as AxiosError<{ message?: string }> | null)?.response?.data?.message;

  return (
    <AuthLayout
      title="Criar meu motoclube"
      subtitle="60 dias grátis para organizar tudo: membros, financeiro, reuniões, eventos e comboios."
    >
      <form
        onSubmit={handleSubmit((values) => signup.mutate(values))}
        className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
      >
        <Field label="Nome do motoclube" htmlFor="clubName" error={errors.clubName?.message} required>
          <Input id="clubName" placeholder="Ferro de Ombro MC" {...register('clubName')} />
        </Field>
        <Field label="Seu nome completo" htmlFor="fullName" error={errors.fullName?.message} required>
          <Input id="fullName" placeholder="Seu nome" {...register('fullName')} />
        </Field>
        <Field label="E-mail" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="Senha" htmlFor="password" error={errors.password?.message} hint="Mínimo de 8 caracteres." required>
          <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
        </Field>
        {serverError && (
          <p role="alert" className={css({ textStyle: 'bodySm', color: 'danger' })}>
            {serverError}
          </p>
        )}
        <Button type="submit" fullWidth loading={signup.isPending}>
          Criar clube e começar o trial
        </Button>
      </form>
      <p className={css({ textStyle: 'bodySm', color: 'text.muted', mt: '5', textAlign: 'center' })}>
        Já tem conta?{' '}
        <Link to="/entrar" className={css({ color: 'brand', fontWeight: '600' })}>
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}

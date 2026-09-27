import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { css } from 'styled-system/css';
import { AuthLayout } from './AuthLayout';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { invitesApi } from '../../features/invites/api';
import { useAuthStore, saveRefreshToken } from '../../stores/auth.store';
import { useClubStore } from '../../stores/club.store';
import { Ban } from 'lucide-react';
import type { AxiosError } from 'axios';

const schema = z.object({
  fullName: z.string().min(2, 'Informe seu nome completo.'),
  email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
});

type FormValues = z.infer<typeof schema>;

export function AcceptInvitePage() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const [alreadyHasAccount, setAlreadyHasAccount] = useState(false);

  const preview = useQuery({
    queryKey: ['invites', 'preview', code],
    queryFn: () => invitesApi.preview(code),
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const accept = useMutation({
    mutationFn: (values: FormValues) => invitesApi.accept(code, values),
    onSuccess: (data) => {
      useAuthStore.getState().setSession(data.accessToken, data.user ?? null);
      saveRefreshToken(data.refreshToken);
      if (data.club) useClubStore.getState().setCurrentClubId(data.club.id);
      navigate('/', { replace: true });
    },
  });

  if (preview.isLoading) {
    return (
      <AuthLayout title="Convite">
        <Spinner />
      </AuthLayout>
    );
  }

  if (preview.isError || !preview.data) {
    return (
      <AuthLayout title="Convite">
        <EmptyState icon={<Ban size={32} />} title="Convite inválido ou expirado" description="Peça um novo convite à diretoria do clube." />
      </AuthLayout>
    );
  }

  const { club, chapter, roleOnAccept } = preview.data;
  const serverError = (accept.error as AxiosError<{ message?: string }> | null)?.response?.data?.message;

  return (
    <AuthLayout
      title={`Entrar em ${club.name}`}
      subtitle={[chapter?.name, roleOnAccept ? `cargo: ${roleOnAccept}` : null].filter(Boolean).join(' · ') || 'Complete seu cadastro para entrar no clube.'}
    >
      {alreadyHasAccount ? (
        <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>
          Faça login normalmente — depois volte neste mesmo link de convite autenticado para vincular sua conta ao clube.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit((values) => accept.mutate(values))}
          className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
        >
          <Field label="Nome completo" htmlFor="fullName" error={errors.fullName?.message} required>
            <Input id="fullName" {...register('fullName')} />
          </Field>
          <Field label="E-mail" htmlFor="email" error={errors.email?.message} required>
            <Input id="email" type="email" {...register('email')} />
          </Field>
          <Field label="Crie uma senha" htmlFor="password" error={errors.password?.message} hint="Mínimo de 8 caracteres." required>
            <Input id="password" type="password" {...register('password')} />
          </Field>
          {serverError && (
            <p role="alert" className={css({ textStyle: 'bodySm', color: 'danger' })}>
              {serverError}
            </p>
          )}
          <Button type="submit" fullWidth loading={accept.isPending}>
            Entrar no clube
          </Button>
          <button
            type="button"
            onClick={() => setAlreadyHasAccount(true)}
            className={css({ textStyle: 'bodySm', color: 'text.muted', textAlign: 'center', cursor: 'pointer' })}
          >
            Já tenho uma conta Rasttro
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

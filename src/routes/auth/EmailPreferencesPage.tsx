import { useSearchParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { css } from 'styled-system/css';
import { AuthLayout } from './AuthLayout';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { http } from '../../api/http';
import { apiErrorMessage } from '../../lib/errors';

interface EmailPreference {
  clubName: string;
  category: string;
  enabled: boolean;
}

export function EmailPreferencesPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const queryClient = useQueryClient();
  const queryKey = ['email-preferences', token];

  const preference = useQuery({
    queryKey,
    queryFn: () => http.get<EmailPreference>('/email-preferences', { params: { token } }).then((r) => r.data),
    enabled: Boolean(token),
    retry: false,
  });

  const toggle = useMutation({
    mutationFn: (enable: boolean) =>
      http.post<{ enabled: boolean }>(`/email-preferences/${enable ? 'resubscribe' : 'unsubscribe'}`, null, { params: { token } }).then((r) => r.data),
    onSuccess: (result) =>
      queryClient.setQueryData<EmailPreference>(queryKey, (current) => (current ? { ...current, enabled: result.enabled } : current)),
  });

  return (
    <AuthLayout title="Preferências de e-mail">
      {!token || preference.isError ? (
        <p role="alert" className={css({ textStyle: 'body', color: 'danger' })}>
          Este link é inválido ou expirou.
        </p>
      ) : preference.isLoading || !preference.data ? (
        <Spinner />
      ) : (
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
          <p className={css({ textStyle: 'body' })}>
            {preference.data.enabled
              ? `Você recebe e-mails de ${preference.data.category} do clube ${preference.data.clubName}.`
              : `Pronto: você não receberá mais e-mails de ${preference.data.category} do clube ${preference.data.clubName}.`}
          </p>
          {toggle.isError && (
            <p role="alert" className={css({ textStyle: 'bodySm', color: 'danger' })}>
              {apiErrorMessage(toggle.error, 'Não foi possível salvar.')}
            </p>
          )}
          <Button
            variant={preference.data.enabled ? 'secondary' : 'primary'}
            fullWidth
            loading={toggle.isPending}
            onClick={() => toggle.mutate(!preference.data.enabled)}
          >
            {preference.data.enabled ? 'Parar de receber' : 'Voltar a receber'}
          </Button>
          <p className={css({ textStyle: 'caption', color: 'text.muted' })}>
            Avisos de segurança da conta continuam sendo enviados.
          </p>
        </div>
      )}
    </AuthLayout>
  );
}

import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { css } from 'styled-system/css';
import { CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../auth/AuthLayout';
import { Spinner } from '../../design-system/Spinner';
import { checkInApi } from '../../features/check-in/api';
import { apiErrorMessage } from '../../lib/errors';

export function CheckInScanPage() {
  const [params] = useSearchParams();
  const token = params.get('t') ?? '';
  const redeem = useMutation({ mutationFn: checkInApi.redeem });
  const started = useRef(false);

  useEffect(() => {
    if (token && !started.current) {
      started.current = true;
      redeem.mutate(token);
    }
  }, [token, redeem]);

  return (
    <AuthLayout title="Check-in">
      {!token ? (
        <p role="alert" className={css({ color: 'danger' })}>
          Este link de check-in está incompleto.
        </p>
      ) : redeem.isPending || redeem.isIdle ? (
        <Spinner />
      ) : redeem.isError ? (
        <p role="alert" className={css({ color: 'danger' })}>
          {apiErrorMessage(redeem.error, 'Não foi possível fazer o check-in.')}
        </p>
      ) : (
        <div className={css({ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3' })}>
          <CheckCircle2 size={56} color="var(--colors-success)" />
          <h2 className={css({ textStyle: 'h2' })}>{redeem.data.alreadyCheckedIn ? 'Você já estava presente' : 'Presença registrada'}</h2>
          <p className={css({ color: 'text.muted' })}>{redeem.data.title}</p>
        </div>
      )}
      <p className={css({ mt: '5', textAlign: 'center' })}>
        <Link to="/" className={css({ color: 'brand', fontWeight: '600' })}>
          Ir para o início
        </Link>
      </p>
    </AuthLayout>
  );
}

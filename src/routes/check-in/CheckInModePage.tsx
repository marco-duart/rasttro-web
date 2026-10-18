import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { css } from 'styled-system/css';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { checkInApi, type CheckInTarget } from '../../features/check-in/api';
import { apiErrorMessage } from '../../lib/errors';

const TARGETS: CheckInTarget[] = ['meeting', 'event', 'convoy'];

export function CheckInModePage() {
  const { type = '', id = '' } = useParams();
  const navigate = useNavigate();
  const target = TARGETS.find((t) => t === type);

  const qr = useQuery({
    queryKey: ['check-in', 'qr', target, id],
    queryFn: () => checkInApi.issue(target as CheckInTarget, id),
    enabled: Boolean(target),
    refetchInterval: 30_000,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });
  const summary = useQuery({
    queryKey: ['check-in', 'summary', target, id],
    queryFn: () => checkInApi.summary(target as CheckInTarget, id),
    enabled: Boolean(target),
    refetchInterval: 10_000,
  });

  return (
    <div className={css({ minH: '100dvh', bg: 'canvas', display: 'flex', flexDirection: 'column', alignItems: 'center', p: '6', gap: '5' })}>
      <div className={css({ alignSelf: 'flex-start' })}>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Sair do modo check-in
        </Button>
      </div>
      <h1 className={css({ textStyle: 'display', textAlign: 'center' })}>Check-in</h1>
      <p className={css({ textStyle: 'body', color: 'text.muted', textAlign: 'center', maxW: '520px' })}>
        Peça para os membros abrirem o Rasttro no celular, tocarem em "Ler QR de check-in" e apontarem para esta tela. O código muda a cada 30 segundos.
      </p>
      {qr.isError ? (
        <p role="alert" className={css({ color: 'danger' })}>
          {apiErrorMessage(qr.error, 'Não foi possível gerar o QR.')}
        </p>
      ) : qr.data ? (
        <img
          src={qr.data.qrDataUrl}
          alt="QR code de check-in"
          className={css({ width: 'min(70vw, 420px)', height: 'min(70vw, 420px)', bg: 'white', p: '3', borderRadius: 'lg' })}
        />
      ) : (
        <Spinner />
      )}
      <div className={css({ textAlign: 'center' })}>
        <div className={css({ fontSize: '64px', fontWeight: '800', color: 'brand', lineHeight: '1' })}>{summary.data?.checkedIn ?? '—'}</div>
        <div className={css({ textStyle: 'label', color: 'text.muted' })}>presentes</div>
        {summary.data && summary.data.recent.length > 0 && (
          <p className={css({ textStyle: 'bodySm', color: 'text.muted', mt: '2' })}>Últimos: {summary.data.recent.join(', ')}</p>
        )}
      </div>
    </div>
  );
}

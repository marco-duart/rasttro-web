import { useState } from 'react';
import { css } from 'styled-system/css';
import { AlertTriangle } from 'lucide-react';
import { useCurrentClub } from '../features/clubs/hooks';
import { formatDate } from '../lib/format';

export function SubscriptionBanner() {
  const { data: club } = useCurrentClub();
  const [now] = useState(() => Date.now());
  const subscription = club?.subscription;
  if (!subscription) return null;

  if (subscription.status === 'PAST_DUE' || subscription.status === 'CANCELED') {
    return (
      <div
        role="alert"
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '2',
          bg: 'danger.soft',
          color: 'danger',
          px: '5',
          py: '2.5',
          fontSize: '14px',
          fontWeight: '600',
        })}
      >
        <AlertTriangle size={16} />
        A assinatura deste clube está {subscription.status === 'PAST_DUE' ? 'com pagamento pendente' : 'cancelada'}. Fale com
        o suporte Rasttro para reativar o acesso completo.
      </div>
    );
  }

  if (subscription.status === 'TRIALING' && subscription.trialEndsAt) {
    const daysLeft = Math.max(
      0,
      Math.ceil((new Date(subscription.trialEndsAt).getTime() - now) / (1000 * 60 * 60 * 24)),
    );
    return (
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '2',
          bg: 'brand.soft',
          color: 'brand',
          px: '5',
          py: '2',
          fontSize: '13px',
          fontWeight: '600',
        })}
      >
        Você está no período de teste — {daysLeft} dia{daysLeft === 1 ? '' : 's'} restante{daysLeft === 1 ? '' : 's'} (até{' '}
        {formatDate(subscription.trialEndsAt)}).
      </div>
    );
  }

  return null;
}

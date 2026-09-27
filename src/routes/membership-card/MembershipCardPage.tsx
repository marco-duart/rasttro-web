import { css } from 'styled-system/css';
import { Center } from 'styled-system/jsx';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Avatar } from '../../design-system/Avatar';
import { Spinner } from '../../design-system/Spinner';
import { useMyMembershipCard } from '../../features/membership-card/hooks';

export function MembershipCardPage() {
  const { data: card, isLoading } = useMyMembershipCard();

  if (isLoading || !card) return <Spinner />;

  return (
    <div>
      <PageHeader title="Minha carteirinha" description="Apresente o QR na sede ou em eventos para check-in." />
      <Center>
        <Card
          className={css({
            width: '100%',
            maxW: '360px',
            p: '6',
            textAlign: 'center',
            background: 'linear-gradient(160deg, var(--colors-surface-elevated), var(--colors-surface))',
          })}
        >
          <p className={css({ textStyle: 'caption', color: 'text.muted', textTransform: 'uppercase', letterSpacing: '0.08em' })}>{card.club.name}</p>
          <div className={css({ display: 'flex', justifyContent: 'center', my: '4' })}>
            <Avatar name={card.member.fullName} photoUrl={card.member.photoUrl} size={88} />
          </div>
          <h1 className={css({ textStyle: 'h2' })}>{card.member.fullName}</h1>
          {card.member.nickname && <p className={css({ color: 'text.muted' })}>"{card.member.nickname}"</p>}
          <div className={css({ display: 'flex', justifyContent: 'center', gap: '2', mt: '2', flexWrap: 'wrap' })}>
            {card.stage && <Badge tone="brand">{card.stage}</Badge>}
            {card.roles.map((r) => (
              <Badge key={r} tone="neutral">
                {r}
              </Badge>
            ))}
          </div>
          <p className={css({ textStyle: 'caption', color: 'text.muted', mt: '2' })}>Membro nº {card.member.memberNumber ?? '—'}</p>

          <img src={card.qrDataUrl} alt="QR code de verificação" className={css({ width: '200px', height: '200px', mx: 'auto', mt: '5', borderRadius: 'md', bg: 'white', p: '2' })} />
          <p className={css({ textStyle: 'caption', color: 'text.muted', mt: '3' })}>Status: {card.member.status === 'ACTIVE' ? 'Ativo' : card.member.status}</p>
        </Card>
      </Center>
    </div>
  );
}

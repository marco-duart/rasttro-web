import { useNavigate } from 'react-router';
import { css } from 'styled-system/css';
import { Stack } from 'styled-system/jsx';
import { Building2, ChevronRight } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { useMyClubs, useLogout } from '../../features/auth/hooks';
import { useClubStore } from '../../stores/club.store';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { Button } from '../../design-system/Button';
import { Avatar } from '../../design-system/Avatar';
import { Badge } from '../../design-system/Badge';

export function SelectClubPage() {
  const { data, isLoading } = useMyClubs();
  const setCurrentClubId = useClubStore((s) => s.setCurrentClubId);
  const navigate = useNavigate();
  const logout = useLogout();

  const choose = (clubId: string) => {
    setCurrentClubId(clubId);
    navigate('/', { replace: true });
  };

  return (
    <AuthLayout title="Escolha seu clube" subtitle="Você faz parte de mais de um motoclube no Rasttro.">
      {isLoading ? (
        <Spinner />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<Building2 size={32} />}
          title="Nenhum clube encontrado"
          description="Peça um convite à diretoria do seu clube ou crie um novo motoclube."
          action={
            <Button variant="secondary" onClick={() => navigate('/criar-clube')}>
              Criar motoclube
            </Button>
          }
        />
      ) : (
        <Stack gap="2">
          {data.map(({ club, member }) => (
            <button
              key={club.id}
              onClick={() => choose(club.id)}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '3',
                p: '3',
                borderRadius: 'md',
                border: '1px solid',
                borderColor: 'border',
                bg: 'surface.elevated',
                textAlign: 'left',
                cursor: 'pointer',
                _hover: { borderColor: 'brand' },
              })}
            >
              <Avatar name={club.name} photoUrl={club.logoUrl} />
              <div className={css({ flex: 1, minW: 0 })}>
                <p className={css({ fontWeight: '600' })}>{club.name}</p>
                <p className={css({ textStyle: 'caption', color: 'text.muted' })}>
                  {member.roles.join(', ') || 'Membro'}
                  {member.chapter ? ` · ${member.chapter.name}` : ''}
                </p>
              </div>
              {club.subscription?.status === 'TRIALING' && <Badge tone="brand">Trial</Badge>}
              {club.subscription?.status === 'PAST_DUE' && <Badge tone="danger">Pendente</Badge>}
              <ChevronRight size={18} color="var(--colors-text-muted)" />
            </button>
          ))}
        </Stack>
      )}
      <Button variant="ghost" fullWidth onClick={logout} className={css({ mt: '5' })}>
        Sair
      </Button>
    </AuthLayout>
  );
}

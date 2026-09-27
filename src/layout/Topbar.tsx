import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { ChevronDown, LogOut, Moon, Sun, User as UserIcon, Building2, Plus } from 'lucide-react';
import { useCurrentClub } from '../features/clubs/hooks';
import { useMyClubs, useLogout, useCurrentUser } from '../features/auth/hooks';
import { useClubStore } from '../stores/club.store';
import { useThemeStore } from '../stores/theme.store';
import { Avatar } from '../design-system/Avatar';
import { Badge } from '../design-system/Badge';

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onOutside]);
  return ref;
}

export function Topbar() {
  const { data: club } = useCurrentClub();
  const { data: myClubs } = useMyClubs();
  const user = useCurrentUser();
  const logout = useLogout();
  const setCurrentClubId = useClubStore((s) => s.setCurrentClubId);
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();

  const [clubMenuOpen, setClubMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const clubMenuRef = useClickOutside(() => setClubMenuOpen(false));
  const userMenuRef = useClickOutside(() => setUserMenuOpen(false));

  return (
    <Flex
      as="header"
      h="64px"
      px="5"
      align="center"
      justify="space-between"
      borderBottom="1px solid"
      borderColor="border"
      bg="surface"
      position="sticky"
      top="0"
      zIndex={10}
    >
      <div ref={clubMenuRef} className={css({ position: 'relative' })}>
        <button
          onClick={() => setClubMenuOpen((v) => !v)}
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '2',
            px: '2',
            py: '1.5',
            borderRadius: 'md',
            cursor: 'pointer',
            _hover: { bg: 'surface.elevated' },
          })}
        >
          <Avatar name={club?.name ?? '?'} photoUrl={club?.logoUrl} size={28} />
          <span className={css({ fontWeight: '600', fontSize: '14px', display: { base: 'none', sm: 'inline' } })}>{club?.name}</span>
          {club?.subscription?.status === 'TRIALING' && <Badge tone="brand">Trial</Badge>}
          {club?.subscription?.status === 'PAST_DUE' && <Badge tone="danger">Pendente</Badge>}
          <ChevronDown size={16} color="var(--colors-text-muted)" />
        </button>
        {clubMenuOpen && (
          <div
            className={css({
              position: 'absolute',
              top: '100%',
              left: 0,
              mt: '2',
              bg: 'surface.elevated',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 'md',
              boxShadow: 'card',
              minW: '240px',
              py: '1',
              zIndex: 20,
            })}
          >
            {myClubs?.map(({ club: c }) => (
              <button
                key={c.id}
                onClick={() => {
                  setCurrentClubId(c.id);
                  setClubMenuOpen(false);
                  window.location.reload();
                }}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2',
                  width: '100%',
                  px: '3',
                  py: '2',
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  _hover: { bg: 'surface' },
                })}
              >
                <Building2 size={16} />
                {c.name}
              </button>
            ))}
            <div className={css({ borderTop: '1px solid', borderColor: 'border', my: '1' })} />
            <button
              onClick={() => navigate('/criar-clube')}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                width: '100%',
                px: '3',
                py: '2',
                fontSize: '14px',
                color: 'brand',
                textAlign: 'left',
                cursor: 'pointer',
                _hover: { bg: 'surface' },
              })}
            >
              <Plus size={16} />
              Criar outro motoclube
            </button>
          </div>
        )}
      </div>

      <Flex align="center" gap="1">
        <button
          aria-label="Alternar tema"
          onClick={toggle}
          className={css({ p: '2', borderRadius: 'md', cursor: 'pointer', color: 'text.muted', _hover: { bg: 'surface.elevated', color: 'text' } })}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div ref={userMenuRef} className={css({ position: 'relative' })}>
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className={css({ display: 'flex', alignItems: 'center', gap: '2', p: '1', borderRadius: 'full', cursor: 'pointer' })}
          >
            <Avatar name={user?.email ?? 'U'} size={30} />
          </button>
          {userMenuOpen && (
            <div
              className={css({
                position: 'absolute',
                top: '100%',
                right: 0,
                mt: '2',
                bg: 'surface.elevated',
                border: '1px solid',
                borderColor: 'border',
                borderRadius: 'md',
                boxShadow: 'card',
                minW: '220px',
                py: '1',
                zIndex: 20,
              })}
            >
              <div className={css({ px: '3', py: '2', display: 'flex', alignItems: 'center', gap: '2', color: 'text.muted', fontSize: '13px' })}>
                <UserIcon size={14} />
                {user?.email}
              </div>
              <div className={css({ borderTop: '1px solid', borderColor: 'border', my: '1' })} />
              <button
                onClick={logout}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2',
                  width: '100%',
                  px: '3',
                  py: '2',
                  fontSize: '14px',
                  color: 'danger',
                  textAlign: 'left',
                  cursor: 'pointer',
                  _hover: { bg: 'surface' },
                })}
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </Flex>
    </Flex>
  );
}

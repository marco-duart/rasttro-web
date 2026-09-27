import { NavLink } from 'react-router';
import { css, cx } from 'styled-system/css';
import { Box } from 'styled-system/jsx';
import { Logo } from '../design-system/Logo';
import { NAV_GROUPS } from './nav';
import { useCurrentPermissions } from '../features/clubs/hooks';

const linkClass = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2.5',
  px: '3',
  h: '38px',
  borderRadius: 'md',
  color: 'text.muted',
  fontSize: '14px',
  fontWeight: '500',
  _hover: { bg: 'surface.elevated', color: 'text' },
});

const activeLinkClass = css({
  bg: 'brand.soft',
  color: 'brand',
  fontWeight: '600',
  _hover: { bg: 'brand.soft', color: 'brand' },
});

export function Sidebar() {
  const { has, isLoading } = useCurrentPermissions();

  return (
    <Box
      as="nav"
      aria-label="Navegação principal"
      w="256px"
      h="100dvh"
      flexShrink={0}
      bg="surface"
      borderRight="1px solid"
      borderColor="border"
      position="sticky"
      top="0"
      overflowY="auto"
      className={css({ display: { base: 'none', lg: 'flex' }, flexDirection: 'column' })}
    >
      <div className={css({ p: '5', pb: '3' })}>
        <Logo size={30} />
      </div>
      <div className={css({ flex: 1, px: '3', display: 'flex', flexDirection: 'column', gap: '5', pb: '4' })}>
        {NAV_GROUPS.map((group, idx) => {
          const items = group.items.filter((item) => !item.permission || isLoading || has(...item.permission));
          if (items.length === 0) return null;
          return (
            <div key={idx}>
              {group.label && (
                <p className={css({ textStyle: 'caption', color: 'text.muted', px: '3', mb: '1.5', textTransform: 'uppercase', letterSpacing: '0.06em' })}>
                  {group.label}
                </p>
              )}
              <div className={css({ display: 'flex', flexDirection: 'column', gap: '0.5' })}>
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => cx(linkClass, isActive && activeLinkClass)}
                  >
                    <item.icon size={18} strokeWidth={2} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
}

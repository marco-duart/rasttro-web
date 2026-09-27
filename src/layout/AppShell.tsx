import { Outlet } from 'react-router';
import { Flex } from 'styled-system/jsx';
import { css } from 'styled-system/css';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SubscriptionBanner } from './SubscriptionBanner';

export function AppShell() {
  return (
    <Flex minH="100dvh">
      <Sidebar />
      <Flex direction="column" flex="1" minW="0">
        <Topbar />
        <SubscriptionBanner />
        <main className={css({ flex: 1, p: { base: '4', md: '6' }, maxW: '1200px', width: '100%', mx: 'auto' })}>
          <Outlet />
        </main>
      </Flex>
    </Flex>
  );
}

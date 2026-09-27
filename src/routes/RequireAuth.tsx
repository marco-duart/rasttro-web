import { Navigate, Outlet, useLocation } from 'react-router';
import { useBootstrapSession } from '../features/auth/hooks';
import { Center } from 'styled-system/jsx';
import { Spinner } from '../design-system/Spinner';

export function RequireAuth() {
  const { isBootstrapping, isAuthenticated } = useBootstrapSession();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <Center minH="100dvh">
        <Spinner size={32} />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

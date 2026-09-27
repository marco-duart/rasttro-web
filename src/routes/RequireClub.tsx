import { Navigate, Outlet } from 'react-router';
import { useClubStore } from '../stores/club.store';

export function RequireClub() {
  const currentClubId = useClubStore((s) => s.currentClubId);
  if (!currentClubId) return <Navigate to="/selecionar-clube" replace />;
  return <Outlet />;
}

import { useQuery } from '@tanstack/react-query';
import { useClubStore } from '../../stores/club.store';
import { novidadesApi, type NovidadesPlacement } from './api';
import { NOVIDADES_STALE_TIME_MS } from './novidades';

export function useNovidades(placement: NovidadesPlacement) {
  const currentClubId = useClubStore((s) => s.currentClubId);
  return useQuery({
    queryKey: ['novidades', placement, currentClubId],
    queryFn: () => novidadesApi.list(placement),
    enabled: Boolean(currentClubId),
    staleTime: NOVIDADES_STALE_TIME_MS,
  });
}

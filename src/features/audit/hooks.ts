import { useQuery } from '@tanstack/react-query';
import { auditApi } from './api';

export function useAuditLogs(page: number) {
  return useQuery({ queryKey: ['audit-logs', page], queryFn: () => auditApi.list(page), placeholderData: (p) => p });
}

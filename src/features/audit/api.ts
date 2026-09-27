import { http } from '../../api/http';
import type { AuditLogEntry, Paginated } from '../../api/types';

export const auditApi = {
  list: (page: number, pageSize = 30) => http.get<Paginated<AuditLogEntry>>('/audit-logs', { params: { page, pageSize } }).then((r) => r.data),
};

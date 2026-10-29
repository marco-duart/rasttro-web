import { useState } from 'react';
import { css } from 'styled-system/css';
import { ScrollText } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { Pagination } from '../../design-system/Pagination';
import { useAuditLogs } from '../../features/audit/hooks';
import { formatDateTime } from '../../lib/format';
import { auditActionText } from '../../lib/labels';

export function AuditPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditLogs(page);

  return (
    <div>
      <PageHeader title="Auditoria" description="Histórico de ações administrativas sensíveis do clube." />
      {isLoading ? (
        <Spinner />
      ) : !data || data.data.length === 0 ? (
        <EmptyState icon={<ScrollText size={32} />} title="Nenhum evento de auditoria ainda" />
      ) : (
        <Card className={css({ p: '0' })}>
          <table className={css({ width: '100%', borderCollapse: 'collapse' })}>
            <thead>
              <tr className={css({ borderBottom: '1px solid', borderColor: 'border' })}>
                {['Quando', 'Ação', 'Recurso'].map((h) => (
                  <th key={h} className={css({ textAlign: 'left', p: '3', textStyle: 'label', color: 'text.muted' })}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((log) => (
                <tr key={log.id} className={css({ borderBottom: '1px solid', borderColor: 'border', _last: { borderBottom: 'none' } })}>
                  <td className={css({ p: '3', fontSize: '13px', color: 'text.muted' })}>{formatDateTime(log.createdAt)}</td>
                  <td className={css({ p: '3', fontSize: '14px' })}>{auditActionText(log.action)}</td>
                  <td className={css({ p: '3', fontSize: '13px', color: 'text.muted' })}>{log.resource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {data && <Pagination meta={data.meta} onPageChange={setPage} />}
    </div>
  );
}

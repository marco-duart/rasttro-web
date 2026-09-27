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

const actionLabel: Record<string, string> = {
  'club.created': 'Clube criado',
  'club.updated': 'Clube atualizado',
  'member.created': 'Membro cadastrado',
  'member.updated': 'Membro atualizado',
  'member.deactivated': 'Membro desligado',
  'member.stage_changed': 'Estágio alterado',
  'role.assigned': 'Cargo atribuído',
  'role.unassigned': 'Cargo encerrado',
  'charge.created': 'Cobrança criada',
  'charge.paid': 'Cobrança paga',
  'charge.waived': 'Cobrança isentada',
  'charge.cancelled': 'Cobrança cancelada',
  'transaction.created': 'Lançamento criado',
  'transaction.updated': 'Lançamento atualizado',
  'transaction.deleted': 'Lançamento removido',
  'invite.created': 'Convite criado',
  'invite.accepted': 'Convite aceito',
  'meeting.created': 'Reunião criada',
  'event.created': 'Evento criado',
  'convoy.created': 'Comboio criado',
  'announcement.created': 'Comunicado publicado',
  'auth.password_changed': 'Senha alterada',
};

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
                  <td className={css({ p: '3', fontSize: '14px' })}>{actionLabel[log.action] ?? log.action}</td>
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

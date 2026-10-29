import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { MailCheck, RotateCw } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Select } from '../../design-system/Select';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { Pagination } from '../../design-system/Pagination';
import { http } from '../../api/http';
import { formatDateTime } from '../../lib/format';
import { toast } from '../../stores/toast.store';
import type { Paginated } from '../../api/types';
import { emailStatusLabel, emailStatusTone, type EmailStatus } from '../../lib/labels';


interface EmailRow {
  id: string;
  toEmail: string;
  templateKey: string;
  status: EmailStatus;
  attempts: number;
  lastError: string | null;
  provider: string | null;
  createdAt: string;
  sentAt: string | null;
  deliveredAt: string | null;
}

export function AdminEmailsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<EmailStatus | ''>('');

  const emails = useQuery({
    queryKey: ['admin', 'emails', page, status],
    queryFn: () =>
      http
        .get<Paginated<EmailRow>>('/admin/emails', { params: { page, pageSize: 25, status: status || undefined } })
        .then((r) => r.data),
    refetchInterval: 15_000,
  });
  const retry = useMutation({
    mutationFn: (id: string) => http.post(`/admin/emails/${id}/retry`).then((r) => r.data),
    onSuccess: () => {
      toast.success('E-mail reenfileirado.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'emails'] });
    },
  });

  return (
    <div>
      <PageHeader title="E-mails enviados" description="Fila de envio da plataforma: status, falhas e reenvio." />
      <Flex mb="4" gap="3">
        <Select value={status} onChange={(event) => { setStatus(event.target.value as EmailStatus | ''); setPage(1); }} className={css({ maxW: '220px' })}>
          <option value="">Todos os status</option>
          {(Object.keys(emailStatusLabel) as EmailStatus[]).map((s) => (
            <option key={s} value={s}>{emailStatusLabel[s]}</option>
          ))}
        </Select>
      </Flex>
      {emails.isLoading ? (
        <Spinner />
      ) : !emails.data || emails.data.data.length === 0 ? (
        <EmptyState icon={<MailCheck size={32} />} title="Nenhum e-mail encontrado" />
      ) : (
        <Card className={css({ p: '0', overflowX: 'auto' })}>
          <table className={css({ width: '100%', borderCollapse: 'collapse' })}>
            <thead>
              <tr>
                {['Quando', 'Destinatário', 'Template', 'Status', 'Tentativas', ''].map((h) => (
                  <th key={h} className={css({ textAlign: 'left', p: '3', textStyle: 'label', color: 'text.muted' })}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emails.data.data.map((row) => (
                <tr key={row.id} className={css({ borderTop: '1px solid', borderColor: 'border' })}>
                  <td className={css({ p: '3', fontSize: '13px', color: 'text.muted' })}>{formatDateTime(row.createdAt)}</td>
                  <td className={css({ p: '3', fontSize: '14px' })}>{row.toEmail}</td>
                  <td className={css({ p: '3', fontSize: '13px' })}>{row.templateKey}</td>
                  <td className={css({ p: '3' })} title={row.lastError ?? undefined}>
                    <Badge tone={emailStatusTone[row.status]}>{emailStatusLabel[row.status]}</Badge>
                    {row.deliveredAt && <span className={css({ ml: '2', textStyle: 'caption', color: 'success' })}>entregue</span>}
                  </td>
                  <td className={css({ p: '3', fontSize: '13px' })}>{row.attempts}</td>
                  <td className={css({ p: '3' })}>
                    {row.status === 'FAILED' && (
                      <Button size="sm" variant="secondary" loading={retry.isPending} onClick={() => retry.mutate(row.id)}>
                        <RotateCw size={14} /> Reenviar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {emails.data && <Pagination meta={emails.data.meta} onPageChange={setPage} />}
    </div>
  );
}

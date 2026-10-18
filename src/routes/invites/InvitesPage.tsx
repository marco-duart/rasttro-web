import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { Copy, Mail, Plus, Send, Trash2 } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Button } from '../../design-system/Button';
import { Badge } from '../../design-system/Badge';
import { Dialog } from '../../design-system/Dialog';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { invitesApi } from '../../features/invites/api';
import { toast } from '../../stores/toast.store';
import { apiErrorMessage } from '../../lib/errors';
import { formatDate } from '../../lib/format';
import type { InviteStatus } from '../../api/types';

const STATUS: Record<InviteStatus, { label: string; tone: 'success' | 'warning' | 'neutral' | 'danger' | 'brand' }> = {
  PENDING: { label: 'Pendente', tone: 'brand' },
  ACCEPTED: { label: 'Aceito', tone: 'success' },
  EXPIRED: { label: 'Expirado', tone: 'neutral' },
  REVOKED: { label: 'Revogado', tone: 'danger' },
};

export function InvitesPage() {
  const queryClient = useQueryClient();
  const { data: invites, isLoading } = useQuery({ queryKey: ['invites'], queryFn: invitesApi.list });
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ email: string; expiresInDays: number }>({ defaultValues: { email: '', expiresInDays: 7 } });

  const create = useMutation({
    mutationFn: (values: { email: string; expiresInDays: number }) =>
      invitesApi.create({ email: values.email || undefined, expiresInDays: Number(values.expiresInDays) }),
    onSuccess: (invite) => {
      queryClient.invalidateQueries({ queryKey: ['invites'] });
      toast.success(invite.email ? `Convite enviado para ${invite.email}.` : 'Convite criado. Copie o link e envie pelo WhatsApp.');
      reset();
      setOpen(false);
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Não foi possível criar o convite.')),
  });
  const resend = useMutation({
    mutationFn: invitesApi.resend,
    onSuccess: (result) => toast.success(result.sent ? 'E-mail reenviado.' : 'Já enviado há poucos minutos.'),
    onError: (error) => toast.error(apiErrorMessage(error, 'Não foi possível reenviar.')),
  });
  const revoke = useMutation({
    mutationFn: invitesApi.revoke,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invites'] }),
  });

  async function copyLink(code: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/convite/${code}`);
    toast.success('Link copiado.');
  }

  return (
    <div>
      <PageHeader
        title="Convites"
        description="Gere um link para enviar pelo WhatsApp ou informe o e-mail para enviar o convite direto."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} /> Novo convite
          </Button>
        }
      />
      {isLoading ? (
        <Spinner />
      ) : !invites || invites.length === 0 ? (
        <EmptyState icon={<Mail size={32} />} title="Nenhum convite ainda" description="Crie um convite para trazer novos membros." />
      ) : (
        <Flex direction="column" gap="3">
          {invites.map((invite) => (
            <Card key={invite.id}>
              <Flex justify="space-between" align="center" gap="3" wrap="wrap">
                <div>
                  <Flex align="center" gap="2">
                    <span className={css({ fontWeight: '700', letterSpacing: '0.08em' })}>{invite.code}</span>
                    <Badge tone={STATUS[invite.status].tone}>{STATUS[invite.status].label}</Badge>
                  </Flex>
                  <p className={css({ textStyle: 'caption', color: 'text.muted', mt: '1' })}>
                    {invite.email ?? 'Sem e-mail (link)'} · válido até {formatDate(invite.expiresAt)}
                  </p>
                </div>
                {invite.status === 'PENDING' && (
                  <Flex gap="2">
                    <Button variant="secondary" size="sm" onClick={() => void copyLink(invite.code)}>
                      <Copy size={14} /> Copiar link
                    </Button>
                    {invite.email && (
                      <Button variant="secondary" size="sm" loading={resend.isPending} onClick={() => resend.mutate(invite.id)}>
                        <Send size={14} /> Reenviar e-mail
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => revoke.mutate(invite.id)}>
                      <Trash2 size={14} /> Revogar
                    </Button>
                  </Flex>
                )}
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} title="Novo convite">
        <form onSubmit={handleSubmit((values) => create.mutate(values))} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
          <Field label="E-mail do convidado" hint="Opcional. Deixe vazio para só gerar o link.">
            <Input type="email" {...register('email')} />
          </Field>
          <Field label="Validade (dias)">
            <Input type="number" min={1} max={90} {...register('expiresInDays')} />
          </Field>
          <Flex justify="flex-end" gap="2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={create.isPending}>
              Criar convite
            </Button>
          </Flex>
        </form>
      </Dialog>
    </div>
  );
}

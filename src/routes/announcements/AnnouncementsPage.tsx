import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { Megaphone, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { Dialog } from '../../design-system/Dialog';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { Textarea } from '../../design-system/Textarea';
import { useAllAnnouncements, useCreateAnnouncement, useRemoveAnnouncement } from '../../features/announcements/hooks';
import { useCurrentPermissions } from '../../features/clubs/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import { formatDateTime } from '../../lib/format';
import type { AnnouncementAudience, AnnouncementPriority } from '../../api/types';

const audienceLabel: Record<AnnouncementAudience, string> = {
  GENERAL: 'Geral',
  BOARD: 'Diretoria',
  REGIONAL: 'Regional',
  PROSPECTS: 'Prospects',
  EVENT_PARTICIPANTS: 'Participantes de evento',
};

const priorityTone: Record<AnnouncementPriority, 'neutral' | 'brand' | 'warning' | 'danger'> = {
  LOW: 'neutral',
  NORMAL: 'brand',
  HIGH: 'warning',
  URGENT: 'danger',
};

interface FormValues {
  title: string;
  body: string;
  audience: AnnouncementAudience;
  priority: AnnouncementPriority;
  requiresConfirmation: boolean;
}

export function AnnouncementsPage() {
  const { has } = useCurrentPermissions();
  const canManage = has(PERMISSIONS.ANNOUNCEMENTS_MANAGE);
  const { data: announcements, isLoading } = useAllAnnouncements();
  const create = useCreateAnnouncement();
  const remove = useRemoveAnnouncement();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: { audience: 'GENERAL', priority: 'NORMAL', requiresConfirmation: false } });

  return (
    <div>
      <PageHeader
        title="Comunicados"
        description="Fonte oficial e pesquisável — separada do ruído do grupo de WhatsApp."
        actions={
          canManage && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus size={16} /> Novo comunicado
            </Button>
          )
        }
      />

      {isLoading ? (
        <Spinner />
      ) : !announcements || announcements.length === 0 ? (
        <EmptyState icon={<Megaphone size={32} />} title="Nenhum comunicado publicado" />
      ) : (
        <Flex direction="column" gap="3">
          {announcements.map((a) => (
            <Card key={a.id}>
              <Flex justify="space-between" align="flex-start" gap="3">
                <div>
                  <Flex align="center" gap="2">
                    <p className={css({ fontWeight: '700' })}>{a.title}</p>
                    <Badge tone={priorityTone[a.priority]}>{a.priority}</Badge>
                    <Badge tone="neutral">{audienceLabel[a.audience]}</Badge>
                  </Flex>
                  <p className={css({ textStyle: 'bodySm', color: 'text.muted', mt: '1', whiteSpace: 'pre-wrap' })}>{a.body}</p>
                  <p className={css({ textStyle: 'caption', color: 'text.muted', mt: '2' })}>
                    Publicado em {formatDateTime(a.publishedAt)} · {a._count?.reads ?? 0} leitura(s)
                  </p>
                </div>
                {canManage && (
                  <button onClick={() => remove.mutate(a.id)} className={css({ cursor: 'pointer', color: 'text.muted', _hover: { color: 'danger' } })}>
                    <Trash2 size={16} />
                  </button>
                )}
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Novo comunicado">
        <form
          onSubmit={handleSubmit((values) => create.mutate(values, { onSuccess: () => { reset(); setDialogOpen(false); } }))}
          className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
        >
          <Field label="Título" required>
            <Input {...register('title', { required: true })} />
          </Field>
          <Field label="Mensagem" required>
            <Textarea {...register('body', { required: true })} rows={5} />
          </Field>
          <Flex gap="4">
            <Field label="Audiência">
              <Select {...register('audience')}>
                {Object.entries(audienceLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Prioridade">
              <Select {...register('priority')}>
                {(['LOW', 'NORMAL', 'HIGH', 'URGENT'] as AnnouncementPriority[]).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </Field>
          </Flex>
          <label className={css({ display: 'flex', alignItems: 'center', gap: '2', fontSize: '14px' })}>
            <input type="checkbox" {...register('requiresConfirmation')} /> Exigir confirmação de leitura
          </label>
          <Flex justify="flex-end" gap="2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={create.isPending}>
              Publicar
            </Button>
          </Flex>
        </form>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { Plus, Trash2, ListOrdered } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Textarea } from '../../design-system/Textarea';
import { Button } from '../../design-system/Button';
import { Badge } from '../../design-system/Badge';
import { Dialog } from '../../design-system/Dialog';
import { Spinner } from '../../design-system/Spinner';
import { useCurrentClub, useUpdateClub } from '../../features/clubs/hooks';
import { useMembershipStages, useCreateStage, useRemoveStage } from '../../features/membership-stages/hooks';
import type { Club } from '../../api/types';

interface ClubFormValues {
  name: string;
  legalName?: string;
  description?: string;
  logoUrl?: string;
  primaryColor?: string;
  email?: string;
  phone?: string;
}

function ClubBrandingForm({ club }: { club: Club }) {
  const update = useUpdateClub();
  const { register, handleSubmit, reset } = useForm<ClubFormValues>();

  useEffect(() => {
    reset({
      name: club.name,
      legalName: club.legalName ?? '',
      description: club.description ?? '',
      logoUrl: club.logoUrl ?? '',
      primaryColor: club.primaryColor ?? '#D97721',
      email: club.email ?? '',
      phone: club.phone ?? '',
    });
  }, [club, reset]);

  return (
    <Card>
      <h2 className={css({ textStyle: 'h3', mb: '4' })}>Identidade do clube</h2>
      <form onSubmit={handleSubmit((values) => update.mutate(values))} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Grid columns={{ base: 1, md: 2 }} gap="4">
          <Field label="Nome do clube" required>
            <Input {...register('name', { required: true })} />
          </Field>
          <Field label="Razão social">
            <Input {...register('legalName')} />
          </Field>
        </Grid>
        <Field label="Descrição">
          <Textarea {...register('description')} rows={3} />
        </Field>
        <Grid columns={{ base: 1, md: 3 }} gap="4">
          <Field label="URL da logo/brasão" hint="Link de uma imagem publicada.">
            <Input {...register('logoUrl')} placeholder="https://..." />
          </Field>
          <Field label="Cor primária">
            <Input type="color" {...register('primaryColor')} className={css({ p: '1', h: '44px' })} />
          </Field>
          <Field label="E-mail de contato">
            <Input type="email" {...register('email')} />
          </Field>
        </Grid>
        <Field label="Telefone">
          <Input {...register('phone')} />
        </Field>
        <Flex justify="flex-end">
          <Button type="submit" loading={update.isPending}>
            Salvar
          </Button>
        </Flex>
      </form>
    </Card>
  );
}

function StagesSection() {
  const { data: stages, isLoading } = useMembershipStages();
  const createStage = useCreateStage();
  const removeStage = useRemoveStage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ name: string; order: number; isProspectStage: boolean; isEffectiveStage: boolean }>();

  return (
    <Card>
      <Flex justify="space-between" align="center" mb="4">
        <h2 className={css({ textStyle: 'h3' })}>Estágios de progressão</h2>
        <Button variant="secondary" size="sm" onClick={() => setDialogOpen(true)}>
          <Plus size={14} /> Novo estágio
        </Button>
      </Flex>
      {isLoading ? (
        <Spinner />
      ) : (
        <Flex direction="column" gap="2">
          {stages
            ?.sort((a, b) => a.order - b.order)
            .map((s) => (
              <Flex key={s.id} align="center" justify="space-between">
                <Flex align="center" gap="2">
                  <ListOrdered size={14} color="var(--colors-text-muted)" />
                  <span className={css({ fontSize: '14px' })}>{s.name}</span>
                  {s.isProspectStage && <Badge tone="brand">Prospect</Badge>}
                  {s.isEffectiveStage && <Badge tone="success">Efetivo</Badge>}
                </Flex>
                <button onClick={() => removeStage.mutate(s.id)} className={css({ color: 'text.muted', cursor: 'pointer', _hover: { color: 'danger' } })}>
                  <Trash2 size={15} />
                </button>
              </Flex>
            ))}
        </Flex>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Novo estágio">
        <form
          onSubmit={handleSubmit((values) =>
            createStage.mutate(
              { ...values, order: Number(values.order) },
              { onSuccess: () => { reset(); setDialogOpen(false); } },
            ),
          )}
          className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
        >
          <Field label="Nome" required>
            <Input {...register('name', { required: true })} placeholder="Aspirante" />
          </Field>
          <Field label="Ordem" required>
            <Input type="number" min={1} {...register('order', { required: true })} />
          </Field>
          <label className={css({ display: 'flex', alignItems: 'center', gap: '2', fontSize: '14px' })}>
            <input type="checkbox" {...register('isProspectStage')} /> É um estágio de prospecção
          </label>
          <label className={css({ display: 'flex', alignItems: 'center', gap: '2', fontSize: '14px' })}>
            <input type="checkbox" {...register('isEffectiveStage')} /> Conta como membro efetivo
          </label>
          <Flex justify="flex-end" gap="2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={createStage.isPending}>
              Criar
            </Button>
          </Flex>
        </form>
      </Dialog>
    </Card>
  );
}

export function SettingsPage() {
  const { data: club, isLoading } = useCurrentClub();

  if (isLoading || !club) return <Spinner />;

  return (
    <div>
      <PageHeader title="Configurações do clube" description="Identidade visual e estágios de progressão dos membros." />
      <Flex direction="column" gap="5">
        <ClubBrandingForm club={club} />
        <StagesSection />
      </Flex>
    </div>
  );
}

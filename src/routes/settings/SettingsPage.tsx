import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { Plus, Trash2, ListOrdered } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { Textarea } from '../../design-system/Textarea';
import { Button } from '../../design-system/Button';
import { Badge } from '../../design-system/Badge';
import { Dialog } from '../../design-system/Dialog';
import { Spinner } from '../../design-system/Spinner';
import { ImageUploadField } from '../../design-system/ImageUploadField';
import { useBrandingImage, useCurrentClub, useCurrentPermissions, useUpdateClub, useUpdatePaymentSettings } from '../../features/clubs/hooks';
import { useMembershipStages, useCreateStage, useRemoveStage } from '../../features/membership-stages/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import type { Club, PixKeyType } from '../../api/types';

interface ClubFormValues {
  name: string;
  legalName?: string;
  description?: string;
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
        <Grid columns={{ base: 1, md: 2 }} gap="4">
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

function ClubImagesCard({ club }: { club: Club }) {
  const logo = useBrandingImage('logo');
  const cover = useBrandingImage('cover');
  return (
    <Card>
      <h2 className={css({ textStyle: 'h3', mb: '4' })}>Brasão e capa</h2>
      <Flex direction="column" gap="5">
        <Field label="Logo / brasão" hint="Aparece nos e-mails, no app e na carteirinha. JPG, PNG ou WebP até 2 MB.">
          <ImageUploadField
            name={club.name}
            currentUrl={club.logoUrl}
            purpose="club_logo"
            onUploaded={(publicId) => logo.set.mutateAsync(publicId)}
            onRemove={() => logo.remove.mutateAsync()}
          />
        </Field>
        <Field label="Capa" hint="Imagem larga do clube. Até 5 MB.">
          <ImageUploadField
            name={club.name}
            currentUrl={club.coverUrl}
            purpose="club_cover"
            shape="wide"
            onUploaded={(publicId) => cover.set.mutateAsync(publicId)}
            onRemove={() => cover.remove.mutateAsync()}
          />
        </Field>
      </Flex>
    </Card>
  );
}

const PIX_LABEL: Record<PixKeyType, string> = {
  CPF: 'CPF',
  CNPJ: 'CNPJ',
  EMAIL: 'E-mail',
  PHONE: 'Telefone',
  EVP: 'Chave aleatória',
};

interface PaymentFormValues {
  pixKeyType: PixKeyType;
  pixKey: string;
  pixRecipientName: string;
  pixCity: string;
  paymentInstructions: string;
}

function PaymentSettingsCard({ club }: { club: Club }) {
  const update = useUpdatePaymentSettings();
  const { register, handleSubmit, reset, watch } = useForm<PaymentFormValues>();

  useEffect(() => {
    reset({
      pixKeyType: club.pixKeyType ?? 'EMAIL',
      pixKey: club.pixKey ?? '',
      pixRecipientName: club.pixRecipientName ?? club.name,
      pixCity: club.pixCity ?? '',
      paymentInstructions: club.paymentInstructions ?? '',
    });
  }, [club, reset]);

  const values = watch();

  return (
    <Card>
      <h2 className={css({ textStyle: 'h3', mb: '1' })}>Pagamentos (PIX)</h2>
      <p className={css({ textStyle: 'bodySm', color: 'text.muted', mb: '4' })}>
        Os membros veem estes dados em "Como pagar" no app. Qualquer alteração na chave avisa a diretoria por e-mail.
      </p>
      <form
        onSubmit={handleSubmit((form) =>
          update.mutate({
            pixKeyType: form.pixKeyType,
            pixKey: form.pixKey.trim() || null,
            pixRecipientName: form.pixRecipientName,
            pixCity: form.pixCity,
            paymentInstructions: form.paymentInstructions.trim() || null,
          }),
        )}
        className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
      >
        <Grid columns={{ base: 1, md: 2 }} gap="4">
          <Field label="Tipo da chave">
            <Select {...register('pixKeyType')}>
              {(Object.keys(PIX_LABEL) as PixKeyType[]).map((type) => (
                <option key={type} value={type}>
                  {PIX_LABEL[type]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Chave PIX" hint="Deixe vazio e salve para remover a chave.">
            <Input {...register('pixKey')} />
          </Field>
          <Field label="Nome do favorecido">
            <Input {...register('pixRecipientName')} maxLength={80} />
          </Field>
          <Field label="Cidade do favorecido">
            <Input {...register('pixCity')} maxLength={60} />
          </Field>
        </Grid>
        <Field label="Instruções de pagamento" hint="Ex.: envie o comprovante ao tesoureiro.">
          <Textarea rows={3} {...register('paymentInstructions')} />
        </Field>
        {values.pixKey && (
          <div className={css({ p: '3', borderRadius: 'md', bg: 'surface.elevated', textStyle: 'bodySm' })}>
            <strong>Como o membro vê:</strong> pagar para {values.pixRecipientName || '—'} ({values.pixCity || '—'}) — {PIX_LABEL[values.pixKeyType]}: {values.pixKey}
          </div>
        )}
        <Flex justify="flex-end">
          <Button type="submit" loading={update.isPending}>
            Salvar pagamentos
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
  const { has } = useCurrentPermissions();

  if (isLoading || !club) return <Spinner />;

  return (
    <div>
      <PageHeader title="Configurações do clube" description="Identidade visual e estágios de progressão dos membros." />
      <Flex direction="column" gap="5">
        <ClubBrandingForm club={club} />
        <ClubImagesCard club={club} />
        {has(PERMISSIONS.FINANCE_MANAGE) && <PaymentSettingsCard club={club} />}
        <StagesSection />
      </Flex>
    </div>
  );
}

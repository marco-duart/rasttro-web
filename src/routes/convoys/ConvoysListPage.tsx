import { useState } from 'react';
import { useNavigate } from 'react-router';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { Bike, Plus, Users } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { useConvoys } from '../../features/convoys/hooks';
import { useCurrentPermissions } from '../../features/clubs/hooks';
import { PERMISSIONS } from '../../lib/permissions';
import { formatDateTime } from '../../lib/format';
import { ConvoyFormDialog } from './ConvoyFormDialog';

export function ConvoysListPage() {
  const navigate = useNavigate();
  const { has } = useCurrentPermissions();
  const { data: convoys, isLoading } = useConvoys();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Comboios"
        description="Ponto de encontro, rota, paradas e papéis da viagem."
        actions={
          has(PERMISSIONS.CONVOYS_MANAGE) && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus size={16} /> Novo comboio
            </Button>
          )
        }
      />

      {isLoading ? (
        <Spinner />
      ) : !convoys || convoys.length === 0 ? (
        <EmptyState icon={<Bike size={32} />} title="Nenhum comboio agendado" />
      ) : (
        <Grid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
          {convoys.map((convoy) => (
            <Card key={convoy.id} onClick={() => navigate(`/comboios/${convoy.id}`)} className={css({ cursor: 'pointer', _hover: { borderColor: 'brand' } })}>
              <p className={css({ textStyle: 'label', color: 'brand' })}>Saída {formatDateTime(convoy.departureAt)}</p>
              <p className={css({ fontWeight: '700', mt: '1' })}>{convoy.meetingPoint}</p>
              {convoy.destination && <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>→ {convoy.destination}</p>}
              <Flex align="center" gap="1" mt="2" className={css({ color: 'text.muted', fontSize: '13px' })}>
                <Users size={13} /> {convoy._count?.participants ?? 0} confirmado(s)
              </Flex>
            </Card>
          ))}
        </Grid>
      )}

      <ConvoyFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}

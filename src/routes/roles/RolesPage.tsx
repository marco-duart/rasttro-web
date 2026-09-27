import { useState } from 'react';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { Plus, Shield, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { ConfirmDialog } from '../../design-system/ConfirmDialog';
import { useRoles, useRemoveRole } from '../../features/roles/hooks';
import { RoleFormDialog } from './RoleFormDialog';
import type { Role } from '../../api/types';

export function RolesPage() {
  const { data: roles, isLoading } = useRoles();
  const removeRole = useRemoveRole();
  const [dialogRole, setDialogRole] = useState<Role | null | undefined>(undefined);
  const [confirmRemove, setConfirmRemove] = useState<Role | null>(null);

  return (
    <div>
      <PageHeader
        title="Cargos e permissões"
        description="Cada clube define seus próprios cargos e o que cada um pode fazer."
        actions={
          <Button onClick={() => setDialogRole(null)}>
            <Plus size={16} /> Novo cargo
          </Button>
        }
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <Flex direction="column" gap="3">
          {roles?.map((role) => (
            <Card key={role.id}>
              <Flex align="center" justify="space-between" wrap="wrap" gap="3">
                <Flex align="center" gap="3">
                  <div
                    className={css({ width: '36px', height: '36px', borderRadius: 'full', display: 'flex', alignItems: 'center', justifyContent: 'center' })}
                    style={{ backgroundColor: `${role.color}22`, color: role.color ?? undefined }}
                  >
                    <Shield size={18} />
                  </div>
                  <div>
                    <Flex align="center" gap="2">
                      <p className={css({ fontWeight: '700' })}>{role.name}</p>
                      {role.isSystemDefault && <Badge tone="neutral">Padrão</Badge>}
                    </Flex>
                    <p className={css({ textStyle: 'caption', color: 'text.muted' })}>
                      {role._count?.assignments ?? 0} membro(s) · {role.permissions.length} permissão(ões)
                    </p>
                  </div>
                </Flex>
                <Flex gap="2">
                  <Button variant="secondary" size="sm" onClick={() => setDialogRole(role)}>
                    <Pencil size={14} /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmRemove(role)}>
                    <Trash2 size={14} color="var(--colors-danger)" />
                  </Button>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      {dialogRole !== undefined && (
        <RoleFormDialog open onClose={() => setDialogRole(undefined)} role={dialogRole} />
      )}

      <ConfirmDialog
        open={Boolean(confirmRemove)}
        title={`Excluir o cargo "${confirmRemove?.name}"?`}
        description="Só é possível excluir cargos sem membros ativos atribuídos a eles."
        danger
        confirmLabel="Excluir"
        loading={removeRole.isPending}
        onConfirm={() => confirmRemove && removeRole.mutate(confirmRemove.id, { onSuccess: () => setConfirmRemove(null) })}
        onClose={() => setConfirmRemove(null)}
      />
    </div>
  );
}

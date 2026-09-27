import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { css } from 'styled-system/css';
import { Flex, Grid } from 'styled-system/jsx';
import { Dialog } from '../../design-system/Dialog';
import { Field } from '../../design-system/Field';
import { Input } from '../../design-system/Input';
import { Button } from '../../design-system/Button';
import { usePermissionCatalog, useCreateRole, useUpdateRole } from '../../features/roles/hooks';
import type { Role, PermissionScope } from '../../api/types';

interface RoleFormDialogProps {
  open: boolean;
  onClose: () => void;
  role?: Role | null;
}

const SCOPES: PermissionScope[] = ['SELF', 'CHAPTER', 'CLUB'];
const scopeLabel: Record<PermissionScope, string> = { SELF: 'Próprio', CHAPTER: 'Regional', CLUB: 'Clube todo' };

function groupByModule(permissions: string[]) {
  const groups = new Map<string, string[]>();
  for (const p of permissions) {
    const [mod] = p.split('.');
    if (!groups.has(mod)) groups.set(mod, []);
    groups.get(mod)!.push(p);
  }
  return groups;
}

export function RoleFormDialog({ open, onClose, role }: RoleFormDialogProps) {
  const { data: catalog } = usePermissionCatalog();
  const create = useCreateRole();
  const update = useUpdateRole();
  const isEditing = Boolean(role);

  const { register, handleSubmit } = useForm<{ name: string; description: string; color: string; rank: number }>({
    defaultValues: role
      ? { name: role.name, description: role.description ?? '', color: role.color ?? '#D97721', rank: role.rank }
      : { name: '', description: '', color: '#D97721', rank: 0 },
  });
  const [selected, setSelected] = useState<Map<string, PermissionScope>>(
    () => new Map(role?.permissions.map((p) => [p.permission, p.scope]) ?? []),
  );

  const toggle = (permission: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (checked) next.set(permission, next.get(permission) ?? 'CLUB');
      else next.delete(permission);
      return next;
    });
  };

  const setScope = (permission: string, scope: PermissionScope) => {
    setSelected((prev) => new Map(prev).set(permission, scope));
  };

  const onSubmit = handleSubmit((values) => {
    const permissions = Array.from(selected.entries()).map(([permission, scope]) => ({ permission, scope }));
    const payload = { ...values, rank: Number(values.rank) || 0, permissions };
    const onSuccess = () => onClose();
    if (isEditing && role) update.mutate({ id: role.id, ...payload }, { onSuccess });
    else create.mutate(payload, { onSuccess });
  });

  const groups = groupByModule(catalog ?? []);

  return (
    <Dialog open={open} onClose={onClose} title={isEditing ? 'Editar cargo' : 'Novo cargo'} width="640px">
      <form onSubmit={onSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        <Grid columns={3} gap="3">
          <div className={css({ gridColumn: 'span 2' })}>
            <Field label="Nome" required>
              <Input {...register('name', { required: true })} disabled={role?.isSystemDefault} />
            </Field>
          </div>
          <Field label="Cor">
            <Input type="color" {...register('color')} className={css({ p: '1', h: '44px' })} />
          </Field>
        </Grid>
        <Field label="Descrição">
          <Input {...register('description')} />
        </Field>

        <div>
          <p className={css({ textStyle: 'label', color: 'text.muted', mb: '2' })}>Permissões</p>
          <div className={css({ maxH: '360px', overflowY: 'auto', border: '1px solid', borderColor: 'border', borderRadius: 'md', p: '3' })}>
            {Array.from(groups.entries()).map(([mod, perms]) => (
              <div key={mod} className={css({ mb: '3' })}>
                <p className={css({ textStyle: 'caption', color: 'brand', textTransform: 'uppercase', mb: '1.5' })}>{mod}</p>
                <Flex direction="column" gap="1.5">
                  {perms.map((permission) => {
                    const scope = selected.get(permission);
                    return (
                      <Flex key={permission} align="center" justify="space-between" gap="2">
                        <label className={css({ display: 'flex', alignItems: 'center', gap: '2', fontSize: '13px', cursor: 'pointer' })}>
                          <input type="checkbox" checked={Boolean(scope)} onChange={(e) => toggle(permission, e.target.checked)} />
                          {permission}
                        </label>
                        {scope && (
                          <select
                            value={scope}
                            onChange={(e) => setScope(permission, e.target.value as PermissionScope)}
                            className={css({ fontSize: '12px', bg: 'surface', border: '1px solid', borderColor: 'border', borderRadius: 'sm', px: '1.5', py: '0.5' })}
                          >
                            {SCOPES.map((s) => (
                              <option key={s} value={s}>
                                {scopeLabel[s]}
                              </option>
                            ))}
                          </select>
                        )}
                      </Flex>
                    );
                  })}
                </Flex>
              </div>
            ))}
          </div>
        </div>

        <Flex justify="flex-end" gap="2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={create.isPending || update.isPending}>
            Salvar
          </Button>
        </Flex>
      </form>
    </Dialog>
  );
}

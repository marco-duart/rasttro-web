import { useState } from 'react';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { Award, Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../design-system/PageHeader';
import { Card } from '../../design-system/Card';
import { Button } from '../../design-system/Button';
import { Spinner } from '../../design-system/Spinner';
import { EmptyState } from '../../design-system/EmptyState';
import { ConfirmDialog } from '../../design-system/ConfirmDialog';
import { useTitles, useRemoveTitle } from '../../features/titles/hooks';
import { TitleFormDialog } from './TitleFormDialog';
import type { Title } from '../../api/types';

export function TitlesPage() {
  const { data: titles, isLoading } = useTitles();
  const removeTitle = useRemoveTitle();
  const [dialogTitle, setDialogTitle] = useState<Title | null | undefined>(undefined);
  const [confirmRemove, setConfirmRemove] = useState<Title | null>(null);

  return (
    <div>
      <PageHeader
        title="Títulos"
        description="Reconhecimento honorífico — a diretoria cria os títulos e distribui por critério próprio. Cargo define o que a pessoa pode fazer; título define quem ela é pro clube."
        actions={
          <Button onClick={() => setDialogTitle(null)}>
            <Plus size={16} /> Novo título
          </Button>
        }
      />

      {isLoading ? (
        <Spinner />
      ) : !titles || titles.length === 0 ? (
        <EmptyState
          icon={<Award size={32} />}
          title="Nenhum título criado ainda"
          description='Ex.: "Veterano", "Fundador", "Padrinho do Ano" — o que fizer sentido pra cultura do clube.'
        />
      ) : (
        <Flex direction="column" gap="3">
          {titles.map((title) => (
            <Card key={title.id}>
              <Flex align="center" justify="space-between" wrap="wrap" gap="3">
                <Flex align="center" gap="3">
                  <div
                    className={css({ width: '36px', height: '36px', borderRadius: 'full', display: 'flex', alignItems: 'center', justifyContent: 'center' })}
                    style={{ backgroundColor: `${title.color ?? '#D97721'}22`, color: title.color ?? '#D97721' }}
                  >
                    <Award size={18} />
                  </div>
                  <div>
                    <p className={css({ fontWeight: '700' })}>{title.name}</p>
                    <p className={css({ textStyle: 'caption', color: 'text.muted' })}>
                      {title.description ?? 'Sem descrição'} · {title._count?.memberTitles ?? 0} membro(s)
                    </p>
                  </div>
                </Flex>
                <Flex gap="2">
                  <Button variant="secondary" size="sm" onClick={() => setDialogTitle(title)}>
                    <Pencil size={14} /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmRemove(title)}>
                    <Trash2 size={14} color="var(--colors-danger)" />
                  </Button>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      {dialogTitle !== undefined && <TitleFormDialog open onClose={() => setDialogTitle(undefined)} title={dialogTitle} />}

      <ConfirmDialog
        open={Boolean(confirmRemove)}
        title={`Excluir o título "${confirmRemove?.name}"?`}
        description="Remove esse título de todos os membros que o têm."
        danger
        confirmLabel="Excluir"
        loading={removeTitle.isPending}
        onConfirm={() => confirmRemove && removeTitle.mutate(confirmRemove.id, { onSuccess: () => setConfirmRemove(null) })}
        onClose={() => setConfirmRemove(null)}
      />
    </div>
  );
}

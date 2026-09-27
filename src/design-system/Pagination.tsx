import { ChevronLeft, ChevronRight } from 'lucide-react';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { Button } from './Button';
import type { PaginationMeta } from '../api/types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <Flex align="center" justify="space-between" mt="4">
      <span className={css({ textStyle: 'bodySm', color: 'text.muted' })}>
        {meta.total} {meta.total === 1 ? 'registro' : 'registros'} · página {meta.page} de {meta.totalPages}
      </span>
      <Flex gap="2">
        <Button variant="secondary" size="sm" disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)}>
          <ChevronLeft size={16} /> Anterior
        </Button>
        <Button variant="secondary" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => onPageChange(meta.page + 1)}>
          Próxima <ChevronRight size={16} />
        </Button>
      </Flex>
    </Flex>
  );
}

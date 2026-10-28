import { Link } from 'react-router';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { ArrowRight } from 'lucide-react';
import { useNovidades } from './hooks';
import { NovidadesGrid } from './NovidadesGrid';

/** Bloco da visão geral: sem novidade (ou com erro) não renderiza nada. */
export function NovidadesBlock() {
  const { data } = useNovidades('web.dashboard');
  if (!data || data.length === 0) return null;

  return (
    <section className={css({ mt: '6' })}>
      <Flex align="center" justify="space-between" mb="3">
        <h2 className={css({ textStyle: 'h3' })}>Novidades</h2>
        <Link to="/novidades" className={css({ color: 'brand', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '1' })}>
          Ver todas <ArrowRight size={12} />
        </Link>
      </Flex>
      <NovidadesGrid placement="web.dashboard" items={data} />
    </section>
  );
}

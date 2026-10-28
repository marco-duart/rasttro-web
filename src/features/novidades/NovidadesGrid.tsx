import { Grid } from 'styled-system/jsx';
import { novidadesApi, type NovidadesPlacement } from './api';
import { NovidadeCard } from './NovidadeCard';
import type { Novidade } from './novidades';

interface NovidadesGridProps {
  placement: NovidadesPlacement;
  items: Novidade[];
}

export function NovidadesGrid({ placement, items }: NovidadesGridProps) {
  return (
    <Grid columns={{ base: 1, md: 2, xl: 3 }} gap="5">
      {items.map((novidade) => (
        <NovidadeCard
          key={novidade.id}
          novidade={novidade}
          onImpression={() => novidadesApi.impression(novidade.id, placement)}
          onClick={() => novidadesApi.click(novidade.id, placement)}
        />
      ))}
    </Grid>
  );
}

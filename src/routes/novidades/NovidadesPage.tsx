import { Sparkles } from 'lucide-react';
import { EmptyState } from '../../design-system/EmptyState';
import { PageHeader } from '../../design-system/PageHeader';
import { Spinner } from '../../design-system/Spinner';
import { useNovidades } from '../../features/novidades/hooks';
import { NovidadesGrid } from '../../features/novidades/NovidadesGrid';

export function NovidadesPage() {
  const { data, isPending } = useNovidades('web.novidades');

  return (
    <div>
      <PageHeader title="Novidades" description="Produtos e serviços da Maaxis para o seu clube." />
      {isPending ? (
        <Spinner />
      ) : data && data.length > 0 ? (
        <NovidadesGrid placement="web.novidades" items={data} />
      ) : (
        <EmptyState icon={<Sparkles size={28} />} title="Nenhuma novidade por enquanto" />
      )}
    </div>
  );
}

import { Link } from 'react-router';
import { Compass } from 'lucide-react';
import { Center } from 'styled-system/jsx';
import { EmptyState } from '../design-system/EmptyState';
import { Button } from '../design-system/Button';

export function NotFoundPage() {
  return (
    <Center minH="100dvh">
      <EmptyState
        icon={<Compass size={40} />}
        title="Página não encontrada"
        description="O endereço que você tentou acessar não existe."
        action={
          <Link to="/">
            <Button variant="secondary">Voltar ao início</Button>
          </Link>
        }
      />
    </Center>
  );
}

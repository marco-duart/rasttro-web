import { Loader2 } from 'lucide-react';
import { css } from 'styled-system/css';

export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'center', p: '8' })}>
      <Loader2 size={size} style={{ animation: 'spin 0.8s linear infinite' }} color="var(--colors-brand)" />
    </div>
  );
}

import type { ReactNode } from 'react';
import { css } from 'styled-system/css';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '3',
        py: '12',
        px: '6',
        color: 'text.muted',
      })}
    >
      {icon && <div className={css({ color: 'text.muted', opacity: 0.7 })}>{icon}</div>}
      <p className={css({ textStyle: 'h3', color: 'text' })}>{title}</p>
      {description && <p className={css({ textStyle: 'bodySm', maxW: '360px' })}>{description}</p>}
      {action}
    </div>
  );
}

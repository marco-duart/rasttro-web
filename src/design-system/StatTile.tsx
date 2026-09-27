import type { ReactNode } from 'react';
import { css } from 'styled-system/css';
import { Card } from './Card';

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
  action?: ReactNode;
}

const toneColor: Record<NonNullable<StatTileProps['tone']>, string> = {
  neutral: 'text.muted',
  brand: 'brand',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

export function StatTile({ label, value, hint, icon, tone = 'neutral', action }: StatTileProps) {
  return (
    <Card className={css({ display: 'flex', flexDirection: 'column', gap: '2', minH: '120px' })}>
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
        <span className={css({ textStyle: 'label', color: 'text.muted' })}>{label}</span>
        {icon && <span className={css({ color: toneColor[tone] })}>{icon}</span>}
      </div>
      <span className={css({ textStyle: 'display', fontSize: '28px', lineHeight: '1.1' })}>{value}</span>
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' })}>
        {hint && <span className={css({ textStyle: 'caption', color: 'text.muted' })}>{hint}</span>}
        {action}
      </div>
    </Card>
  );
}

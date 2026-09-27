import type { HTMLAttributes } from 'react';
import { card } from 'styled-system/recipes';
import { css, cx } from 'styled-system/css';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(card(), css({ p: '5' }), className)} {...rest} />;
}

import type { HTMLAttributes } from 'react';
import { badge } from 'styled-system/recipes';
import type { RecipeVariantProps } from 'styled-system/css';

type BadgeVariants = RecipeVariantProps<typeof badge>;

export function Badge({ tone, className, ...rest }: HTMLAttributes<HTMLSpanElement> & BadgeVariants) {
  return <span className={badge({ tone }) + (className ? ` ${className}` : '')} {...rest} />;
}

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { input } from 'styled-system/recipes';
import { cx } from 'styled-system/css';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...rest }, ref) => (
    <select ref={ref} className={cx(input(), className)} {...rest}>
      {children}
    </select>
  ),
);
Select.displayName = 'Select';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { input } from 'styled-system/recipes';
import { cx } from 'styled-system/css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, invalid, ...rest }, ref) => (
  <input ref={ref} aria-invalid={invalid} className={cx(input(), className)} {...rest} />
));
Input.displayName = 'Input';

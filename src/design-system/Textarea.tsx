import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { input } from 'styled-system/recipes';
import { cx, css } from 'styled-system/css';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...rest }, ref) => (
    <textarea
      ref={ref}
      className={cx(input(), css({ h: 'auto', minH: '96px', py: '2.5', resize: 'vertical' }), className)}
      {...rest}
    />
  ),
);
Textarea.displayName = 'Textarea';

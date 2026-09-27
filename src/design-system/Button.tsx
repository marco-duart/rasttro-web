import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { button } from 'styled-system/recipes';
import type { RecipeVariantProps } from 'styled-system/css';
import { Loader2 } from 'lucide-react';

type ButtonVariants = RecipeVariantProps<typeof button>;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    loading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, fullWidth, loading, disabled, className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={button({ variant, size, fullWidth }) + (className ? ` ${className}` : '')}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 0.8s linear infinite' }} />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

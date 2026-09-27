import type { ReactNode } from 'react';
import { css } from 'styled-system/css';

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, required, children }: FieldProps) {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '1.5' })}>
      <label htmlFor={htmlFor} className={css({ textStyle: 'label', color: 'text.muted' })}>
        {label} {required && <span className={css({ color: 'danger' })}>*</span>}
      </label>
      {children}
      {error ? (
        <span role="alert" className={css({ textStyle: 'caption', color: 'danger' })}>
          {error}
        </span>
      ) : hint ? (
        <span className={css({ textStyle: 'caption', color: 'text.muted' })}>{hint}</span>
      ) : null}
    </div>
  );
}

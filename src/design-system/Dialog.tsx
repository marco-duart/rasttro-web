import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { css } from 'styled-system/css';
import { Card } from './Card';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export function Dialog({ open, onClose, title, description, children, footer, width = '480px' }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      className={css({
        position: 'fixed',
        inset: 0,
        bg: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: '4',
        zIndex: 1000,
      })}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
        className={css({ width: '100%', maxH: '90vh', overflowY: 'auto' })}
        style={{ maxWidth: width }}
      >
        <div className={css({ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: '4' })}>
          <div>
            <h2 id="dialog-title" className={css({ textStyle: 'h3' })}>
              {title}
            </h2>
            {description && <p className={css({ textStyle: 'bodySm', color: 'text.muted', mt: '1' })}>{description}</p>}
          </div>
          <button
            aria-label="Fechar"
            onClick={onClose}
            className={css({ color: 'text.muted', _hover: { color: 'text' }, cursor: 'pointer' })}
          >
            <X size={20} />
          </button>
        </div>
        {children}
        {footer && <div className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2', mt: '5' })}>{footer}</div>}
      </Card>
    </div>,
    document.body,
  );
}

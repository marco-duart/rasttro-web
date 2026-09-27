import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { css } from 'styled-system/css';
import { useToastStore, type ToastTone } from '../stores/toast.store';

const icons: Record<ToastTone, React.ReactNode> = {
  success: <CheckCircle2 size={18} />,
  danger: <XCircle size={18} />,
  info: <Info size={18} />,
};

const toneColor: Record<ToastTone, string> = {
  success: 'success',
  danger: 'danger',
  info: 'info',
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return createPortal(
    <div
      className={css({
        position: 'fixed',
        bottom: '4',
        right: '4',
        display: 'flex',
        flexDirection: 'column',
        gap: '2',
        zIndex: 2000,
        maxW: '360px',
      })}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={css({
            display: 'flex',
            alignItems: 'flex-start',
            gap: '2',
            bg: 'surface.elevated',
            border: '1px solid',
            borderColor: 'border',
            borderRadius: 'md',
            boxShadow: 'card',
            p: '3',
          })}
        >
          <span className={css({ color: toneColor[t.tone], flexShrink: 0, mt: '0.5' })}>{icons[t.tone]}</span>
          <span className={css({ textStyle: 'bodySm', flex: 1 })}>{t.message}</span>
          <button onClick={() => dismiss(t.id)} className={css({ color: 'text.muted', cursor: 'pointer' })} aria-label="Fechar">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
}

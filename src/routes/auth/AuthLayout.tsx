import type { ReactNode } from 'react';
import { css } from 'styled-system/css';
import { Center } from 'styled-system/jsx';
import { Logo } from '../../design-system/Logo';
import { Card } from '../../design-system/Card';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <Center
      minH="100dvh"
      p="4"
      className={css({
        bg: 'canvas',
        backgroundImage:
          'radial-gradient(ellipse 800px 500px at 50% -10%, color-mix(in srgb, var(--colors-brand) 12%, transparent), transparent)',
      })}
    >
      <div className={css({ width: '100%', maxW: '420px' })}>
        <div className={css({ display: 'flex', justifyContent: 'center', mb: '8' })}>
          <Logo size={40} />
        </div>
        <Card className={css({ p: '7' })}>
          <h1 className={css({ textStyle: 'h2', mb: '1' })}>{title}</h1>
          {subtitle && <p className={css({ textStyle: 'bodySm', color: 'text.muted', mb: '6' })}>{subtitle}</p>}
          {!subtitle && <div className={css({ mb: '4' })} />}
          {children}
        </Card>
        {footer && <div className={css({ mt: '5', textAlign: 'center' })}>{footer}</div>}
      </div>
    </Center>
  );
}

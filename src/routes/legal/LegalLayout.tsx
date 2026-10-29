import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';
import { css } from 'styled-system/css';
import { AuthBrandMark } from '../../design-system/AuthBrandMark';
import { Card } from '../../design-system/Card';
import { CONTACT_EMAIL, legalLink } from './legalStyles';

const section = css({ display: 'flex', flexDirection: 'column', gap: '3', '& + &': { mt: '8' } });

interface LegalLayoutProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

/** Página pública de texto legal (sem login), com a marca do Rasttro e um cartão de leitura. */
export function LegalLayout({ title, updatedAt, children }: LegalLayoutProps) {
  useEffect(() => {
    document.title = `${title} — Rasttro`;
  }, [title]);

  return (
    <div
      className={css({
        minH: '100dvh',
        p: { base: '4', md: '8' },
        bg: 'canvas',
        backgroundImage:
          'radial-gradient(ellipse 800px 500px at 50% -10%, color-mix(in srgb, var(--colors-brand) 12%, transparent), transparent)',
      })}
    >
      <div className={css({ width: '100%', maxW: '820px', mx: 'auto' })}>
        <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '8' })}>
          <AuthBrandMark />
          <Link to="/entrar" className={css({ textStyle: 'bodySm', color: 'text.muted', _hover: { color: 'brand' } })}>
            Entrar
          </Link>
        </div>

        <Card className={css({ p: { base: '5', md: '9' } })}>
          <h1 className={css({ textStyle: 'h1', mb: '2' })}>{title}</h1>
          <p className={css({ textStyle: 'bodySm', color: 'text.muted', mb: '8' })}>
            Rasttro (app e painel web) · Última atualização: {updatedAt}
          </p>
          {children}
        </Card>

        <p className={css({ textStyle: 'caption', color: 'text.muted', textAlign: 'center', mt: '5', display: 'flex', gap: '4', justifyContent: 'center' })}>
          <Link to="/privacidade" className={css({ _hover: { color: 'brand' } })}>Política de Privacidade</Link>
          <Link to="/seguranca-infantil" className={css({ _hover: { color: 'brand' } })}>Segurança infantil</Link>
        </p>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={section}>
      <h2 className={css({ textStyle: 'h3' })}>{title}</h2>
      {children}
    </section>
  );
}

export function ContactEmail() {
  return <a className={legalLink} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
}

import iconUrl from '../assets/icon.png';
import { css } from 'styled-system/css';

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
}

/**
 * Ícone + wordmark em CSS (não a logo original em PNG): o texto da logo
 * original é escuro e some no tema escuro. O ícone (selo com o "R" da
 * estrada) funciona nos dois temas; o nome do produto é tipografado em
 * Barlow Condensed, cor semântica `text` (inverte com o tema).
 */
export function Logo({ size = 32, withWordmark = true }: LogoProps) {
  return (
    <div className={css({ display: 'flex', alignItems: 'center', gap: '2.5' })}>
      <img
        src={iconUrl}
        alt="Rasttro"
        width={size}
        height={size}
        className={css({ borderRadius: '8px', flexShrink: 0 })}
        style={{ width: size, height: size }}
      />
      {withWordmark && (
        <span
          className={css({
            textStyle: 'display',
            fontSize: `${size * 0.62}px`,
            lineHeight: 1,
            letterSpacing: '0.02em',
            color: 'text',
          })}
        >
          RASTTRO
        </span>
      )}
    </div>
  );
}

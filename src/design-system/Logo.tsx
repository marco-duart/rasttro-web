import iconUrl from '../assets/icon.png';
import { css } from 'styled-system/css';

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
}

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

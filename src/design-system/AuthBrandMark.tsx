import iconUrl from '../assets/icon.png';
import { css } from 'styled-system/css';

/**
 * Marca de abertura das telas de autenticação — não é o `Logo` de
 * navbar (pequeno, inline). Aqui o selo quadrado é o protagonista, grande
 * e com um pouco de peso visual (sombra/glow âmbar), mais parecido com um
 * emblema/patch de colete do que com uma logo corporativa — combina mais
 * com o tom "estrada + pertencimento" do produto do que um lockup fino.
 */
export function AuthBrandMark() {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3' })}>
      <img
        src={iconUrl}
        alt="Rasttro"
        width={96}
        height={96}
        className={css({
          borderRadius: '20px',
          boxShadow: '0 0 0 1px color-mix(in srgb, var(--colors-brand) 40%, transparent), 0 12px 32px -8px color-mix(in srgb, var(--colors-brand) 45%, transparent)',
        })}
      />
      <div className={css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5' })}>
        <span
          className={css({
            textStyle: 'display',
            fontSize: '34px',
            lineHeight: 1,
            letterSpacing: '0.05em',
            color: 'text',
          })}
        >
          RASTTRO
        </span>
        <span
          aria-hidden
          className={css({
            width: '96px',
            height: '3px',
            borderRadius: 'full',
            background: 'linear-gradient(90deg, transparent, {colors.brand}, transparent)',
          })}
        />
      </div>
    </div>
  );
}

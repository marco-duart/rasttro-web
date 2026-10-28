import { useEffect, useEffectEvent, useRef } from 'react';
import { css, cx } from 'styled-system/css';
import { card } from 'styled-system/recipes';
import { Badge } from '../../design-system/Badge';
import { novidadeBadge, novidadeCta, novidadeImage, novidadePrice, type Novidade } from './novidades';
import { RestrictedMarkdown } from './RestrictedMarkdown';

interface NovidadeCardProps {
  novidade: Novidade;
  /** Chamado uma vez quando o card fica pelo menos 50% visível. */
  onImpression: () => void;
  onClick: () => void;
}

export function NovidadeCard({ novidade, onImpression, onClick }: NovidadeCardProps) {
  const ref = useRef<HTMLElement>(null);
  const reportImpression = useEffectEvent(onImpression);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reportImpression();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [novidade.id]);

  const badge = novidadeBadge(novidade.kind);
  const image = novidadeImage(novidade);
  const price = novidadePrice(novidade);
  const cta = novidadeCta(novidade);

  return (
    <article ref={ref} className={cx(card(), css({ display: 'flex', flexDirection: 'column', overflow: 'hidden' }))}>
      {image && (
        <img
          src={image.url}
          alt={image.alt}
          loading="lazy"
          className={css({ w: 'full', aspectRatio: '3 / 1', objectFit: 'cover', bg: 'surface.elevated' })}
        />
      )}
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '2', p: '5', flex: '1' })}>
        {badge && (
          <span>
            <Badge tone="brand">{badge}</Badge>
          </span>
        )}
        <h3 className={css({ textStyle: 'h3' })}>{novidade.title}</h3>
        {novidade.subtitle && <p className={css({ textStyle: 'bodySm', color: 'text.muted' })}>{novidade.subtitle}</p>}
        {price && <p className={css({ fontWeight: '600' })}>{price}</p>}
        {novidade.bodyMd && (
          <div
            className={css({
              textStyle: 'bodySm',
              color: 'text.muted',
              '& p + p': { mt: '2' },
              '& a': { color: 'brand', textDecoration: 'underline' },
            })}
          >
            <RestrictedMarkdown source={novidade.bodyMd} />
          </div>
        )}
        {cta && (
          <a
            href={cta.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            className={css({
              mt: 'auto',
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              minH: '44px',
              px: '4',
              borderRadius: 'md',
              bg: 'brand',
              color: 'text.onBrand',
              _hover: { bg: 'brand.hover' },
              fontWeight: '600',
              fontSize: '14px',
            })}
          >
            {cta.label}
          </a>
        )}
      </div>
    </article>
  );
}

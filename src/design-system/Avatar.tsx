import { css } from 'styled-system/css';

interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: number;
}

export function Avatar({ name, photoUrl, size = 36 }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        width={size}
        height={size}
        className={css({ borderRadius: 'full', objectFit: 'cover', border: '1px solid', borderColor: 'border' })}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={css({
        borderRadius: 'full',
        bg: 'brand.soft',
        color: 'brand',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        flexShrink: 0,
      })}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials || '?'}
    </div>
  );
}

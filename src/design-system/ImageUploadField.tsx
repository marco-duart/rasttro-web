import { useRef } from 'react';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';
import { ImagePlus, Trash2 } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { useImageUpload } from '../features/uploads/hooks';
import type { UploadPurpose } from '../features/uploads/api';

interface ImageUploadFieldProps {
  name: string;
  currentUrl?: string | null;
  purpose: UploadPurpose;
  targetId?: string;
  shape?: 'circle' | 'wide';
  onUploaded: (publicId: string) => Promise<unknown>;
  onRemove?: () => Promise<unknown>;
}

export function ImageUploadField({ name, currentUrl, purpose, targetId, shape = 'circle', onUploaded, onRemove }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, progress, isUploading } = useImageUpload();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const publicId = await upload({ purpose, targetId, file });
    await onUploaded(publicId);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <Flex align="center" gap="4" wrap="wrap">
      {shape === 'circle' ? (
        <Avatar name={name} photoUrl={currentUrl} size={72} />
      ) : currentUrl ? (
        <img
          src={currentUrl}
          alt={name}
          className={css({ width: '160px', height: '60px', objectFit: 'cover', borderRadius: 'md', border: '1px solid', borderColor: 'border' })}
        />
      ) : (
        <div
          className={css({ width: '160px', height: '60px', borderRadius: 'md', border: '1px dashed', borderColor: 'border', bg: 'surface.elevated' })}
        />
      )}
      <Flex direction="column" gap="2" align="flex-start">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          className={css({ display: 'none' })}
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        <Flex gap="2">
          <Button type="button" variant="secondary" size="sm" loading={isUploading} onClick={() => inputRef.current?.click()}>
            <ImagePlus size={14} /> {currentUrl ? 'Trocar imagem' : 'Enviar imagem'}
          </Button>
          {currentUrl && onRemove && (
            <Button type="button" variant="ghost" size="sm" disabled={isUploading} onClick={() => void onRemove()}>
              <Trash2 size={14} /> Remover
            </Button>
          )}
        </Flex>
        {isUploading && (
          <span className={css({ textStyle: 'caption', color: 'text.muted' })}>Enviando… {Math.round(progress * 100)}%</span>
        )}
      </Flex>
    </Flex>
  );
}

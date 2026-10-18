import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadsApi, type UploadPurpose } from './api';
import { toast } from '../../stores/toast.store';
import { apiErrorMessage } from '../../lib/errors';

interface UploadInput {
  purpose: UploadPurpose;
  targetId?: string;
  file: File;
}

export function useImageUpload() {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async ({ purpose, targetId, file }: UploadInput) => {
      const ticket = await uploadsApi.createTicket({ purpose, targetId });
      if (file.size > ticket.maxBytes) {
        throw new Error(`A imagem passa do limite de ${Math.round(ticket.maxBytes / (1024 * 1024))} MB.`);
      }
      await uploadsApi.sendToStorage(ticket, file, setProgress);
      return ticket.publicId;
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Não foi possível enviar a imagem.')),
    onSettled: () => setProgress(0),
  });

  return { upload: mutation.mutateAsync, progress, isUploading: mutation.isPending };
}

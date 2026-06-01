'use client';

import { useState, useCallback } from 'react';
import { getAuthToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type UseImageUploadReturn = {
  /** Whether an upload is currently in progress */
  uploading: boolean;
  /** Error message if the last upload failed */
  error: string | null;
  /** Handle the file input onChange event — triggers the upload (Hop 1) */
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
  ) => void;
};

/**
 * Hook that handles the asynchronous image upload (Hop 1 of the Double-Hop pattern).
 *
 * Usage:
 *   const { uploading, error, handleFileChange } = useImageUpload();
 *   <input type="file" onChange={(e) => handleFileChange(e, (url) => setForm(...))} />
 */
export function useImageUpload(): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      onSuccess: (url: string) => void,
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const token = getAuthToken();

        const res = await fetch(`${API_URL}/api/v1/uploads/image`, {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Upload falhou (status ${res.status})`);
        }

        const data: { url: string } = await res.json();
        onSuccess(data.url);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro desconhecido no upload';
        setError(message);
        console.error('[useImageUpload]', message);
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  return { uploading, error, handleFileChange };
}

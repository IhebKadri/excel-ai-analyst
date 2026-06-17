import { useState, useCallback } from 'react';
import { filesApi } from '../../../api/filesApi';
import { useAppStore } from '../../../store/appStore';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addFile, setSelectedFile } = useAppStore();

  const upload = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const uploaded = await filesApi.upload(file);
      addFile(uploaded);
      setSelectedFile(uploaded);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  }, [addFile, setSelectedFile]);

  return { upload, isUploading, error };
}
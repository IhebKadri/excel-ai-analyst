import { useEffect, useState } from 'react';
import { filesApi } from '../../../api/filesApi';
import { useAppStore } from '../../../store/appStore';

export function useFiles() {
  const [isLoading, setIsLoading] = useState(true);
  const { files, setFiles, selectedFile, setSelectedFile } = useAppStore();

  useEffect(() => {
    filesApi.list()
      .then(setFiles)
      .finally(() => setIsLoading(false));
  }, [setFiles]);

  return { files, isLoading, selectedFile, setSelectedFile };
}
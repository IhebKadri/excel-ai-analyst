import { apiClient } from './client';
import type { UploadedFile } from '../types';

export const filesApi = {
  upload: async (file: File): Promise<UploadedFile> => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await apiClient.post<{ data: { file: UploadedFile } }>(
      '/files',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data.data.file;
  },

  list: async (): Promise<UploadedFile[]> => {
    const { data } = await apiClient.get<{ data: { files: UploadedFile[] } }>('/files');
    return data.data.files;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/files/${id}`);
  },
};
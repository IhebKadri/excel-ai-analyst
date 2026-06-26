import { useCallback } from 'react';
import { useUpload } from '../hooks/useUpload';

export function UploadZone() {
  const { upload, isUploading, error } = useUpload();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleChange}
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-md border border-dashed border-gray-300 text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
      >
        {isUploading ? 'Uploading...' : '+ Upload file'}
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
import { useCallback } from "react";
import { useUpload } from "../hooks/useUpload";

export function UploadZone() {
  const { upload, isUploading, error } = useUpload();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
    >
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleChange}
        className="hidden"
        id="file-input"
      />
      <label htmlFor="file-input" className="cursor-pointer">
        <p className="text-gray-700 font-medium">
          {isUploading
            ? "Uploading..."
            : "Drop your Excel file here or click to browse"}
        </p>
        <p className="text-gray-400 text-sm mt-1">.xlsx and .xls supported</p>
      </label>
      {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
    </div>
  );
}

import { useFiles } from '../hooks/useFiles';

export function FileList() {
  const { files, isLoading, selectedFile, setSelectedFile } = useFiles();

  if (isLoading) {
    return <p className="text-gray-400 text-sm">Loading files...</p>;
  }

  if (files.length === 0) {
    return <p className="text-gray-400 text-sm">No files uploaded yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <li key={file.id}>
          <button
            onClick={() => setSelectedFile(file)}
            className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
              selectedFile?.id === file.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {file.originalName}
          </button>
        </li>
      ))}
    </ul>
  );
}
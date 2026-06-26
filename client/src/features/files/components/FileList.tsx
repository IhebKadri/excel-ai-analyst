import { useFiles } from '../hooks/useFiles';

export function FileList() {
  const { files, isLoading, selectedFile, setSelectedFile } = useFiles();

  if (isLoading) {
    return (
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-7 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return <p className="text-xs text-gray-400 px-2 py-1">No files yet</p>;
  }

  return (
    <ul className="space-y-0.5">
      {files.map((file) => (
        <li key={file.id}>
          <button
            onClick={() => setSelectedFile(file)}
            className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors truncate ${
              selectedFile?.id === file.id
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {file.originalName}
          </button>
        </li>
      ))}
    </ul>
  );
}
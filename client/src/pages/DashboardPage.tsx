import { UploadZone } from '../features/upload/components/UploadZone';
import { FileList } from '../features/files/components/FileList';
import { ChatWindow } from '../features/chat/components/ChatWindow';
import { useAppStore } from '../store/appStore';

export function DashboardPage() {
  const { selectedFile } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">excel-copilot</h1>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <UploadZone />

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-3">
            <h2 className="font-medium text-gray-800 text-sm">Your files</h2>
            <FileList />
          </div>

          <div className="col-span-2">
            {selectedFile ? (
              <ChatWindow fileId={selectedFile.id} />
            ) : (
              <div className="bg-white rounded-xl border p-6 text-center text-gray-400 text-sm">
                Select a file to start analyzing
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
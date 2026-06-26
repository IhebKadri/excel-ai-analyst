import { UploadZone } from "../features/upload/components/UploadZone";
import { FileList } from "../features/files/components/FileList";
import { ChatWindow } from "../features/chat/components/ChatWindow";
import { ReportPanel } from "../features/reports/components/ReportPanel";
import { useAppStore } from "../store/appStore";
import { useAuth } from "../features/auth/hooks/useAuth";
import { FiLogOut } from "react-icons/fi";
export function DashboardPage() {
  const { selectedFile, user } = useAppStore();
  const { logout } = useAuth();

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFA]">
      <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-600 rounded" />
          <span className="text-sm font-semibold text-gray-900 tracking-tight">
            Excel-copilot
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">{user?.email}</span>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer font-medium text-red-600 transition-colors bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          >
            <FiLogOut className="text-base" />
            Log out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-100">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Files
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <FileList />
          </div>
          <div className="p-3 border-t border-gray-100">
            <UploadZone />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          {selectedFile ? (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <p className="text-sm font-medium text-gray-700">
                  {selectedFile.originalName}
                </p>
              </div>
              <ChatWindow
                key={`chat-${selectedFile.id}`}
                fileId={selectedFile.id}
              />
              <ReportPanel
                key={`report-${selectedFile.id}`}
                fileId={selectedFile.id}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  No file selected
                </p>
                <p className="text-xs text-gray-400">
                  Upload a file or select one from the sidebar
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import { useReport } from '../hooks/useReport';

interface Props {
  fileId: string;
}

export function ReportPanel({ fileId }: Props) {
  const { report, generate, isLoading, error } = useReport(fileId);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Report</span>
        {report && (
          <button
            onClick={generate}
            disabled={isLoading}
            className="text-xs text-blue-600 hover:text-blue-700 disabled:opacity-40 transition-colors"
          >
            {isLoading ? 'Regenerating...' : 'Regenerate'}
          </button>
        )}
      </div>

      <div className="p-4">
        {!report ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <p className="text-xs text-gray-400">No report generated yet</p>
            <button
              onClick={generate}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {isLoading ? 'Generating...' : 'Generate report'}
            </button>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Summary</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{report.summary}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Key insights</p>
              <ul className="space-y-2">
                {report.insights.map((insight, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 shrink-0">—</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
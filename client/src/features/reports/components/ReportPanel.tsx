import { useReport } from '../hooks/useReport';

interface Props {
  fileId: string;
}

export function ReportPanel({ fileId }: Props) {
  const { report, generate, isLoading, error } = useReport(fileId);

  if (!report) {
    return (
      <div className="bg-white rounded-xl border p-6 text-center">
        <p className="text-gray-400 text-sm mb-4">No report generated yet.</p>
        <button
          onClick={generate}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Report'}
        </button>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <div>
        <h3 className="font-medium text-gray-800 text-sm mb-2">Summary</h3>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{report.summary}</p>
      </div>

      <div>
        <h3 className="font-medium text-gray-800 text-sm mb-2">Key Insights</h3>
        <ul className="space-y-1">
          {report.insights.map((insight, i) => (
            <li key={i} className="text-sm text-gray-600 flex gap-2">
              <span className="text-blue-500">•</span>{insight}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={generate}
        disabled={isLoading}
        className="text-xs text-blue-600 hover:underline disabled:opacity-50"
      >
        {isLoading ? 'Regenerating...' : 'Regenerate'}
      </button>
    </div>
  );
}
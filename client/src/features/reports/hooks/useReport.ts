import { useState, useCallback } from 'react';
import { analysisApi } from '../../../api/analysisApi';
import type { Report } from '../../../types';

export function useReport(fileId: string) {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analysisApi.getReport(fileId);
      setReport(result);
    } catch {
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fileId]);

  return { report, generate, isLoading, error };
}
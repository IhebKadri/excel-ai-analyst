import { apiClient } from './client';
import type { ChatMessage, Report } from '../types';

export const analysisApi = {
  ask: async (fileId: string, question: string, history: ChatMessage[] = []): Promise<string> => {
    const { data } = await apiClient.post<{ data: { answer: string } }>('/analysis/ask', {
      fileId,
      question,
      history,
    });
    return data.data.answer;
  },

  getReport: async (fileId: string): Promise<Report> => {
    const { data } = await apiClient.get<{ data: { report: Report } }>(`/analysis/report/${fileId}`);
    return data.data.report;
  },
};
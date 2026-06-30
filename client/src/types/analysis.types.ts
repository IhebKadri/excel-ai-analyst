export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  ragUsed?: boolean;
  chunksFound?: number;
}

export interface Report {
  summary: string;
  insights: string[];
}
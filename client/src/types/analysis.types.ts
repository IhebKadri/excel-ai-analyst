export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Report {
  summary: string;
  insights: string[];
}
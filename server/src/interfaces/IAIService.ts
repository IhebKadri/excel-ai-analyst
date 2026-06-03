export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIResponse {
  answer: string;
  tokensUsed: number;
}

export interface IAIService {
  ask(
    prompt: string,
    context: string,
    history?: ChatMessage[],
  ): Promise<AIResponse>;
  summarize(data: string): Promise<string>;
  extractInsights(data: string): Promise<string[]>;
}

import { useState, useCallback } from 'react';
import { analysisApi } from '../../../api/analysisApi';
import type { ChatMessage } from '../../../types';

export function useChat(fileId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (question: string) => {
    const userMessage: ChatMessage = { role: 'user', content: question };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setIsLoading(true);
    setError(null);

    try {
      const answer = await analysisApi.ask(fileId, question, messages);
      setMessages([...nextHistory, { role: 'assistant', content: answer }]);
    } catch {
      setError('Failed to get a response. Please try again.');
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  }, [fileId, messages]);

  return { messages, send, isLoading, error };
}
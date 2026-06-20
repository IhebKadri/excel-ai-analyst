import type { ChatMessage as ChatMessageType } from '../../../types';

interface Props {
  message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
        isUser ? 'ml-auto bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
      }`}
    >
      {message.content}
    </div>
  );
}
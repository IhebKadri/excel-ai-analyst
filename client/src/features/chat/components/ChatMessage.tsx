import type { ChatMessage as ChatMessageType } from '../../../types';

interface Props {
  message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-gray-900 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[75%] bg-gray-50 border-l-2 border-blue-500 text-gray-800 text-sm px-4 py-2.5 rounded-r-2xl">
        {message.content}
      </div>
    </div>
  );
}
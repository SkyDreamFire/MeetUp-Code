import React from 'react';

interface Conversation {
  id: string;
  name: string;
  age: number;
  avatar: string;
  location: string;
  isOnline: boolean;
}

interface MessageListProps {
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
  onClose: () => void;
  onRemove: (conversationId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ conversations, onSelect, onClose, onRemove }) => {
  return (
        <div className="fixed bottom-4 right-4 flex items-end space-x-4 z-50">
<div className="w-[320px] bg-white rounded-lg shadow-xl overflow-hidden">
  <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
    <h3 className="font-semibold text-gray-700">Messages</h3>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600"
    >
      ✕
    </button>
  </div>
  <div className="max-h-96 overflow-y-auto">
    {conversations.map((conversation) => (
      <div
        key={conversation.id}
        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
      >
        <div className="relative">
          <img
            src={conversation.avatar}
            alt={conversation.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          />
          {conversation.isOnline && (
            <div className="absolute top-0 right-0 w-3.5 h-3.5">
              <div className="absolute w-3.5 h-3.5 bg-green-500 rounded-full"></div>
              <div className="absolute w-3.5 h-3.5 bg-green-500 rounded-full animate-ping"></div>
            </div>
          )}
        </div>
        <div className="ml-4 flex-1" onClick={() => onSelect(conversation)}>
          <div className="flex justify-between items-start">
            <p className="font-semibold text-gray-800">{conversation.name}</p>
            <p className="text-sm font-medium text-gray-500">{conversation.age} ans</p>
          </div>
          <p className="text-sm text-gray-500 truncate mt-1">{conversation.location}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(conversation.id);
          }}
          className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
</div>
        </div>

  );
};

export default MessageList;
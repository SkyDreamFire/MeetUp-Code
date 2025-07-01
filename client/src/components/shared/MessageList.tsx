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
    <div className="mb-4 w-72 bg-white rounded-lg shadow-xl overflow-hidden">
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
                className="w-10 h-10 rounded-full object-cover"
              />
              {conversation.isOnline && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5">
                  <div className="absolute w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <div className="absolute w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
            <div className="ml-3 flex-1" onClick={() => onSelect(conversation)}>
              <div className="flex justify-between items-start">
                <p className="font-medium text-gray-800">{conversation.name}</p>
                <p className="text-sm text-gray-500">{conversation.age} ans</p>
              </div>
              <p className="text-sm text-gray-500 truncate">{conversation.location}</p>
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
  );
};

export default MessageList;
import React from 'react';

interface Conversation {
  id: string;
  name: string;
  age: number;
  avatar: string;
}

interface MessageListProps {
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
  onClose: () => void;
}

const MessageList: React.FC<MessageListProps> = ({ conversations, onSelect, onClose }) => {
  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 w-72 bg-white rounded-lg shadow-xl overflow-hidden z-50">
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
        <h3 className="font-semibold text-gray-700">Messages</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
          >
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="font-medium text-gray-800">{conversation.name}</p>
              <p className="text-sm text-gray-500">{conversation.age} ans</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
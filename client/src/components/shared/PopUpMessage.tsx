import React, { useState } from 'react';

interface PopUpMessageProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientAge: number;
}

const PopUpMessage: React.FC<PopUpMessageProps> = ({ isOpen, onClose, recipientName, recipientAge }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique d'envoi du message
    console.log(`Message envoyé à ${recipientName}: ${message}`);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50">
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-gray-800">{recipientName}</h2>
          <span className="text-sm text-gray-500">({recipientAge} ans)</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Écrivez votre message ici..."
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopUpMessage;
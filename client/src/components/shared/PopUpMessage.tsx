import React, { useState } from 'react';

interface PopUpMessageProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientAge: number;
  recipientPhoto: string;
  recipientLocation: string;
  isOnline: boolean;
}

const PopUpMessage: React.FC<PopUpMessageProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientAge,
  recipientPhoto,
  recipientLocation,
  isOnline
}) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Message envoyé à ${recipientName}: ${message}`);
    setMessage('');
  };

  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 w-[420px] bg-white rounded-lg shadow-xl overflow-hidden z-50">
      <div className="p-4 border-b">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img
              src={recipientPhoto}
              alt={recipientName}
              className="w-12 h-12 rounded-full object-cover"
            />
            {isOnline && (
              <div className="absolute top-0 right-0 w-3 h-3">
                <div className="absolute w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-gray-800">{recipientName}</h2>
                <p className="text-sm text-gray-500">{recipientAge} ans</p>
                <p className="text-sm text-gray-500">{recipientLocation}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-40 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Écrivez votre message ici..."
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopUpMessage;
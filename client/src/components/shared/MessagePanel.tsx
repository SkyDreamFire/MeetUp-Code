import React, { useState } from 'react';
import PopUpMessage from './PopUpMessage';
import MessageList from './MessageList';
import { mockUsers } from '../../data/mockUsers';

const MessagePanel: React.FC = () => {
  const [recipient, setRecipient] = useState<any>(null);
  const [showList, setShowList] = useState(false);

  const toggleMessage = (user: any) => {
    if (!recipient) {
      setRecipient(user);
      setShowList(false);
    } else if (recipient && !showList) {
      setShowList(true);
    } else {
      setRecipient(null);
      setShowList(false);
    }
  };

  const handleCloseAll = () => {
    setRecipient(null);
    setShowList(false);
  };

  const handleCloseList = () => {
    setShowList(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end space-x-4">
      {recipient && (
        <div
          className={`transition-all duration-300 ${
            showList ? 'ml-[-340px]' : ''
          }`}
        >
          <PopUpMessage
            isOpen={!!recipient}
            onClose={handleCloseAll}
            recipientName={recipient.name}
            recipientAge={recipient.age}
            recipientPhoto={recipient.profileImage}
            recipientLocation={`${recipient.city}, ${recipient.country}`}
            isOnline={recipient.isOnline}
          />
        </div>
      )}

      {recipient && showList && (
        <MessageList
          conversations={mockUsers.map((user) => ({
            id: String(user.id),
            name: user.name,
            age: user.age,
            avatar: user.profileImage,
            location: `${user.city}, ${user.country}`,
            isOnline: user.isOnline,
          }))}
          onSelect={(conv) => {
            setRecipient(conv);
            setShowList(false);
          }}
          onClose={handleCloseList}
          onRemove={(id) => console.log('remove', id)}
        />
      )}
    </div>
  );
};

export default MessagePanel;

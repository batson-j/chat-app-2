import React from 'react';
import Message, { MessageProps } from './Message';

interface MessageListProps {
  messages: MessageProps[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <div key={index} className="mb-4">
          <Message text={message.text} messageType={message.messageType} />
        </div>
      ))}
    </div>
  );
};
export default MessageList;

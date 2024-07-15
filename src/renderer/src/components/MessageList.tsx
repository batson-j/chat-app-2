import React from 'react';
import Message from './Message';
import { MessageProps, MessageType } from '../../../model/Conversation';

interface MessageListProps {
  messages: MessageProps[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.messageType === MessageType.UserMessage ? 'user-message' : 'ai-message'}`}
        >
          <Message text={message.text} messageType={message.messageType} />
        </div>
      ))}
    </div>
  );
};
export default MessageList;

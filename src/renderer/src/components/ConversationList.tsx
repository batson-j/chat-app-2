import React, { createRef, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // import the stylesheet
import { IoAddCircleOutline, IoTrashOutline } from 'react-icons/io5';
import { MessageProps } from './Message';

export interface Conversation {
  id: string;
  messages: MessageProps[];
  title: string;
}

interface ConversationListProps {
  conversations: { [key: string]: Conversation };
  activeConversationId: string;
  handleConversationClick: (conversationId: string) => void;
  handleNewConversation: () => void; // add this prop
  handleDeleteConversation: (id: string) => void; // add this prop
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  handleConversationClick,
  handleNewConversation, // add this prop
  handleDeleteConversation // add this prop
}) => {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="flex-grow text-left ml-4">Conversations</h2>
        <span
          className={`me-4 px-1 py-1 mt-[8px] bg-transparent transition duration-300 hover:text-green-400 cursor-pointer`}
          onClick={handleNewConversation}
        >
          <IoAddCircleOutline fontSize={24} />
        </span>
      </div>
      <ul className="list-none pb-2 px-3 m-0 ">
        {Object.entries(conversations)
          .reverse()
          .map(([key, conversation], index) => (
            <li key={index}>
              <Tippy
                content={conversation.title}
                theme="dark"
                placement="right"
                disabled={conversation.title.length == 0}
              >
                <div className="relative group">
                  <button
                    onClick={() => handleConversationClick(conversation.id)}
                    className={`truncate w-full text-left pe-7 my-1 h-[47px] ${
                      activeConversationId === conversation.id ? 'bg-gray-700' : ''
                    }`}
                  >
                    {conversation.title}
                    <span
                      className={`absolute right-3 top-[18px] transition duration-300 opacity-0 group-hover:opacity-100 hover:text-red-500`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conversation.id);
                      }}
                    >
                      <IoTrashOutline fontSize={18} />
                    </span>
                  </button>
                </div>
              </Tippy>
            </li>
          ))}
      </ul>
    </div>
  );
};
export default ConversationList;

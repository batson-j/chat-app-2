import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { IoAddCircleOutline, IoTrashOutline } from 'react-icons/io5';
import { useConversationsState } from '@renderer/contexts/ConversationsContext';

interface ConversationListProps {
  activeConversationId: string | undefined;
  handleConversationClick: (conversationId: string) => void;
  handleNewConversation: () => void;
  handleDeleteConversation: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  activeConversationId,
  handleConversationClick,
  handleNewConversation,
  handleDeleteConversation
}) => {
  const { conversationState } = useConversationsState();

  return (
    <div className="conversation-list">
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex-grow text-left ml-8 mt-2">
          <strong>Conversations</strong>
        </h2>
        <span
          className="me-4 px-1 py-1 mt-[8px] bg-transparent transition duration-300 hover:text-green-400 hover:scale-110 cursor-pointer"
          onClick={handleNewConversation}
        >
          <IoAddCircleOutline fontSize={24} />
        </span>
      </div>
      <ul className="list-none pb-2 px-3 m-0">
        {Object.entries(conversationState.conversations)
          .reverse()
          .map(([, conversation], index) => (
            <li
              key={index}
              className={`conversation-item ${activeConversationId === conversation.id ? 'active' : ''}`}
            >
              <Tippy
                content={conversation.title}
                theme="dark"
                placement="right"
                disabled={conversation.title.length == 0}
              >
                <div className="relative group">
                  <button
                    onClick={() => handleConversationClick(conversation.id)}
                    className={`truncate w-full text-left pe-7`}
                  >
                    {conversation.title}
                    <span
                      className={`absolute right-3 mt-0.5 transition duration-300 opacity-0 group-hover:opacity-100 hover:text-red-500`}
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

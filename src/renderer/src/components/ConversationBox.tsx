import { useConversationsState } from '@renderer/contexts/ConversationsContext';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { Conversation, MessageType } from '../../../model/Conversation';

interface ConversationBoxProps {
  conversationId: string;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ conversationId }) => {
  const { conversationState, setConversationState } = useConversationsState();
  if (conversationState.conversations[conversationId] == null) {
    return <div></div>;
  }
  const sm = async (message: string, provider: string, model: string): Promise<void> => {
    const handleReplyStream = (
      _event: Electron.IpcRendererEvent,
      activeConversation: Conversation
    ): void => {
      setConversationState({
        conversations: {
          ...conversationState.conversations,
          [conversationId]: activeConversation
        }
      });
    };

    const handleReplyStreamEnd = (): void => {
      window.ipcRenderer.removeAllListeners('reply-stream');
      window.ipcRenderer.removeAllListeners('reply-stream-end');
    };

    const activeConversation = conversationState.conversations[conversationId];
    activeConversation.messages.push({
      text: message,
      provider: provider,
      model: model,
      messageType: MessageType.UserMessage
    });

    setConversationState({
      conversations: {
        ...conversationState.conversations,
        [conversationId]: activeConversation
      }
    });
    window.ipcRenderer.on('reply-stream', handleReplyStream);
    window.ipcRenderer.on('reply-stream-end', handleReplyStreamEnd);

    window.ipcRenderer.send(
      'conversation',
      conversationState.conversations[conversationId],
      provider,
      model
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <MessageList messages={conversationState.conversations[conversationId].messages} />
      <ChatInput onSendMessage={sm} />
    </div>
  );
};
export default ConversationBox;

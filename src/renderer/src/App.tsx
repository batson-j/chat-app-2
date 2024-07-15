import { Allotment } from 'allotment';
import ConversationList from './components/ConversationList';
import { useState } from 'react';

import 'allotment/dist/style.css';
import ConversationBox from './components/ConversationBox';
import { useConversationsState } from './contexts/ConversationsContext';
import { Conversation } from '../../model/Conversation';
import { motion } from 'framer-motion';

function App(): JSX.Element {
  const { conversationState, setConversationState } = useConversationsState();

  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();

  const handleConversationClick = (conversationId: string): void => {
    setActiveConversationId(conversationId);
  };

  const handleNewConversation = (): void => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      messages: [],
      title: 'New Chat...'
    };

    setActiveConversationId(newConversation.id);
    setConversationState((prevConversationState) => ({
      conversations: {
        ...prevConversationState.conversations,
        [newConversation.id]: newConversation
      }
    }));
  };

  const handleDeleteConversation = (id: string): void => {
    const newConversations = { ...conversationState.conversations };
    delete newConversations[id];

    if (Object.keys(newConversations).length === 0) {
      setActiveConversationId('');
    } else if (activeConversationId === id) {
      const newActiveId = Object.keys(newConversations)[0];
      setActiveConversationId(newActiveId || '');
    }

    setConversationState({
      conversations: newConversations
    });
  };

  return (
    <motion.div
      className="App glass-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Allotment defaultSizes={[15, 85]}>
        <Allotment.Pane minSize={250} className="glass-panel">
          <ConversationList
            activeConversationId={activeConversationId}
            handleConversationClick={handleConversationClick}
            handleNewConversation={handleNewConversation}
            handleDeleteConversation={handleDeleteConversation}
          />
        </Allotment.Pane>
        <Allotment.Pane snap className="glass-panel">
          {activeConversationId && <ConversationBox conversationId={activeConversationId} />}
        </Allotment.Pane>
      </Allotment>
    </motion.div>
  );
}

export default App;

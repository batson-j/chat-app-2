import { Allotment } from 'allotment';
import ConversationList from './components/ConversationList';
import { useState } from 'react';

import 'allotment/dist/style.css';
import ConversationBox from './components/ConversationBox';
import { useConversationsState } from './contexts/ConversationsContext';
import { Conversation } from '../../model/Conversation';

function App(): JSX.Element {
  const { conversationState, setConversationState } = useConversationsState();

  const [activeConversationId, setActiveConversationId] = useState<string>(
    Object.keys(conversationState.conversations)[0]
  );

  const handleConversationClick = (conversationId: string): void => {
    console.log(conversationId, 'conversation selected');
    console.log(conversationState);
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

    if (activeConversationId === id) {
      const newActiveId = Object.keys(newConversations)[0];
      setActiveConversationId(newActiveId || '');
    }

    setConversationState({
      conversations: newConversations
    });
  };
  return (
    <div className="App">
      <Allotment defaultSizes={[15, 85]}>
        <Allotment.Pane minSize={250}>
          <ConversationList
            activeConversationId={activeConversationId}
            handleConversationClick={handleConversationClick}
            handleNewConversation={handleNewConversation}
            handleDeleteConversation={handleDeleteConversation}
          />
        </Allotment.Pane>
        <Allotment.Pane snap>
          {activeConversationId && <ConversationBox conversationId={activeConversationId} />}
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default App;

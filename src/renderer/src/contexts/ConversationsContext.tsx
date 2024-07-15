// src/contexts/PreferencesContext.tsx
import React, { PropsWithChildren, createContext, useContext, useState } from 'react';
import { Conversation } from '@model/Conversation';

interface ConversationsState {
  conversations: { [key: string]: Conversation };
}

interface ConversationsContextProps {
  conversationState: ConversationsState;
  setConversationState: React.Dispatch<React.SetStateAction<ConversationsState>>;
}

const ConversationsContext = createContext<ConversationsContextProps | undefined>(undefined);
export const ConversationsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [conversationState, setConversationState] = useState<ConversationsState>({
    conversations: {}
  });

  return (
    <ConversationsContext.Provider value={{ conversationState, setConversationState }}>
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversationsState = (): ConversationsContextProps => {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error('useConversationsState must be used within a ConversationsProvider');
  }
  return context;
};

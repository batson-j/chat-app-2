import { Allotment } from 'allotment';
import ConversationList, { Conversation } from './components/ConversationList';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { MessageType } from './components/Message';
import { useState } from 'react';

import 'allotment/dist/style.css';

function App(): JSX.Element {
  const [conversations, setConversations] = useState<{
    [key: string]: Conversation;
  }>({});
  const [activeConversationId, setActiveConversationId] = useState<string>('');

  const handleReplyStream = (event: Electron.IpcRendererEvent, tokens: string[]) => {
    const activeConversation = conversations[activeConversationId];
    const lastMessageIndex = activeConversation.messages.length - 1;
    const lastMessage = activeConversation.messages[lastMessageIndex];
    const updatedLastMessage = {
      ...lastMessage,
      text: tokens.join('')
    };

    activeConversation.messages = [
      ...activeConversation.messages.slice(0, lastMessageIndex),
      updatedLastMessage
    ];

    setConversations((prevConversations) => ({
      ...prevConversations,
      [activeConversationId]: activeConversation
    }));
  };

  const handleReplyStreamEnd = () => {
    window.ipcRenderer.removeAllListeners('reply-stream');
    window.ipcRenderer.removeAllListeners('reply-stream-end');
  };

  const sendMessage = async (message: string, provider: string, model: string) => {
    window.ipcRenderer.on('reply-stream', handleReplyStream);
    window.ipcRenderer.on('reply-stream-end', handleReplyStreamEnd);

    const activeConversation = conversations[activeConversationId];
    if (activeConversation.messages.length == 0) {
      activeConversation.title = message;
    }
    activeConversation.messages.push({
      text: message,
      messageType: MessageType.UserMessage,
      provider,
      model
    });
    activeConversation.messages.push({
      text: '',
      messageType: MessageType.Reply,
      provider,
      model
    });

    setConversations((prevConversations) => ({
      ...prevConversations,
      [activeConversationId]: activeConversation
    }));

    window.ipcRenderer.send('conversation', activeConversation, provider, model);
  };

  const handleConversationClick = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      messages: [],
      title: 'New Chat...'
    };

    setActiveConversationId(newConversation.id);
    setConversations((prevConversations) => ({
      ...prevConversations,
      [newConversation.id]: newConversation
    }));
  };

  const handleDeleteConversation = (id: string) => {
    const newConversations = { ...conversations };
    delete newConversations[id];

    if (activeConversationId === id) {
      const newActiveId = Object.keys(newConversations)[0];
      setActiveConversationId(newActiveId || '');
    }

    setConversations(newConversations);
  };
  return (
    <div className="App">
      <Allotment defaultSizes={[15, 85]}>
        <Allotment.Pane minSize={250}>
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            handleConversationClick={handleConversationClick}
            handleNewConversation={handleNewConversation}
            handleDeleteConversation={handleDeleteConversation}
          />
        </Allotment.Pane>
        <Allotment.Pane snap>
          {activeConversationId && (
            <div className="flex flex-col h-screen">
              <MessageList messages={conversations[activeConversationId].messages} />
              <ChatInput onSendMessage={sendMessage} />
            </div>
          )}
        </Allotment.Pane>
      </Allotment>
      {/* <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool!
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <button rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </button>
        </div>
      </div>
      <Versions></Versions> */}
    </div>
  );
}

export default App;

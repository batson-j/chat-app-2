import React, { useState } from 'react';
import { IoSettings } from 'react-icons/io5';
import ProviderModelSelector from './ProviderModelSelector';

interface ChatInputProps {
  onSendMessage: (message: string, provider: string, model: string) => void;
  isGenerating?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isGenerating = false }) => {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [provider, setProvider] = useState<string>('OpenAI');
  const [model, setModel] = useState<string>('GPT-3.5-turbo');

  const handleSendMessage = () => {
    if (!isGenerating) {
      if (input.trim()) {
        onSendMessage(input.trim(), provider, model);
        setInput('');
      }
    }
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const handleProviderModelSelect = (selectedProvider: string, selectedModel: string) => {
    setProvider(selectedProvider);
    setModel(selectedModel);
  };

  return (
    <div className="p-4 bg-gray-1000">
      {showSettings ? (
        <div className="flex flex-col" onClick={handleSettingsClose}>
          <SettingsPanel />
          <ProviderModelSelector onSelect={handleProviderModelSelect} />
          <button
            className="mt-2 p-2 bg-blue-900 text-gray-300 rounded hover:text-gray-100"
            onClick={handleSettingsClick}
          >
            Close Settings
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-row mb-2">
            <ProviderModelSelector onSelect={handleProviderModelSelect} />
          </div>
          <div className="flex flex-row">
            <textarea
              className="flex-grow p-2 border rounded resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message and press Enter to send..."
              rows={input.split('\n').length > 6 ? 6 : input.split('\n').length}
              style={{
                overflowX: 'auto',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%'
              }}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 p-2 bg-blue-500 text-white rounded"
              disabled={isGenerating}
            >
              Send
            </button>
            <button
              className="ml-2 p-2 bg-blue-900 text-gray-300 rounded hover:text-gray-100"
              onClick={handleSettingsClick}
            >
              <IoSettings />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsPanel: React.FC = () => {
  return (
    <div
      className="flex-grow p-2 border rounded resize-none bg-gray-800 p-4"
      style={{
        overflowX: 'auto',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%'
      }}
    >
      <h2 style={{ textAlign: 'left' }}>Settings</h2>
    </div>
  );
};

export default ChatInput;

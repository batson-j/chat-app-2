import React, { useState } from 'react';
import { IoSettings } from 'react-icons/io5';
import ProviderModelSelector from './ProviderModelSelector';
import { usePreferences } from '@renderer/contexts/PreferencesContext';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string, provider: string, model: string) => void;
  isGenerating?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isGenerating = false }) => {
  const { preferences } = usePreferences();
  const [input, setInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(preferences.providers[0].name);
  const [selectedModel, setSelectedModel] = useState(preferences.providers[0].models[0].name);
  const [showSettings, setShowSettings] = useState(false);

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const handleSendMessage = () => {
    if (!isGenerating) {
      if (input.trim()) {
        onSendMessage(input.trim(), selectedProvider, selectedModel);
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

  return (
    <div className="input-area">
      {showSettings ? (
        <div className="flex flex-col" onClick={handleSettingsClose}>
          <SettingsPanel />
          <ProviderModelSelector
            selectedProvider={selectedProvider}
            selectedModel={selectedModel}
            preferences={preferences}
            onProviderChange={handleProviderChange}
            onModelChange={handleModelChange}
          />
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
            <ProviderModelSelector
              selectedProvider={selectedProvider}
              selectedModel={selectedModel}
              preferences={preferences}
              onProviderChange={handleProviderChange}
              onModelChange={handleModelChange}
            />
          </div>
          <div className="flex flex-row">
            <textarea
              className="input-field"
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
            <motion.button
              className="send-button"
              onClick={handleSendMessage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send
            </motion.button>
            <button
              className="ml-2 p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded hover:from-blue-600 hover:to-purple-600 transition duration-300"
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

import React, { useState, useEffect } from 'react';

interface Provider {
  name: string;
  models: string[];
}

const providers: Provider[] = [
  { name: 'OpenAI', models: ['GPT-3.5-turbo', 'GPT-4'] },
  { name: 'Anthropic', models: ['Claude-v1', 'Claude-instant-v1'] },
  { name: 'Cohere', models: ['Command', 'Generate'] }
  // Add more providers as needed
];

interface ProviderModelSelectorProps {
  onSelect: (provider: string, model: string) => void;
}

const ProviderModelSelector: React.FC<ProviderModelSelectorProps> = ({ onSelect }) => {
  const [selectedProvider, setSelectedProvider] = useState<string>(providers[0].name);
  const [selectedModel, setSelectedModel] = useState<string>(providers[0].models[0]);

  useEffect(() => {
    const provider = providers.find((p) => p.name === selectedProvider);
    if (provider) {
      setSelectedModel(provider.models[0]);
    }
  }, [selectedProvider]);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvider(e.target.value);
    onSelect(e.target.value, selectedModel);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
    onSelect(selectedProvider, e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedProvider}
        onChange={handleProviderChange}
        className="bg-gray-700 text-white rounded px-2 py-1"
      >
        {providers.map((provider) => (
          <option key={provider.name} value={provider.name}>
            {provider.name}
          </option>
        ))}
      </select>
      <select
        value={selectedModel}
        onChange={handleModelChange}
        className="bg-gray-700 text-white rounded px-2 py-1"
      >
        {providers
          .find((p) => p.name === selectedProvider)
          ?.models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ProviderModelSelector;

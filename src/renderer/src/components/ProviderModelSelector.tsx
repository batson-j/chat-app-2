// src/renderer/src/components/ProviderModelSelector.tsx
import React from 'react';
import { PreferencesState } from '../contexts/PreferencesContext';

interface ProviderModelSelectorProps {
  selectedProvider: string;
  selectedModel: string;
  preferences: PreferencesState;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
}

const ProviderModelSelector: React.FC<ProviderModelSelectorProps> = ({
  selectedProvider,
  selectedModel,
  preferences,
  onProviderChange,
  onModelChange
}) => {
  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onProviderChange(event.target.value);
    const provider = preferences.providers.find((p) => p.name === event.target.value);
    if (provider && provider.models.length > 0) {
      onModelChange(provider.models[0].name); // Default to the first model of the selected provider
    }
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onModelChange(event.target.value);
  };

  const selectedProviderData = preferences.providers.find(
    (provider) => provider.name === selectedProvider
  );
  const isProviderSelected = selectedProviderData !== undefined;

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedProvider}
        onChange={handleProviderChange}
        className="bg-gray-700 text-white rounded px-2 py-1"
      >
        {preferences.providers.map((provider) => (
          <option key={provider.name} value={provider.name}>
            {provider.name}
          </option>
        ))}
      </select>
      <select
        value={selectedModel}
        onChange={handleModelChange}
        className="bg-gray-700 text-white rounded px-2 py-1"
        disabled={!isProviderSelected}
      >
        {isProviderSelected &&
          selectedProviderData.models.map((model) => (
            <option key={model.name} value={model.name}>
              {model.displayName}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ProviderModelSelector;

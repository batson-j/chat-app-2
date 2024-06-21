// src/Preferences.tsx
import React from 'react';
import { usePreferences } from './contexts/PreferencesContext';

const Preferences: React.FC = () => {
  const { preferences, setPreferences } = usePreferences();

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences((prev) => ({ ...prev, provider: e.target.value }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences((prev) => ({ ...prev, model: e.target.value }));
  };

  return (
    <div>
      <h1>Preferences</h1>
      <select
        value={preferences.provider}
        onChange={handleProviderChange}
        className="bg-gray-700 text-white rounded px-2 py-1"
      >
        {/* Populate with available providers */}
      </select>
      <select
        value={preferences.model}
        onChange={handleModelChange}
        className="bg-gray-700 text-white rounded px-2 py-1"
      >
        {/* Populate with models for the selected provider */}
      </select>
    </div>
  );
};

export default Preferences;

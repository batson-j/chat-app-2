// src/contexts/PreferencesContext.tsx
import React, { PropsWithChildren, createContext, useContext, useState } from 'react';
import { Provider } from '../../../model/ModelProvider';

export interface PreferencesState {
  providers: Provider[];
}

interface PreferencesContextProps {
  preferences: PreferencesState;
  setPreferences: React.Dispatch<React.SetStateAction<PreferencesState>>;
}

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);

export const PreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [preferences, setPreferences] = useState<PreferencesState>({
    providers: [
      {
        name: 'OpenAI',
        apiKey: '',
        models: [
          {
            name: 'gpt-3.5-turbo',
            displayName: 'gpt-3.5-turbo',
            contextLength: 100
          }
        ]
      }
    ]
  });

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextProps => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

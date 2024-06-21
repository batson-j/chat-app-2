import './assets/main.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Preferences from './Preferences';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { ConversationsProvider } from './contexts/ConversationsContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConversationsProvider>
      <PreferencesProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/preferences" element={<Preferences />} />
          </Routes>
        </HashRouter>
      </PreferencesProvider>
    </ConversationsProvider>
  </React.StrictMode>
);

import './assets/main.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Preferences from './Preferences';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/preferences" element={<Preferences />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';    // you can omit if you don’t have one
import "@fontsource/orbitron/400.css"; // regular weight
import "@fontsource/orbitron/700.css"; // bold weight, if you like


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

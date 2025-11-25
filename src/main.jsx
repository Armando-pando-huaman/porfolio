import React from 'react';
import ReactDOM from 'react-dom/client';
import AppTest from './App-test.js';  // ← Usa el archivo de prueba
import './styles/App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppTest />
  </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';
import AuthProvider from './context/AuthContext'; // ✅ FIXED: default import
import NotificationProvider from './context/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </AuthProvider>
  </React.StrictMode>
);

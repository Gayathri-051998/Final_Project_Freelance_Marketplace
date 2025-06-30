import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';
import AuthProvider from './context/AuthContext'; // ✅ FIXED: default import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Wrap your app in the AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

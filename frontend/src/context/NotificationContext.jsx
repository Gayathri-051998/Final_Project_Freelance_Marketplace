// src/context/NotificationContext.jsx
import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (msg) => {
    setNotifications((prev) => [...prev, { id: Date.now(), msg }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

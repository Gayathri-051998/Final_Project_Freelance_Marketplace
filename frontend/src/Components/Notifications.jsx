// src/Components/Notifications.jsx
import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

const Notifications = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((note) => (
        <div key={note.id} className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg flex justify-between items-center">
          <span>{note.msg}</span>
          <button onClick={() => removeNotification(note.id)} className="ml-4 text-sm">✖</button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;

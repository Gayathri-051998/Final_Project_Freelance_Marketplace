import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

const NotificationList = () => {
  const { notifications } = useContext(NotificationContext) || { notifications: [] };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((n) => (
        <div key={n.id} className="bg-green-500 text-white px-4 py-2 rounded shadow">
          {n.msg}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;

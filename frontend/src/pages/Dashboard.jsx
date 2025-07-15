import React from 'react';
import { useAuth } from '../context/AuthContext';
import CreateContract from './CreateContract'; // ✅ no curly braces

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
      <p>Your role: <strong>{user?.role}</strong></p>
      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
      {user?.role === 'client' && <CreateContract />} {/* ✅ Show only to clients */}
    </div>
  );
};

export default Dashboard;

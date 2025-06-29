import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CreateContract from './CreateContract'; // ✅ Ensure file name matches

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  console.log(user); // debug line
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
      <p>Your role: <strong>{user?.role}</strong></p>

      {/* ✅ Show contract form only for client */}
      {user?.role === 'client' && <CreateContract />}

      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};
export default Dashboard;

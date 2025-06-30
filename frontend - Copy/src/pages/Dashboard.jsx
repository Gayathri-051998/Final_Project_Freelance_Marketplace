import React from 'react';


import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CreateContract from './CreateContract'; // ✅ remove curly braces

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  console.log(user); // debug line
  

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
    
  }
export default Dashboard;

import React from 'react';
import { Link, useNavigate ,NavLink} from 'react-router-dom'; // ✅ include useNavigate
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // ✅ hook for redirect

  const handleLogout = () => {
    logout();             // Clear auth info from context
    navigate('/login');   // ✅ Redirect to login
  };

  
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        {user?.role === 'client' && (<><Link to="/post-job">Post Job</Link>  <Link to="/my-jobs">My Jobs</Link> </>)}
        {user?.role === 'freelancer' && (<><Link to="/post-service">Post Service</Link> <Link to="/my-services">My Services</Link></>)}
        {user?.role === 'client' && <Link to="/create-contract">Create Contract</Link>}

        <Link to="/contracts">Contracts</Link>
        <Link to="/review">Review</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/change-password">Change Password</Link>
        
        <Link to="/jobs" >Browse Jobs</Link>
        <Link to="/browse-jobs">Search Jobs</Link>
        <NavLink to="/browse-services">Browse Services</NavLink>

      </div>
      <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
    </nav>
  );
};

export default Navbar;

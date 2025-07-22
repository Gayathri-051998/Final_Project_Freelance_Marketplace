import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import NotificationList from './Components/NotificationList';
import Navbar from './Components/NavBar';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import PostService from './pages/PostService';
import MyServices from './pages/MyServices';
import Contracts from './pages/Contracts';
import SubmitReview from './pages/SubmitReview';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import CreateContract from './pages/CreateContract';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

const App = () => {
  const auth = useContext(AuthContext);
  if (!auth) return null;
  const { user } = auth;

  return (
    <>
      {user && <Navbar />}
      <NotificationList />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/post-job" element={user ? <PostJob /> : <Navigate to="/login" />} />
        <Route path="/my-jobs" element={user ? <MyJobs /> : <Navigate to="/login" />} />
        <Route path="/post-service" element={user ? <PostService /> : <Navigate to="/login" />} />
        <Route path="/my-services" element={user ? <MyServices /> : <Navigate to="/login" />} />
        <Route path="/contracts" element={user ? <Contracts /> : <Navigate to="/login" />} />
        <Route path="/review" element={user ? <SubmitReview /> : <Navigate to="/login" />} />
        <Route path="/create-contract" element={user ? <CreateContract /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/change-password" element={user ? <ChangePassword /> : <Navigate to="/login" />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </>
  );
};

export default App;

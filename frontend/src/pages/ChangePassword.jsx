import React, { useState, useContext } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';

const ChangePassword = () => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/auth/change-password', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Password updated successfully');
      setForm({ oldPassword: '', newPassword: '' });
    } catch {
      alert('Failed to change password');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border shadow">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="oldPassword"
          placeholder="Current Password"
          value={form.oldPassword}
          onChange={handleChange}
          required
          className="w-full p-2 border"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
          className="w-full p-2 border"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

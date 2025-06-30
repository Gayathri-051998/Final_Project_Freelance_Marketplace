import React, { useState, useEffect, useContext } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { token, user, login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', role: '', bio: '' });

  useEffect(() => {
    axios
      .get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { name, email, role, bio } = res.data;
        setForm({ name, email, role, bio: bio || '' });
      })
      .catch(() => alert('Failed to load profile'));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/auth/me', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated!');
      login(res.data, token); // Update local user state
      setForm({
        name: '',
        email: '',
        role: '',
        bio: ''
      });
    } catch {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 border shadow">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="role"
          value={form.role}
          readOnly
          className="w-full p-2 border bg-gray-100 text-gray-500"
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Short bio or skills"
          className="w-full p-2 border"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;

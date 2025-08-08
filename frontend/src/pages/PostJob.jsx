/*import React from 'react';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PostJob = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
    deadline: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://final-project-freelance-marketplace.onrender.com/api/jobs', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Job posted successfully');
      setForm({ title: '', description: '', budget: '', category: '', deadline: '' });
    } catch {
      alert('Failed to post job');
    }
  };

  
  return (
    <div className="max-w-md mx-auto p-6 mt-8 border shadow">
      <h2 className="text-xl font-bold mb-4">Post a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border" />
        <input type="number" name="budget" value={form.budget} onChange={handleChange} placeholder="Budget" className="w-full p-2 border" />
        <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border" />
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full p-2 border" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default PostJob;
*/

import React, { useState } from 'react';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', budget: '', tags: '' });

  const handleSubmit = async (status) => {
    await axios.post('/api/jobs', { ...form, tags: form.tags.split(','), status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/my-jobs');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Post a Job</h2>
      <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="border w-full mb-2 px-2 py-1" />
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border w-full mb-2 px-2 py-1" />
      <input type="number" placeholder="Budget" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className="border w-full mb-2 px-2 py-1" />
      <input placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="border w-full mb-2 px-2 py-1" />

      <div className="space-x-2">
        <button onClick={() => handleSubmit('draft')} className="bg-gray-500 text-white px-3 py-1">Save as Draft</button>
        <button onClick={() => handleSubmit('active')} className="bg-blue-500 text-white px-3 py-1">Publish</button>
      </div>
    </div>
  );
};

export default PostJob;

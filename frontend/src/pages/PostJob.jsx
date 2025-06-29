import React from 'react';

import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const PostJob = () => {
  const { token } = useContext(AuthContext);
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

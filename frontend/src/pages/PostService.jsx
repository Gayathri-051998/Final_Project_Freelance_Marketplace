
import React from 'react';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';


const PostService = () => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://final-project-freelance-marketplace.onrender.com/api/services', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Service posted');
      setForm({ title: '', description: '', price: '', category: '' });
    } catch {
      alert('Failed to post service');
    }
  };
  


  return (
    <div className="max-w-md mx-auto p-6 mt-8 border shadow">
      <h2 className="text-xl font-bold mb-4">Post a Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border" />
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border" />
        <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
      <button onClick={handlePayment} className="bg-green-600 text-white px-4 py-2 rounded">
  Pay Now
</button>
    </div>
  );
};

export default PostService;

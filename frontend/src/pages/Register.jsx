import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // ✅ use the hook
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const { login } = useAuth(); // ✅ get login from hook
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://final-project-freelance-marketplace.onrender.com/api/auth/register',
        form
      );
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="w-full border p-2" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full border p-2" />
        <select name="role" onChange={handleChange} className="w-full border p-2">
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
        <p className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

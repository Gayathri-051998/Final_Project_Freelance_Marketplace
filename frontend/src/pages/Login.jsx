import React from 'react';

import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {Link,  useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://final-project-freelance-marketplace.onrender.com/api/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed', err.message);
    }
  };

  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full border p-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Login</button>
        <p className="text-sm mt-4 text-center text-gray-600">
                      Don’t have an account?{' '}
                      <Link to="/register" className="text-blue-500 hover:underline">
                        Register here
                      </Link>
                    </p>

      </form>
    </div>
  );
};

export default Login;

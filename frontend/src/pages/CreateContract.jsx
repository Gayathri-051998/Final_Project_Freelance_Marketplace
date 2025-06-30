import React, { useEffect, useState, useContext } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CreateContract() {
  const { token } = useContext(AuthContext);
  const [freelancers, setFreelancers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ freelancer: '', job: '' });
  const navigate = useNavigate();

  // Fetch freelancers
  useEffect(() => {
    axios
      .get('/api/auth/freelancers', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFreelancers(res.data))
      .catch(() => alert('Failed to load freelancers'));
  }, [token]);

  // Fetch jobs posted by this client
  useEffect(() => {
    axios
      .get('https://final-project-freelance-marketplace.onrender.com/api/jobs/my-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setJobs(res.data))
      .catch(() => alert('Failed to load jobs'));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://final-project-freelance-marketplace.onrender.com/api/contracts', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Contract created successfully!');
      navigate('/contracts');
    } catch {
      alert('Failed to create contract');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 border shadow">
      <h2 className="text-xl font-bold mb-4">Create Contract</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="freelancer"
          value={form.freelancer}
          onChange={handleChange}
          required
          className="w-full p-2 border"
        >
          <option value="">Select Freelancer</option>
          {freelancers.map((f) => (
            <option key={f._id} value={f._id}>
              {f.name} ({f.email})
            </option>
          ))}
        </select>

        <select
          name="job"
          value={form.job}
          onChange={handleChange}
          required
          className="w-full p-2 border"
        >
          <option value="">Select Job</option>
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>
              {j.title}
            </option>
          ))}
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Contract
        </button>
      </form>
    </div>
  );
}


export default CreateContract;


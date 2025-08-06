// src/pages/CreateContract.jsx
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';

const CreateContract = () => {
  const { token } = useAuth();
  const [freelancers, setFreelancers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [usedJobIds, setUsedJobIds] = useState([]); // ✅ MUST initialize as []
  const [selectedFreelancer, setSelectedFreelancer] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [message, setMessage] = useState('');

  // 🔁 Fetch data
  useEffect(() => {
    axios.get('/api/auth/freelancers', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setFreelancers(res.data))
    .catch(err => console.error("Failed to load freelancers", err));
  
    axios.get('/api/contracts/jobs-used', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsedJobIds(res.data))
    .catch(err => console.error("Failed to load used job ids", err));
  
    axios.get('/api/jobs/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setJobs(res.data))
    .catch(err => console.error("Failed to load jobs", err));
  }, [token]);
  

  // ✅ Filter only jobs that are NOT used in contracts
  const availableJobs = jobs.filter(job => !usedJobIds?.includes(job._id));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating contract with:",  selectedFreelancer, selectedJob );
      await axios.post('/api/contracts', {
        freelancerId: selectedFreelancer,
        jobId: selectedJob
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Contract created successfully!');
    } catch (err) {
      console.error("❌ Contract creation failed:", err);
      setMessage('❌ Failed to create contract');
    }
  };

 

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create Contract</h2>

      {message && <p className="mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Freelancer</label>
          <select
            value={selectedFreelancer}
            onChange={(e) => setSelectedFreelancer(e.target.value)}
            className="block w-full border px-3 py-2"
          >
            <option value="">Select Freelancer</option>
            {freelancers.map(f => (
              <option key={f._id} value={f._id}>
                {f.name} ({f.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Job</label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="block w-full border px-3 py-2"
          >
            <option value="">Select Job</option>
            {availableJobs.map(job => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!selectedFreelancer || !selectedJob}
        >
          Create Contract
        </button>
      </form>
    </div>
  );
};

export default CreateContract;

/*import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../axios';

const MyJobs = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/jobs/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setJobs(res.data))
      .catch(() => alert('Failed to load jobs'))
      .finally(() => setLoading(false)); // ✅ fix here
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Posted Jobs</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="p-4 border rounded shadow">
              <h3 className="font-semibold">{job.title}</h3>
              <p>{job.description}</p>
              <p><strong>Budget:</strong> ${job.budget}</p>
              <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyJobs;

*/

import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';
import EditJobModal from '../components/EditJobModal';

const MyJobs = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = async () => {
    const res = await axios.get('/api/jobs/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setJobs(res.data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleClose = async (id) => {
    try {
      const { data } = await axios.patch(`/api/jobs/${id}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistically update local state
      setJobs(prev => prev.map(j => (j._id === id ? data : j)));
    } catch (err) {
      console.error(err);
      alert('Failed to close job');
    }
  };
  

  const handleDelete = async (id) => {
    await axios.delete(`/api/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchJobs();
  };

  const handleDuplicate = async (id) => {
    await axios.post(`/api/jobs/${id}/duplicate`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchJobs();
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs(prev =>
      prev.map(j => (j._id === updatedJob._id ? updatedJob : j))
    );
  };
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Jobs</h2>
      {jobs.map(job => (
        <div key={job._id} className="p-4 border rounded mb-3">
          <h3>{job.title}</h3>
          <p>Status: {job.status}</p>
          <p>Budget: ${job.budget}</p>
          <div className="mt-2 space-x-2">
            <button onClick={() => setEditingJob(job)} className="bg-blue-500 text-white px-2 py-1">Edit</button>
            {job.status !== 'closed' && <button onClick={() => handleClose(job._id)} className="bg-yellow-500 text-white px-2 py-1">Close</button>}
            <button onClick={() => handleDelete(job._id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
            <button onClick={() => handleDuplicate(job._id)} className="bg-gray-500 text-white px-2 py-1">Duplicate</button>
          </div>
        </div>
      ))}

      {editingJob && <EditJobModal job={editingJob} onClose={() => setEditingJob(null)} onJobUpdated={handleJobUpdated}  />}
    </div>
  );
};

export default MyJobs;

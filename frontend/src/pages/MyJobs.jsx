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
/*
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

  const setJobStatus = async (id, status) => {
    try {
      await axios.patch(`/api/jobs/${id}/status`, { status });   // 👈 correct path
      setJobs(prev => prev.map(j => j._id === id ? { ...j, status } : j));
    } catch (e) {
      console.error(e);
      alert('Failed to change status');
    }
  };
  
  const changeStatus = async (job, newStatus) => {
    await axios.patch(`/api/jobs/${job._id}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // update UI immediately
    setJobs(list => list.map(j => j._id === job._id ? { ...j, status: newStatus } : j));
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
            {job.status !== 'closed' && <button onClick={() => setJobStatus(job._id,'closed')} className="bg-yellow-500 text-white px-2 py-1">Close</button>}
            <button onClick={() => handleDelete(job._id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
            <button onClick={() => handleDuplicate(job._id)} className="bg-gray-500 text-white px-2 py-1">Duplicate</button>
            {job.status !== 'active' && (
  <button className="bg-green-600 text-white px-2 py-1 rounded ml-2" onClick={() => setJobStatus(job._id, 'active')}>
    Publish
  </button>
)}
          </div>
        </div>
      ))}
<button onClick={() => changeStatus(job, 'active')}>Publish</button>
<button onClick={() => changeStatus(job, 'closed')}>Close</button>
      {editingJob && <EditJobModal job={editingJob} onClose={() => setEditingJob(null)} onJobUpdated={handleJobUpdated}  />}
    </div>
  );
};

export default MyJobs;
*/

// src/pages/MyJobs.jsx
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';
import EditJobModal from '../components/EditJobModal';

const MyJobs = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);

  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs/me', auth);
      setJobs(res.data);
    } catch (e) {
      console.error(e);
      alert('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchJobs();
  }, [token]); // 👈 depend on token

  // --- Status change (single unified fn) ---
  const setJobStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(`/api/jobs/${id}/status`, { status }, auth); // 👈 /status + headers
      // update UI with server response
      setJobs(prev => prev.map(j => (j._id === id ? data : j)));
    } catch (e) {
      console.error(e);
      alert('Failed to change status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/jobs/${id}`, auth);
      setJobs(prev => prev.filter(j => j._id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete job');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await axios.post(`/api/jobs/${id}/duplicate`, {}, auth);
      fetchJobs();
    } catch (e) {
      console.error(e);
      alert('Failed to duplicate job');
    }
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs(prev => prev.map(j => (j._id === updatedJob._id ? updatedJob : j)));
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map(job => (
          <div key={job._id} className="p-4 border rounded mb-3">
            <h3 className="font-semibold">{job.title}</h3>
            <p>Status: <strong>{job.status}</strong></p>
            <p>Budget: ${job.budget}</p>

            <div className="mt-2 space-x-2">
              <button
                onClick={() => setEditingJob(job)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              {job.status !== 'closed' && (
                <button
                  onClick={() => setJobStatus(job._id, 'closed')}
                  className="bg-yellow-600 text-white px-2 py-1 rounded"
                >
                  Close
                </button>
              )}

              <button
                onClick={() => handleDelete(job._id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => handleDuplicate(job._id)}
                className="bg-gray-600 text-white px-2 py-1 rounded"
              >
                Duplicate
              </button>

              {job.status !== 'active' && (
                <button
                  onClick={() => setJobStatus(job._id, 'active')}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onJobUpdated={handleJobUpdated}
        />
      )}
    </div>
  );
};

export default MyJobs;

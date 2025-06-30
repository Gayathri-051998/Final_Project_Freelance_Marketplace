import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../axios';

const MyJobs = () => {
  const { token } = useContext(AuthContext);
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


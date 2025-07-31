import React, { useEffect, useState } from 'react';
import axios from '../axios';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error('Error fetching jobs:', err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        jobs.map(job => (
          <div key={job._id} className="border p-4 rounded mb-4 shadow">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-gray-700">{job.description}</p>
            <p><strong>Budget:</strong> ₹{job.budget}</p>
            <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
            <p><strong>Client:</strong> {job.client?.name}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default AllJobs;

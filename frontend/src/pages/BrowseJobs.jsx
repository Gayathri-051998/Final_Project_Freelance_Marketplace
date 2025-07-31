import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSearch = async () => {
    const query = new URLSearchParams({
      search: searchTerm,
      minBudget,
      maxBudget,
      deadline
    }).toString();

    const response = await axios.get(`/api/jobs?${query}`);
    setJobs(response.data);
  };

  useEffect(() => {
    handleSearch(); // Load all jobs initially
  }, []);

  return (
    <div>
      <h2>Browse Jobs</h2>

      {/* 🔍 Search & Filters */}
      <div className="filter-section" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Budget"
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Budget"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* 🧾 Job Listings */}

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id}>
              <strong>{job.title}</strong> - {job.budget} ₹<br />
              {job.description}<br />
              Posted by: {job.client?.name || 'N/A'}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrowseJobs;

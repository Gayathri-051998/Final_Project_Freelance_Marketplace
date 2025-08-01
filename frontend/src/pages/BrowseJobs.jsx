import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        minBudget,
        maxBudget,
        deadline,
      }).toString();

     // const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5137';

//const response = await axios.get(`${BASE_URL}/api/jobs?${query}`);
const response = await axios.get(`https://final-project-freelance-marketplace.onrender.com/api/jobs?${query}`);

      console.log('API Response:', response.data); // optional for debugging

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Jobs data is not an array');
      }

      setJobs(response.data);
      setError(''); // clear error if successful
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to fetch jobs');
      setJobs([]); // Reset jobs list
    }
  };

  useEffect(() => {
    handleSearch(); // Load jobs on mount
  }, []);

  return (
    <div>
      <h2>Browse Jobs</h2>

      {/* 🔍 Search & Filter Section */}
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

      {/* 🔁 Job Listings */}
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : jobs.length === 0 ? (
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

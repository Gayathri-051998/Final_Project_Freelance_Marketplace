/*import React, { useEffect, useState } from 'react';
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
const BASE_URL = import.meta.env.VITE_API_URL;

const response = await axios.get(`${BASE_URL}/api/jobs?${query}`);


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


*/

// src/pages/BrowseJobs.jsx
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const PAGE_SIZE = 10;

const BrowseJobs = () => {
  // filters
  const [searchTerm, setSearchTerm] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  // data / ui
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5137';

  const canPrev = page > 1;
  const canNext = page * PAGE_SIZE < total;

  
  const params = useMemo(
    () => ({
      q: searchTerm || undefined,
      minBudget: minBudget || undefined,
      maxBudget: maxBudget || undefined,
      status: 'active',
      page,
      limit: PAGE_SIZE,
    }),
    [searchTerm, minBudget, maxBudget, page]
  );

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${BASE_URL}/api/jobs`, { params });
      // Expecting: { items: [...], total: number }
      if (!data || !Array.isArray(data.items)) {
        throw new Error('Invalid response format from /api/jobs');
      }
      setJobs(data.items);
      setTotal(Number(data.total || 0));
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs');
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // initial + whenever filters/page change
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]); // params memoized above

  // Apply button resets to page 1 then fetches
  const applyFilters = async () => {
    if (page !== 1) setPage(1);
    else fetchJobs();
  };

  // allow Enter key to apply filters
  const onKeyDown = (e) => {
    if (e.key === 'Enter') applyFilters();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search title/desc/tags"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <input
          type="number"
          className="border rounded px-3 py-2"
          placeholder="Min budget"
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <input
          type="number"
          className="border rounded px-3 py-2"
          placeholder="Max budget"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Apply
        </button>
        <div className="flex items-center text-sm text-gray-600 px-1">
          {total > 0 ? `${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, total)} of ${total}` : '—'}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="border rounded p-4 shadow-sm">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <span className="text-sm text-gray-600">
                  Budget: ${Number(job.budget).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{job.description}</p>
              {Array.isArray(job.tags) && job.tags.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="mr-1">Tags:</span>
                  {job.tags.map((t, i) => (
                    <span key={i} className="inline-block mr-2 bg-gray-100 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-sm text-gray-500 mt-2">
                Posted by: {job.client?.name || 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center gap-2 mt-6">
        <button
          disabled={!canPrev}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-3 py-1 rounded border ${canPrev ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'}`}
        >
          Prev
        </button>
        <span className="text-sm">Page {page}</span>
        <button
          disabled={!canNext}
          onClick={() => setPage((p) => p + 1)}
          className={`px-3 py-1 rounded border ${canNext ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BrowseJobs;

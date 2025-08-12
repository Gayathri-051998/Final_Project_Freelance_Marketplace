/*import React, { useEffect, useState } from 'react';
import axios from '../axios';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);

  /*useEffect(() => {
    axios.get('/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error('Error fetching jobs:', err));
  }, []);
  */
 /*
  useEffect(() => {
    const load = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_URL;
        const { data } = await axios.get(`${BASE_URL}/api/jobs`, {
          params: { status: 'active', page: 1, limit: 20 }
        });
  
        // normalize response shape
        const items = Array.isArray(data) ? data
                    : Array.isArray(data?.items) ? data.items
                    : [];
  
        setJobs(items);
        // setTotal(Number(data?.total || items.length));
      } catch (e) {
        console.error('Error fetching jobs:', e);
        setJobs([]); // keep it an array
      }
    };
    load();
  }, []);
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      {jobs.length === 0 ? (
  <p>No jobs available.</p>
) : (
  jobs.map(job => (
    <div key={job._id}>{job.title}</div>
  ))
)}
       : {(
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
*/


// frontend/src/pages/AllJobs.jsx
import React, { useEffect, useState } from 'react';
import axios from '../axios'; // your pre-configured axios instance (baseURL points to backend)

const PAGE_SIZE = 20;

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  // simple filters (optional UI)
  const [searchTerm, setSearchTerm] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [status, setStatus] = useState(''); // '' means "any"

  const fetchJobs = async () => {
    try {
      // build params, only include filters that have a value
      const params = {
        page,
        limit: PAGE_SIZE,
      };
      if (searchTerm) params.q = searchTerm;
      if (minBudget) params.minBudget = minBudget;
      if (maxBudget) params.maxBudget = maxBudget;
      if (status) params.status = status; // don't force "active" by default

      const { data } = await axios.get('/api/jobs', { params });

      // Support either array or { items, total }
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : [];

      setJobs(items);
      setTotal(Array.isArray(data) ? items.length : (data?.total ?? items.length));
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setJobs([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // fetch when page changes

  const applyFilters = () => {
    setPage(1);     // go back to first page
    fetchJobs();    // fetch with current filters
  };

  const canPrev = page > 1;
  const canNext = page * PAGE_SIZE < total;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Jobs</h2>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded"
          placeholder="Min budget"
          value={minBudget}
          onChange={e => setMinBudget(e.target.value)}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded"
          placeholder="Max budget"
          value={maxBudget}
          onChange={e => setMaxBudget(e.target.value)}
        />
        {/*<select
          className="border px-3 py-2 rounded"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
        </select>*/}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={applyFilters}
        >
          Apply
        </button>
      </div>

      {/* List */}
      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job._id} className="border p-4 rounded mb-2 shadow">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-gray-700">{job.description}</p>
              <p className="mt-1">
                <span className="font-medium">Budget:</span> ${job.budget}
              </p>
              {job.client?.name && (
                <p className="text-sm text-gray-600 mt-1">
                  Posted by: {job.client.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center gap-3 mt-4">
        <button
          disabled={!canPrev}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className={`px-3 py-1 rounded border ${canPrev ? 'bg-white' : 'opacity-50 cursor-not-allowed'}`}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={!canNext}
          onClick={() => setPage(p => p + 1)}
          className={`px-3 py-1 rounded border ${canNext ? 'bg-white' : 'opacity-50 cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}


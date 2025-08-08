/*import React from 'react';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SubmitReview = () => {
  const { token, user } = useAuth();
  const [form, setForm] = useState({
    reviewedUser: '',
    rating: '',
    comment: '',
    contract: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://final-project-freelance-marketplace.onrender.com/api/reviews', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Review submitted!');
       // ✅ CLEAR the form after submission
    setForm({
      reviewedUser: '',
      contract: '',
      rating: '',
      comment: ''
    });
    } catch {
      alert('Failed to submit review');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border shadow">
      <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      <input
  type="text"
  name="reviewedUser"
  placeholder="User ID to review"
  value={form.reviewedUser}
  onChange={handleChange}
  required
  className="w-full p-2 border"
/>

<input
  type="text"
  name="contract"
  placeholder="Contract ID"
  value={form.contract}
  onChange={handleChange}
  required
  className="w-full p-2 border"
/>

<input
  type="number"
  name="rating"
  placeholder="Rating (1-5)"
  value={form.rating}
  onChange={handleChange}
  required
  className="w-full p-2 border"
/>

<textarea
  name="comment"
  placeholder="Comment"
  value={form.comment}
  onChange={handleChange}
  className="w-full p-2 border"
/>

        <button className="bg-purple-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default SubmitReview;
*/



import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
const SubmitReview = () => {
  const { token } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

    // ✅ Read contractId from URL query string
    const [searchParams] = useSearchParams();
    const contractIdFromQuery = searchParams.get('contractId');

  useEffect(() => {
    axios.get('/api/contracts/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res  => {
      setContracts(res.data);
      // ✅ If coming from Contracts page with contractId in query, auto-select it
      if (contractIdFromQuery) {
        setSelectedContract(contractIdFromQuery);
      }
    })
    .catch(err => console.error("Failed to fetch contracts", err));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        if (!selectedContract || !token) {
            setMessage('❌ Missing contract or token');
            return;
          }
      await axios.post(`/api/contracts/${selectedContract}/review`, {
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Review submitted');
      setSelectedContract('');
      setRating('');
      setComment('');

    } catch (err) {
      setMessage('❌ Failed to submit review');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Submit a Review</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={selectedContract}
          onChange={(e) => setSelectedContract(e.target.value)}
          className="w-full border px-2 py-1"
        >
          <option value="">Select Contract</option>
          {contracts.map(c => (
            <option key={c._id} value={c._id}>
            {c.job?.title} ({c.client?.name} & {c.freelancer?.name})
          </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border px-2 py-1"
          placeholder="Rating (1-5)"
        />

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border px-2 py-1"
          placeholder="Write your review"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!selectedContract}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default SubmitReview;

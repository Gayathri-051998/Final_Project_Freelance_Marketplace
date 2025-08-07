import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';

const ReviewContract = () => {
  const { token } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/contracts/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setContracts(res.data))
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
      setRating(5);
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

export default ReviewContract;

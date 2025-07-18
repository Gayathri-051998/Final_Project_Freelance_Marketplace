import React from 'react';

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

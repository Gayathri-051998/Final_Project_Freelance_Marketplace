// src/Components/EditJobModal.jsx
import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';

const EditJobModal = ({ job, onClose, onJobUpdated }) => {
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (job) {
      setTitle(job.title || '');
      setDescription(job.description || '');
      setBudget(job.budget ?? '');
      setTags(Array.isArray(job.tags) ? job.tags.join(', ') : '');
    }
  }, [job]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!job?._id) {
      alert('Invalid job id');
      return;
    }

    const payload = {
      title,
      description,
      budget: Number(budget),
      tags: tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    };

    try {
      console.log('PUT', `/api/jobs/${job._id}`, payload);
      const res = await axios.put(
        `/api/jobs/${job._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onJobUpdated?.(res.data);
      onClose();
    } catch (err) {
      console.error('❌ Failed to update job', err);
      alert('Failed to update job');
    }
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Job</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 px-4 py-2 rounded text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 px-4 py-2 rounded text-white"
            >
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;

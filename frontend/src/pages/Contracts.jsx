// src/pages/Contracts.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
const stripePromise = loadStripe("pk_test_51RfKm4Gfpwi1sYyw3Xzq7rP1pVfFIJOdqiZPcBQFiRbRngG1tTGB3UYsjgAp1pxmnEoPHKJQeTBAXKH0rnbm8e9z00Rjir6uO1");

const Contracts = () => {
  const { token, user } = useAuth();
  const notificationContext = useContext(NotificationContext);
  const addNotification = notificationContext?.addNotification || (() => {});
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/contracts/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setContracts(res.data))
      .catch(() => alert('Failed to load contracts'))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!loading && contracts.length > 0) {
      addNotification('✅ Contracts loaded!');
    }
  }, [loading]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/contracts/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContracts(prev =>
        prev.map(c => (c._id === id ? { ...c, status: newStatus } : c))
      );
      addNotification('✅ Contract marked as completed!');
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handlePayment = async (contract) => {
    try {
      const price = contract.job?.budget;

      console.log("🧾 Full contract object:", contract);
      console.log("📦 Job inside contract:", contract.job);
      console.log("💸 Budget from job:", contract.job?.budget);

      if (!contract.job?.budget || isNaN(contract.job.budget)) {
        alert("Invalid payment amount");
        return;
      }

      const response = await axios.post(
        'https://final-project-freelance-marketplace.onrender.com/api/payments/create-checkout-session',
        {
          amount: contract.job.budget,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response?.data?.id) {
        throw new Error("Invalid response from server");
      }
      localStorage.setItem("lastPaidContract", contract._id); // 👈 Add this
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: response.data.id });
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment");
    }
  };

  return (
    <div className="p-6">
  <h2 className="text-xl font-bold mb-4">Contracts</h2>
  {loading ? (
    <p>Loading contracts...</p>
  ) : contracts.length === 0 ? (
    <p>No contracts found.</p>
  ) : (
    contracts.map((c) => (
      <div key={c._id} className="p-4 border rounded mb-4 shadow">
        <h3 className="font-semibold">{c.job?.title}</h3>

        <p>
          Status: <strong>{c.status}</strong>
          {c.isPaid && (
            <span className="ml-3 text-green-600 font-semibold">✅ Paid</span>
          )}
        </p>

        <p>Freelancer: {c.freelancer?.name}</p>
        <p>Client: {c.client?.name}</p>

        {/* ✅ STATUS BUTTONS */}
        <div className="space-x-2 mt-2">
          {['accepted', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => updateStatus(c._id, status)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              {status}
            </button>
          ))}
        </div>

        {/* ✅ SINGLE Review Button */}
        {!c.review?.reviewer && (
          <button
            className="bg-green-600 text-white px-3 py-1 rounded mt-2 mr-2"
            onClick={() => navigate(`/submit-review?contractId=${c._id}`)}
          >
            Review
          </button>
        )}

        {/* ✅ Show review info */}
        {c.review?.reviewer && (
          <p className="text-sm text-gray-600 mt-2">
            ✅ Review submitted: {c.review.rating} ⭐ — {c.review.comment}
          </p>
        )}

        {/* ✅ Pay Now Button */}
        {!c.isPaid && c.client?._id === user._id && (
          <button
            onClick={() => handlePayment(c)}
            className=" space-x-2 mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Pay Now
          </button>
        )}
      </div>
    ))
  )}
</div>
  );
};

export default Contracts;

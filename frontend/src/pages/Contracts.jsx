import React from 'react';
import axios from '../axios';
import { useEffect, useState, useContext } from 'react';

import { AuthContext } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_your_publishable_key');
const Contracts = () => {
  const { token } = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Token being sent:", token);  // ← Add this
    axios
      .get('https://final-project-freelance-marketplace.onrender.com/api/contracts/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      .then((res) => {
        console.log("Contracts:", res.data);
        setContracts(res.data);
      })
      
      .catch(() => alert('Failed to load contracts'))
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`https://final-project-freelance-marketplace.onrender.com/api/contracts/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContracts(prev =>
        prev.map(c => (c._id === id ? { ...c, status: newStatus } : c))
      );
    } 
    catch (err) {
      console.error('Failed to update status:', err.message);
      alert('Failed to update status');
    }
    
  };
  const handlePay = async () => {
    const stripe = await stripePromise;
    const response = await axios.post('/api/payment/create-checkout-session', {
      amount: 50, // e.g., $50
      success_url: window.location.href,
      cancel_url: window.location.href,
    });
  
    await stripe.redirectToCheckout({ sessionId: response.data.id });
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
            <p>Status: <strong>{c.status}</strong></p>
            <p>Freelancer: {c.freelancer?.name}</p>
            <p>Client: {c.client?.name}</p>
            <div className="space-x-2 mt-2">
              {['accepted', 'in_progress', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => updateStatus(c._id, status)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  {status}
                </button>
                
              ))}
            </div>
            <button onClick={handlePay} className="bg-green-600 text-white px-4 py-2 rounded">
  Pay Now
</button>

          </div>
        ))
      )}
    </div>
  );
  
};

export default Contracts;


import React from 'react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";

const PostService = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://final-project-freelance-marketplace.onrender.com/api/services', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Service posted');
      setForm({ title: '', description: '', price: '', category: '' });
    } catch {
      alert('Failed to post service');
    }
  };
  const stripePromise = loadStripe("pk_test_51RfKm4Gfpwi1sYyw3Xzq7rP1pVfFIJOdqiZPcBQFiRbRngG1tTGB3UYsjgAp1pxmnEoPHKJQeTBAXKH0rnbm8e9z00Rjir6uO1"); // Use your own publishable key

  const handlePayment = async () => {
    try {
      const response = await fetch("https://final-project-freelance-marketplace.onrender.com/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Include token here
        },
        body: JSON.stringify({
          amount: form.price * 100,  // Convert to cents
          success_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/payment-cancel`,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Payment session creation failed");
      }
  
      const session = await response.json();
  
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
  
      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error initiating payment");
    }
  };
  
  


  return (
    <div className="max-w-md mx-auto p-6 mt-8 border shadow">
      <h2 className="text-xl font-bold mb-4">Post a Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border" />
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border" />
        <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default PostService;

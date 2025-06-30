import React, { useState, useEffect, useContext } from 'react';
import axios from '../axios'; // ✅ make sure this is your local axios wrapper
import { AuthContext } from '../context/AuthContext';

const MyServices = () => {
  const { token } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ handle loading

  useEffect(() => {
    axios
      .get('/api/services/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setServices(res.data))
      .catch((err) => {
        console.error(err); // ✅ helpful in debugging
        alert('Failed to load services');
      })
      .finally(() => setLoading(false));
  }, [token]);

  // ✅ Show spinner or loading message first
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Services</h2>
      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <ul className="space-y-4">
          {services.map((s) => (
            <li key={s._id} className="p-4 border rounded shadow">
              <h3 className="font-semibold">{s.title}</h3>
              <p>{s.description}</p>
              <p><strong>Price:</strong> ${s.price}</p>
              <p><strong>Category:</strong> {s.category}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyServices;

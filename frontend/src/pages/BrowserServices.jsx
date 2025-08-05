import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BrowseServices = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        minPrice,
        maxPrice,
        t: Date.now(),
      }).toString();

      const response = await axios.get(`/api/services?${query}`);
      console.log("🔍 Filtered response from backend:", response.data);

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Services is not an array');
      }

      setServices(response.data);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to load services');
      setServices([]);
    }
  };

  // Load all services initially (only once)
  useEffect(() => {
    const loadAll = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data);
      } catch (err) {
        console.error('Initial load failed:', err);
        setServices([]);
      }
    };
    loadAll();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Freelance Services</h2>

      <div
        style={{
          marginBottom: '20px',
          border: '2px solid blue',
          padding: '10px',
          position: 'relative',
          zIndex: 1000,
          backgroundColor: 'white',
        }}
      >
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleSearch} style={{ padding: '5px 10px' }}>
          Search
        </button>
      </div>

      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service._id}>
              <strong>{service.title}</strong> - ₹{service.price}
              <br />
              {service.description}
              <br />
              Provided by: {service.freelancer?.name || 'Unknown'}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrowseServices;

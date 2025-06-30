
import React from 'react';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://final-project-freelance-marketplace.onrender.com' // backend URL
});

export default instance;


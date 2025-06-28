import axios from 'axios';

const API_BASE_URL = 'http://luxcycs.com:6600/consultation';

// Consultation APIs
export const submitConsultationForm = (formData) => {
  return axios.post(`${API_BASE_URL}/create-consultation`, formData, {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Uncomment if needed
    }
  });
};

export const getConsultationById = (id) => {
  return axios.get(`${API_BASE_URL}/get-consultation/${id}`);
};

export const getAllConsultations = () => {
  return axios.get(`${API_BASE_URL}/get-all-consultation`);
};

export const updateConsultation = (formData) => {
  return axios.put(`${API_BASE_URL}/update-consultation`, formData, {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Uncomment if needed
    }
  });
};

export const deleteConsultation = (id) => {
  return axios.delete(`${API_BASE_URL}/delete-consultation/${id}`, {
    headers: {
      // 'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Uncomment if needed
    }
  });
};

// Mock login function (replace with actual implementation if needed)
export const login = async (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ token: 'mock-token', user: { name: 'Admin' } }), 500);
  });
};
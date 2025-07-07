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

// export const getConsultationById = (id) => {
//   return axios.get(`${API_BASE_URL}/get-consultation/${id}`);
// };
// export const getClientById = async (id) => {
//   const response = await axios.get(`${API_BASE_URL}/get-consultation/${id}`);
//   if (response.data.success && response.data.data) {
//     return response.data.data;
//   } else {
//     throw new Error('Client not found');
//   }
// };
export const getConsultationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-consultation/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Consultation not found');
    }
  } catch (error) {
    throw error;
  }
};

export const getAllConsultations = (page = 1, limit = 100) => {
  return axios.get(`${API_BASE_URL}/get-all-consultation?page=${page}&limit=${limit}`);
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
export const getClientById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/get-consultation/${id}`);
  if (response.data.success && response.data.data) {
    return response.data.data;
  } else {
    throw new Error('Client not found');
  }
};


export const login = async (credentials) => {
  const { email, password } = credentials;

  const validEmail = 'admin123@gmail.com';
  const validPassword = 'admin123';

  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === validEmail && password === validPassword) {
        resolve({ success: true, token: 'mock-token', user: { name: 'Admin' } });
      } else {
        resolve({ success: false, message: 'Invalid email or password' });
      }
    }, 500);
  });
};


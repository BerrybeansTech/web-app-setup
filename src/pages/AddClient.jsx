import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClientForm from '../components/Clients';
import * as api from '../services/api';
// import '../styles/main.css';

const AddClient = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await api.addClient(formData);
    navigate('/clients');
  };

  return (
    <div className="container">
      <h2>Add New Client</h2>
      <ClientForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddClient;
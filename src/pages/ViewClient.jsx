import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';
// import "../styles/main.css";
import '../styles/form.css';

const ViewClient = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    api.getClientById(id).then(setClient);
  }, [id]);

  if (!client) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>Client Details</h2>
      <div className="form-container">
        <p><strong>Name:</strong> {client.name}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Phone:</strong> {client.phone}</p>
      </div>
    </div>
  );
};

export default ViewClient;
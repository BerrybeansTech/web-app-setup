import React, { useState, useEffect } from 'react';
import FormTable from '../components/FormTable';
import * as api from '../services/api';

const Clients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    api.getClients().then(setClients);
  }, []);

  return (
    <div className="container">
      <h2>Clients</h2>
      <FormTable clients={clients} />
    </div>
  );
};

export default Clients;
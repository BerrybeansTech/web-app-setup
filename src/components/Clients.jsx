import { useEffect, useState } from 'react';

const Clients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await getClients();
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  return (
    <div>
      <h2>Client List</h2>
      {clients.map(client => (
        <div key={client.id}>
          {client.name} - {client.email}
        </div>
      ))}
    </div>
  );
};

export default Clients;

import React from 'react';
import StatsCard from '../components/StatsCard';


const Dashboard = () => {
  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
        <StatsCard title="Total Clients" value="150" />
        <StatsCard title="Appointments Today" value="10" />
        <StatsCard title="Pending Reports" value="5" />
      </div>
    </div>
  );
};

export default Dashboard;
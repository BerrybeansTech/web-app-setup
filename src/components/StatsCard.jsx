import React from 'react';
import '../styles/form.css';

const StatsCard = ({ title, value }) => {
  return (
    <div className="form-container">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default StatsCard;
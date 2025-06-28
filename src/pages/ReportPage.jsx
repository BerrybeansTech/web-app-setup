import React, { useState, useEffect } from 'react';
import Reports from '../components/Reports';
import * as api from '../services/api';

const ReportPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.getAllConsultations()
      .then((response) => {
        console.log('API response:', response.data);
        setReports(response.data.data || []);
      })
      .catch((error) => {
        console.error('Error fetching consultations:', error);
        setReports([]);
      });
  }, []);

  return (
    <div className="container">
      <h2>Reports</h2>
      <Reports reports={reports} />
    </div>
  );
};

export default ReportPage;

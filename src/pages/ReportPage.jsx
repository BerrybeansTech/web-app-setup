import React, { useState, useEffect } from 'react';
import Reports from '../components/Reports';
import * as api from '../services/api';

const ReportPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.getReports().then(setReports);
  }, []);

  return (
    <div className="container">
      <h2>Reports</h2>
      <Reports reports={reports} />
    </div>
  );
};

export default ReportPage;
import React, { useState, useEffect } from 'react';
import Reports from '../components/Reports';
import * as api from '../services/api';

const ReportPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchAllPages();
  }, []);

  const fetchAllPages = async () => {
    try {
      let allData = [];
      let page = 1;
      let totalPages = 100;

      do {
        const response = await api.getAllConsultations(page, 10);
        const { data, pagination } = response.data;

        if (Array.isArray(data)) {
          allData = [...allData, ...data];
        }

        totalPages = pagination?.totalPages || 1;
        page++;
      } while (page <= totalPages);

      console.log('All Data:', allData);
      setReports(allData);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setReports([]);
    }
  };

  return (
    <div className="container">
      <h2>Reports</h2>
      <Reports reports={reports} />
    </div>
  );
};

export default ReportPage;

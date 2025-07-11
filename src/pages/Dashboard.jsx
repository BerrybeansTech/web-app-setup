import React, { useState, useEffect } from 'react';
import { FaUserInjured, FaProcedures, FaCalendarAlt, FaFileMedicalAlt, FaHospitalUser } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { RiHospitalLine } from 'react-icons/ri';
import { getAllConsultations } from '../services/api';
import './Dashboard.css';


const Dashboard = ({ isSidebarCollapsed }) => {
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    procedures: 0,
    revenue: 0
  });
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllConsultations(1, 100);
      const data = response.data?.data || [];
      
      // Sort consultations by date (newest first)
      const sortedData = [...data].sort((a, b) => 
        new Date(b.consultationDate) - new Date(a.consultationDate)
      );
      
      setConsultations(sortedData);
      
      // Calculate stats from consultation data
      setStats({
        patients: data.length,
        appointments: data.filter(c => c.status === 'scheduled').length,
        procedures: data.filter(c => c.procedureType).length,
        revenue: data.reduce((sum, c) => sum + (c.fee || 0), 0)
      });
    } catch (err) {
      console.error('Error fetching reports:', err?.response?.data || err.message || err);
      setError('Failed to load reports. Please try again later.');
      setConsultations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get last 5 consultations (most recent)
  const recentConsultations = consultations.slice(0, 5);

  if (isLoading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Eloraa Cliniq Dashboard</h1>
          <p>Welcome back, Admin</p>
        </div>
        <div className="hospital-logo">
          <RiHospitalLine className="hospital-icon" />
          <span>Eloraa Cliniq</span>
        </div>
      </div>

     {/* // */}

      <div className="dashboard-content">
        <div className="appointments-section">
          <h2>Recent Consultations</h2>
        <div className="appointments-table">
  {recentConsultations.length > 0 ? (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Client ID</th>
          <th>Name</th>
          <th>Date</th>
          <th>Mobile</th>
        </tr>
        
      </thead>
      <tbody>
        {recentConsultations.map((consultation) => (
<tr key={consultation.id || Math.random()}>
  <td>{consultation.id}</td>
  <td>{consultation.clientId || '-'}</td>
  <td>{consultation.name || '-'}</td>
  <td>{formatDate(consultation.date)}</td>
  <td>{consultation.mobile || '-'}</td>
</tr>


          
        ))}
      </tbody>
    </table>
  ) : (
    <div className="no-data">No consultation data available</div>
  )}
</div>

        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">
              <FaHospitalUser />
              <span>Add Patient</span>
            </button>
            <button className="action-btn">
              <FaFileMedicalAlt />
              <span>New Consultation</span>
            </button>
            <button className="action-btn">
              <FaCalendarAlt />
              <span>Schedule</span>
            </button>
            <button className="action-btn">
              <FaProcedures />
              <span>Procedures</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, color }) => {
  return (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        <p className="stat-change">{change}</p>
      </div>
    </div>
  );
};

export default Dashboard;
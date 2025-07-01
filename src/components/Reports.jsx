import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { getAllConsultations } from '../services/api';
import './Reports.css';
import Logo from '../assets/images/logo.png'; 

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllConsultations(1, 100);
      const data = response.data?.data || [];
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again later.');
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const joinDate = report.date ? new Date(report.date) : null;
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const dateFilterPassed = () => {
      if (!fromDate && !toDate) return true;
      if (!joinDate || isNaN(joinDate)) return false;
      if (from && to) return joinDate >= from && joinDate <= to;
      if (from) return joinDate >= from;
      if (to) return joinDate <= to;
      return true;
    };

    const nameFilterPassed = () => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        (report.name?.toLowerCase().includes(search)) ||
        (report.email?.toLowerCase().includes(search)) ||
        (report.mobile?.toString().includes(search)) ||
        (report.clientId?.toString().toLowerCase().includes(search))
      );
    };

    return dateFilterPassed() && nameFilterPassed();
  });

  const clearAllFilters = () => {
    setFromDate('');
    setToDate('');
    setSearchTerm('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date) ? '-' : date.toLocaleDateString('en-IN');
  };

  const formatConcerns = (concerns) => {
    if (!concerns) return '-';
    return concerns.split(',').map(item => {
      const formatted = item.replace(/([A-Z])/g, ' $1').toLowerCase();
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }).join(', ');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
      <head>
        <title>Consultation Reports</title>
        <style>
          body { font-family: 'Poppins', sans-serif; padding: 30px; line-height: 1.6; color: #333; }
          .print-container { max-width: 900px; margin: 0 auto; border: 1px solid rgba(0,0,0,0.1); padding: 20px; border-radius: 8px; }
          .print-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F36886; padding-bottom: 15px; margin-bottom: 20px; }
          .logo { width: 220px; height: auto; }
          .clinic-details { text-align: right; font-size: 14px; color: #555; line-height: 1.4; }
          .clinic-details i { color: #F36886; margin-right: 5px; }
          .sheet-title { text-align: center; font-size: 20px; color: #F36886; font-weight: 700; margin: 20px 0; border-bottom: 2px solid #F36886; display: inline-block; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid rgba(0, 0, 0, 0.1); padding: 10px; text-align: left; }
          th { background: #F9F9F9; font-weight: 600; }
          .section-title { font-size: 16px; color: #F36886; margin: 20px 0 10px; font-weight: 600; }
          .print-meta { font-size: 14px; color: #555; margin-bottom: 20px; text-align: center; }
          .client-section { margin-bottom: 30px; page-break-inside: avoid; }
          hr { border: 0; border-top: 1px solid rgba(0,0,0,0.1); margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <img src="${Logo}" alt="Logo" class="logo">
            <div class="clinic-details">
              <div><i class="fas fa-map-marker-alt"></i> 110, Arcot Road, Opposite Jains Swarnokamol Apartments, Saligramam, Chennai - 600093</div>
              <div><i class="fas fa-phone"></i> +91 76049 89898 | +91 44 4215 9898</div>
            </div>
          </div>
          <div class="sheet-title">CONSULTATION REPORTS</div>
          <div class="print-meta">
            Generated on: ${new Date().toLocaleString('en-IN')}<br>
            ${fromDate || toDate ? `Date Range: ${fromDate || 'Start'} to ${toDate || 'End'}<br>` : ''}
            ${searchTerm ? `Search Filter: "${searchTerm}"<br>` : ''}
            Total Records: ${filteredReports.length}
          </div>
          ${filteredReports.map(report => `
            <div class="client-section">
              <div class="section-title">Client: ${report.name || 'N/A'} (ID: ${report.id || 'N/A'})</div>
              <table>
                <tr><th>Client ID</th><td>${report.id || 'N/A'}</td></tr>
                <tr><th>Name</th><td>${report.name || 'N/A'}</td></tr>
                <tr><th>Age</th><td>${report.age || 'N/A'}</td></tr>
                <tr><th>Mobile</th><td>${report.mobile || 'N/A'}</td></tr>
                <tr><th>Email</th><td>${report.email || 'N/A'}</td></tr>
                <tr><th>Consultation Date</th><td>${formatDate(report.date)}</td></tr>
                <tr><th>Consulting Doctor</th><td>${report.consultingDoctor || 'N/A'}</td></tr>
                <tr><th>Status</th><td>${report.status || 'N/A'}</td></tr>
              </table>
            </div>
            <hr>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleDownload = () => {
    const data = filteredReports.map((report) => ({
      'ID': report.id || '',
      'Name': report.name || '',
      'Age': report.age || '',
      'Mobile': report.mobile || '',
      'Consultation Date': formatDate(report.date),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Consultation Reports');
    XLSX.writeFile(wb, `Consultation_Reports_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="reports-container loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i> Loading reports...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-container error">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
          <button onClick={fetchReports} className="retry-button">
            <i className="fas fa-sync-alt"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div>
          <h2>Consultation Reports</h2>
          <p className="report-count">
            Showing {filteredReports.length} of {reports.length} records
            {(fromDate || toDate || searchTerm) && ' (filtered)'}
          </p>
        </div>
        <div className="action-buttons">
          <button className="print-button" onClick={handlePrint} disabled={filteredReports.length === 0}>
            <i className="fas fa-print"></i> <span className="button-text">Print</span>
          </button>
          <button className="download-button" onClick={handleDownload} disabled={filteredReports.length === 0}>
            <i className="fas fa-download"></i> <span className="button-text">Export</span>
          </button>
        </div>
      </div>

      <div className="filter-section">
        <div className="search-filter">
          <div className="search-input-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search by name, email, phone or client ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search-button" onClick={() => setSearchTerm('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        <div className="date-filter">
          <div className="date-input-group">
            <label>
              From:
              <input 
                type="date" 
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)} 
                max={toDate || undefined} 
              />
            </label>
          </div>
          <div className="date-input-group">
            <label>
              To:
              <input 
                type="date" 
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)} 
                min={fromDate || undefined} 
              />
            </label>
          </div>
          {(fromDate || toDate || searchTerm) && (
            <button className="clear-filter-button" onClick={clearAllFilters}>
              <i className="fas fa-filter-circle-xmark"></i> <span className="button-text">Clear All</span>
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th className="client-id-column">Client ID</th>
              <th className="name-column">Name</th>
              <th className="doctor-column">Doctor</th>
              <th className="date-column">Consultation Date</th>
              <th className="concerns-column">Main Concerns</th>
              <th className="email-column">Email</th>
              <th className="phone-column">Mobile</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id || '-'}</td>
                  <td>{report.name || '-'}</td>
                  <td>{report.consultingDoctor || '-'}</td>
                  <td>{formatDate(report.date)}</td>
                  <td>{formatConcerns(report.concerns)}</td>
                  <td>{report.email || '-'}</td>
                  <td>{report.mobile || '-'}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => navigate(`/view-client/${report.id}`)}
                      title="View Details"
                      className="view-button"
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-records">
                  <div className="no-records-content">
                    <i className="fas fa-search"></i>
                    <p>No matching records found</p>
                    {(fromDate || toDate || searchTerm) && (
                      <button onClick={clearAllFilters} className="clear-filter-button">
                        <i className="fas fa-filter-circle-xmark"></i> Clear All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
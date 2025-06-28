import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './Reports.css';

const Reports = ({ reports = [], onEdit, onDelete, onView }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(report => {
    // Date filtering
    const dateFilterPassed = () => {
      if (!fromDate && !toDate) return true;
      
      const joinDate = new Date(report.joinDate);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      
      if (from && to) {
        return joinDate >= from && joinDate <= to;
      } else if (from) {
        return joinDate >= from;
      } else if (to) {
        return joinDate <= to;
      }
      return true;
    };

    // Name search filtering
    const nameFilterPassed = () => {
      if (!searchTerm) return true;
      return (
        report.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    return dateFilterPassed() && nameFilterPassed();
  });

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Client Reports</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 20px;
              color: #333;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 15px;
              font-size: 12px;
            }
            th, td { 
              padding: 8px 10px; 
              border: 1px solid #ddd; 
              text-align: left; 
            }
            th { 
              background-color: #f5f5f5 !important; 
              font-weight: 600;
            }
            .status-badge { 
              padding: 3px 8px; 
              border-radius: 12px; 
              font-size: 11px; 
              display: inline-block;
              font-weight: 500;
            }
            .active { background-color: #e6f7e6; color: #2e7d32; }
            .inactive { background-color: #ffebee; color: #c62828; }
            .pending { background-color: #fff8e1; color: #f57f17; }
            h2 { 
              color: #333; 
              margin: 0 0 5px 0;
              font-size: 18px;
            }
            .print-header { 
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #eee;
            }
            .print-date { 
              font-size: 12px; 
              color: #666;
              margin: 2px 0;
            }
            .print-footer {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px solid #eee;
              font-size: 11px;
              color: #999;
              text-align: right;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>Client Reports</h2>
            <div class="print-date">Generated on: ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}</div>
            ${fromDate || toDate ? 
              `<div class="print-date">Date range: ${fromDate || 'Start'} to ${toDate || 'End'}</div>` : ''}
            ${searchTerm ? `<div class="print-date">Search filter: "${searchTerm}"</div>` : ''}
            <div class="print-date">Total records: ${filteredReports.length}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Join Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredReports.map(report => `
                <tr>
                  <td>${report.name || '-'}</td>
                  <td>${report.age || '-'}</td>
                  <td>${report.gender || '-'}</td>
                  <td>${report.dob ? new Date(report.dob).toLocaleDateString() : '-'}</td>
                  <td>${report.email || '-'}</td>
                  <td>${report.phone || '-'}</td>
                  <td>${report.joinDate ? new Date(report.joinDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <span class="status-badge ${(report.status || '').toLowerCase()}">
                      ${report.status || '-'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="print-footer">
            Generated by Clinic Management System
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
    const data = filteredReports.map(report => ({
      Name: report.name,
      Age: report.age,
      Gender: report.gender,
      DOB: report.dob ? new Date(report.dob).toLocaleDateString() : '',
      Email: report.email,
      Phone: report.phone,
      Address: report.address,
      'Join Date': report.joinDate ? new Date(report.joinDate).toLocaleDateString() : '',
      Status: report.status,
      'Admin Name': report.admin
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Client Reports");
    
    // Auto-size columns
    const wscols = [
      {wch: 20}, 
      {wch: 5},  // Age
      {wch: 8},  // Gender
      {wch: 12}, // DOB
      {wch: 25}, // Email
      {wch: 15}, // Phone
      {wch: 12}, // Join Date
      {wch: 10}, // Status
      {wch: 20}  // Admin Name
    ];
    ws['!cols'] = wscols;
    
    const fileName = `Client_Reports_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const clearAllFilters = () => {
    setFromDate('');
    setToDate('');
    setSearchTerm('');
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div>
          <h2>Client Reports</h2>
          <p className="report-count">{filteredReports.length} of {reports.length} records</p>
        </div>
        <div className="action-buttons">
          <button className="print-button" onClick={handlePrint}>
            <i className="fas fa-print"></i> <span className="button-text">Print</span>
          </button>
          <button className="download-button" onClick={handleDownload}>
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
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search-button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
        <div className="date-filter">
          <div className="date-input-group">
            <label htmlFor="fromDate">From:</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate || undefined}
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="toDate">To:</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate || undefined}
            />
          </div>
          {(fromDate || toDate || searchTerm) && (
            <button 
              className="clear-filter-button"
              onClick={clearAllFilters}
            >
              <i className="fas fa-filter-circle-xmark"></i> Clear All
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th className="name-column">Name</th>
              <th className="age-column">Age</th>
              <th className="gender-column">Gender</th>
              <th className="dob-column">DOB</th>
              <th className="email-column">Email</th>
              <th className="phone-column">Phone</th>
              <th className="join-date-column">Join Date</th>
              <th className="status-column">Status</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.id}>
                  <td className="name-column">{report.name || '-'}</td>
                  <td className="age-column">{report.age || '-'}</td>
                  <td className="gender-column">{report.gender || '-'}</td>
                  <td className="dob-column">
                    {report.dob ? new Date(report.dob).toLocaleDateString() : '-'}
                  </td>
                  <td className="email-column">
                    <a href={`mailto:${report.email}`} className="email-link">
                      {report.email || '-'}
                    </a>
                  </td>
                  <td className="phone-column">
                    {report.phone ? (
                      <a href={`tel:${report.phone}`} className="phone-link">
                        {report.phone}
                      </a>
                    ) : '-'}
                  </td>
                  <td className="join-date-column">
                    {report.joinDate ? new Date(report.joinDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="status-column">
                    <span className={`status-badge ${(report.status || '').toLowerCase()}`}>
                      {report.status || '-'}
                    </span>
                  </td>
                  <td className="actions-cell actions-column">
                    <button 
                      className="action-button view-button"
                      onClick={() => onView(report)}
                      title="View Details"
                      aria-label="View details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="action-button edit-button"
                      onClick={() => onEdit(report)}
                      title="Edit"
                      aria-label="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-button delete-button"
                      onClick={() => onDelete(report.id)}
                      title="Delete"
                      aria-label="Delete"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-records">
                  <div className="no-records-content">
                    <i className="fas fa-search"></i>
                    <p>No matching records found</p>
                    {(fromDate || toDate || searchTerm) && (
                      <button 
                        className="clear-filter-button"
                        onClick={clearAllFilters}
                      >
                        Clear all filters
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
// complete
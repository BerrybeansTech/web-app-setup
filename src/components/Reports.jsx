import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { getAllConsultations } from '../services/api'; // Import the API function
import './Reports.css';

const Reports = ({ onEdit, onDelete, onView }) => {
  const [reports, setReports] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);


  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const response = await getAllConsultations();
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


  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
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
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
          th { background: #f5f5f5; }
          .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .active { background: #e6f7e6; color: #2e7d32; }
          .inactive { background: #ffebee; color: #c62828; }
          .print-title { margin-bottom: 10px; font-size: 18px; font-weight: bold; }
          .print-meta { margin-bottom: 15px; font-size: 12px; color: #666; }
          .detail-row { background: #f9f9f9; }
          .detail-label { font-weight: bold; width: 30%; }
        </style>
      </head>
      <body>
        <div class="print-title">Consultation Reports</div>
        <div class="print-meta">
          Generated on: ${new Date().toLocaleString('en-IN')}<br>
          ${fromDate || toDate ? `Date Range: ${fromDate || 'Start'} to ${toDate || 'End'}<br>` : ''}
          ${searchTerm ? `Search Filter: "${searchTerm}"<br>` : ''}
          Total Records: ${filteredReports.length}
        </div>
        ${filteredReports.map(report => `
          <h3>Client: ${report.name || '-'} (${report.clientId || '-'})</h3>
          <table>
            <tr>
              <td class="detail-label">Consultation Date:</td>
              <td>${formatDate(report.date)}</td>
              <td class="detail-label">Doctor:</td>
              <td>${report.consultingDoctor || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">Age/Gender:</td>
              <td>${report.age || '-'}/${report.sex || '-'}</td>
              <td class="detail-label">Marital Status:</td>
              <td>${report.maritalStatus || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">DOB:</td>
              <td>${formatDate(report.dob)}</td>
              <td class="detail-label">Profession:</td>
              <td>${report.profession || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">Contact:</td>
              <td>${report.mobile || '-'}</td>
              <td class="detail-label">Email:</td>
              <td>${report.email || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">Address:</td>
              <td colspan="3">${report.address || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">Health Metrics:</td>
              <td>Height: ${report.height || '-'} cm</td>
              <td>Weight: ${report.weight || '-'} kg</td>
              <td>BMI: ${report.bmi || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">Main Concerns:</td>
              <td colspan="3">${formatConcerns(report.concerns)}</td>
            </tr>
            <tr>
              <td class="detail-label">Other Issues:</td>
              <td colspan="3">${report.otherIssue || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">Current Medications:</td>
              <td colspan="3">${report.medications || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">General Health:</td>
              <td colspan="3">${report.generalHealth || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">Allergies:</td>
              <td colspan="3">${report.allergies || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">Lifestyle:</td>
              <td colspan="3">
                ${report.lifestyleSmoke ? `Smokes: ${report.smokeQty || ''} (${report.smokeYears || ''})` : 'Non-smoker'} | 
                ${report.lifestyleAlcohol ? `Alcohol: ${report.alcoholQty || ''} (${report.alcoholFreq || ''})` : 'No alcohol'} | 
                Stress: ${report.stressLevel || '-'}/10
              </td>
            </tr>
            <tr>
              <td class="detail-label">Diet & Exercise:</td>
              <td colspan="3">
                Diet: ${report.dietType || '-'} ${report.strictDiet ? '(Strict)' : ''} | 
                Exercise: ${report.exercise ? 'Yes' : 'No'} | 
                Sun Exposure: ${report.sunlightExposure || '-'}
              </td>
            </tr>
            <tr>
              <td class="detail-label">Skincare Routine:</td>
              <td colspan="3">${report.skincareRoutine ? report.skincareRoutine.split(',').join(', ') : '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">How They Know Us:</td>
              <td colspan="3">${report.howKnow || '-'} ${report.referenceName ? `(Ref: ${report.referenceName})` : ''}</td>
            </tr>
            <tr>
              <td class="detail-label">Other Source:</td>
              <td colspan="3">${report.otherSource || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">Photo Release:</td>
              <td colspan="3">${report.photoRelease ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td class="detail-label">Client Signature:</td>
              <td colspan="3">${report.clientSignature ? 'Signed' : 'Not Signed'}</td>
            </tr>
            <tr>
              <td class="detail-label">Notes:</td>
              <td colspan="3">${report.notes || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">Remarks:</td>
              <td colspan="3">${report.remarks || '-'}</td>
            </tr>
            <tr>
              <td class="detail-label">Status:</td>
              <td colspan="3">
                <span class="status-badge ${report.status?.toLowerCase() || ''}">
                  ${report.status || '-'}
                </span>
              </td>
            </tr>
          </table>
          <hr style="margin: 20px 0;">
        `).join('')}
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
      'Client ID': report.clientId || '',
      'Name': report.name || '',
      'Consultation Date': formatDate(report.date),
      'Doctor': report.consultingDoctor || '',
      'Age': report.age || '',
      'Gender': report.sex || '',
      'DOB': formatDate(report.dob),
      'Marital Status': report.maritalStatus || '',
      'Height (cm)': report.height || '',
      'Weight (kg)': report.weight || '',
      'BMI': report.bmi || '',
      'Profession': report.profession || '',
      'Mobile': report.mobile || '',
      'Email': report.email || '',
      'Address': report.address || '',
      'Main Concerns': formatConcerns(report.concerns),
      'Other Issues': report.otherIssue || '',
      'Current Medications': report.medications || '',
      'General Health': report.generalHealth || '',
      'Allergies': report.allergies || '',
      'Smoking': report.lifestyleSmoke ? `Yes (${report.smokeQty || ''}, ${report.smokeYears || ''})` : 'No',
      'Alcohol': report.lifestyleAlcohol ? `Yes (${report.alcoholQty || ''}, ${report.alcoholFreq || ''})` : 'No',
      'Stress Level': report.stressLevel ? `${report.stressLevel}/10` : '',
      'Sun Exposure': report.sunlightExposure || '',
      'Exercise': report.exercise ? 'Yes' : 'No',
      'Strict Diet': report.strictDiet ? 'Yes' : 'No',
      'Skincare Routine': report.skincareRoutine ? report.skincareRoutine.split(',').join(', ') : '',
      'Diet Type': report.dietType || '',
      'How Know Us': report.howKnow || '',
      'Reference Name': report.referenceName || '',
      'Other Source': report.otherSource || '',
      'Photo Release': report.photoRelease ? 'Yes' : 'No',
      'Client Signature': report.clientSignature ? 'Signed' : 'Not Signed',
      'Notes': report.notes || '',
      'Status': report.status || '',
      'Remarks': report.remarks || ''
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
              <th className="status-column">Status</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <React.Fragment key={report._id || report.clientId}>
                  <tr onClick={() => toggleRowExpand(report._id || report.clientId)} className="main-row">
                    <td>{report.clientId || '-'}</td>
                    <td>{report.name || '-'}</td>
                    <td>{report.consultingDoctor || '-'}</td>
                    <td>{formatDate(report.date)}</td>
                    <td>{formatConcerns(report.concerns)}</td>
                    <td>{report.email || '-'}</td>
                    <td>{report.mobile || '-'}</td>
                    <td>
                      <span className={`status-badge ${report.status?.toLowerCase() || ''}`}>
                        {report.status || '-'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onView && onView(report);
                        }} 
                        title="View" 
                        className="action-button view-button"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit && onEdit(report);
                        }} 
                        title="Edit" 
                        className="action-button edit-button"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete && onDelete(report._id || report.clientId);
                        }} 
                        title="Delete" 
                        className="action-button delete-button"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                  {expandedRow === (report._id || report.clientId) && (
                    <tr className="detail-row">
                      <td colSpan="9">
                        <div className="detail-container">
                          <div className="detail-section">
                            <h4>Personal Information</h4>
                            <div className="detail-grid">
                              <div>
                                <label>Age/Gender:</label>
                                <span>{report.age || '-'}/{report.sex || '-'}</span>
                              </div>
                              <div>
                                <label>DOB:</label>
                                <span>{formatDate(report.dob)}</span>
                              </div>
                              <div>
                                <label>Marital Status:</label>
                                <span>{report.maritalStatus || '-'}</span>
                              </div>
                              <div>
                                <label>Profession:</label>
                                <span>{report.profession || '-'}</span>
                              </div>
                              <div>
                                <label>Height/Weight:</label>
                                <span>{report.height || '-'} cm / {report.weight || '-'} kg</span>
                              </div>
                              <div>
                                <label>BMI:</label>
                                <span>{report.bmi || '-'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="detail-section">
                            <h4>Contact Information</h4>
                            <div className="detail-grid">
                              <div>
                                <label>Mobile:</label>
                                <span>
                                  {report.mobile ? (
                                    <a href={`tel:${report.mobile}`} className="phone-link">
                                      {report.mobile}
                                    </a>
                                  ) : '-'}
                                </span>
                              </div>
                              <div>
                                <label>Email:</label>
                                <span>
                                  {report.email ? (
                                    <a href={`mailto:${report.email}`} className="email-link">
                                      {report.email}
                                    </a>
                                  ) : '-'}
                                </span>
                              </div>
                              <div className="full-width">
                                <label>Address:</label>
                                <span>{report.address || '-'}</span>
                              </div>
                              <div>
                                <label>How Know Us:</label>
                                <span>
                                  {report.howKnow || '-'}
                                  {report.referenceName && ` (${report.referenceName})`}
                                </span>
                              </div>
                              <div>
                                <label>Other Source:</label>
                                <span>{report.otherSource || '-'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="detail-section">
                            <h4>Health Information</h4>
                            <div className="detail-grid">
                              <div className="full-width">
                                <label>Main Concerns:</label>
                                <span>{formatConcerns(report.concerns)}</span>
                              </div>
                              <div className="full-width">
                                <label>Other Issues:</label>
                                <span>{report.otherIssue || '-'}</span>
                              </div>
                              <div className="full-width">
                                <label>Current Medications:</label>
                                <span>{report.medications || '-'}</span>
                              </div>
                              <div>
                                <label>General Health:</label>
                                <span>{report.generalHealth || '-'}</span>
                              </div>
                              <div>
                                <label>Allergies:</label>
                                <span>{report.allergies || '-'}</span>
                              </div>
                              <div>
                                <label>Medications Health:</label>
                                <span>{report.medicationsHealth || '-'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="detail-section">
                            <h4>Lifestyle</h4>
                            <div className="detail-grid">
                              <div>
                                <label>Smoking:</label>
                                <span>
                                  {report.lifestyleSmoke 
                                    ? `Yes (${report.smokeQty || ''}, ${report.smokeYears || ''})` 
                                    : 'No'}
                                </span>
                              </div>
                              <div>
                                <label>Alcohol:</label>
                                <span>
                                  {report.lifestyleAlcohol 
                                    ? `Yes (${report.alcoholQty || ''}, ${report.alcoholFreq || ''})` 
                                    : 'No'}
                                </span>
                              </div>
                              <div>
                                <label>Stress Level:</label>
                                <span>{report.stressLevel ? `${report.stressLevel}/10` : '-'}</span>
                              </div>
                              <div>
                                <label>Sun Exposure:</label>
                                <span>{report.sunlightExposure || '-'}</span>
                              </div>
                              <div>
                                <label>Exercise:</label>
                                <span>{report.exercise ? 'Yes' : 'No'}</span>
                              </div>
                              <div>
                                <label>Strict Diet:</label>
                                <span>{report.strictDiet ? 'Yes' : 'No'}</span>
                              </div>
                              <div>
                                <label>Diet Type:</label>
                                <span>{report.dietType || '-'}</span>
                              </div>
                              <div className="full-width">
                                <label>Skincare Routine:</label>
                                <span>
                                  {report.skincareRoutine 
                                    ? report.skincareRoutine.split(',').join(', ') 
                                    : '-'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="detail-section">
                            <h4>Additional Information</h4>
                            <div className="detail-grid">
                              <div>
                                <label>Photo Release:</label>
                                <span>{report.photoRelease ? 'Yes' : 'No'}</span>
                              </div>
                              <div>
                                <label>Client Signature:</label>
                                <span>{report.clientSignature ? 'Signed' : 'Not Signed'}</span>
                              </div>
                              <div className="full-width">
                                <label>Notes:</label>
                                <span>{report.notes || '-'}</span>
                              </div>
                              <div className="full-width">
                                <label>Remarks:</label>
                                <span>{report.remarks || '-'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-records">
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

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import * as api from '../services/api';
import '../pages/ViewClient.css';
import Logo from '../assets/images/logo.png';


const ViewClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getClientById(id)
        .then(res => {
          setClient(res);
          setFormData(res);
          setError('');
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching client:', err);
          setError('Client not found');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = () => {
    api.updateConsultation(formData)
      .then(() => {
        setClient(formData);
        setEditMode(false);
        setSuccessMessage('Client details updated successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(err => {
        console.error('Error updating client:', err);
        setError('Failed to update client details.');
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-IN');
  };

  const formatConcerns = (concerns) => {
    if (!concerns) return 'N/A';
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
      <title>Client Details - ${formData.name || 'N/A'}</title>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          padding: 30px;
          line-height: 1.6;
          color: #333333;
        }
        .print-container {
          max-width: 900px;
          margin: 0 auto;
          border: 1px solid rgba(0,0,0,0.1);
          padding: 20px;
          border-radius: 8px;
        }
        .print-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #F36886;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .logo {
          width: 220px;
          height: auto;
        }
        .clinic-details {
          text-align: right;
          font-size: 14px;
          color: #555555;
          line-height: 1.4;
        }
        .clinic-details i {
          color: #F36886;
          margin-right: 5px;
        }
        .sheet-title {
          text-align: center;
          font-size: 20px;
          color: #F36886;
          font-weight: 700;
          margin: 20px 0;
          border-bottom: 2px solid #F36886;
          display: inline-block;
          padding-bottom: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 10px;
          text-align: left;
        }
        th {
          background: #F9F9F9;
          font-weight: 600;
        }
        .section-title {
          font-size: 16px;
          color: #F36886;
          margin: 20px 0 10px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        <div class="print-header">
          <img src="${Logo}" alt="Logo" class="logo">
          <div class="clinic-details" style="text-align: center;">
            <div><i class="fas fa-map-marker-alt"></i> 110, Arcot Road, Opposite Jains Swarnokamol Apartments, Saligramam, Chennai - 600093</div>
            <div><i class="fas fa-phone"></i> +91 76049 89898 | +91 44 4215 9898</div>
          </div>
        </div>

        <div class="sheet-title">CONSULTATION SHEET</div>

        <div class="section-title">Personal Information</div>
        <table>
          <tr><th>Name</th><td>${formData.name || 'N/A'}</td></tr>
          <tr><th>Client ID</th><td>${formData.clientId || 'N/A'}</td></tr>
          <tr><th>Age</th><td>${formData.age || 'N/A'}</td></tr>
          <tr><th>Sex</th><td>${formData.sex || 'N/A'}</td></tr>
          <tr><th>DOB</th><td>${formatDate(formData.dob)}</td></tr>
        </table>

<div class="section-title">Contact Information</div>
          <table>
            <tr><th>Mobile</th><td>${formData.mobile || 'N/A'}</td></tr>
            <tr><th>Email</th><td>${formData.email || 'N/A'}</td></tr>
            <tr><th>Address</th><td>${formData.address || 'N/A'}</td></tr>
            <tr><th>How They Know Us</th><td>${formData.howKnow || 'N/A'} ${formData.referenceName ? `(Ref: ${formData.referenceName})` : ''}</td></tr>
            <tr><th>Other Source</th><td>${formData.otherSource || 'N/A'}</td></tr>
          </table>

          <div class="section-title">Health Information</div>
          <table>
            <tr><th>Main Concerns</th><td>${formatConcerns(formData.concerns)}</td></tr>
            <tr><th>Other Issues</th><td>${formData.otherIssue || 'N/A'}</td></tr>
            <tr><th>Medications</th><td>${formData.medications || 'N/A'}</td></tr>
            <tr><th>General Health</th><td>${formData.generalHealth || 'N/A'}</td></tr>
            <tr><th>Allergies</th><td>${formData.allergies || 'N/A'}</td></tr>
            <tr><th>Medications Health</th><td>${formData.medicationsHealth || 'N/A'}</td></tr>
          </table>

          <div class="section-title">Lifestyle Information</div>
          <table>
            <tr><th>Smoking</th><td class="boolean-field">${formData.lifestyleSmoke ? `Yes (${formData.smokeQty || 'N/A'}, ${formData.smokeYears || 'N/A'})` : 'No'}</td></tr>
            <tr><th>Alcohol</th><td class="boolean-field">${formData.lifestyleAlcohol ? `Yes (${formData.alcoholQty || 'N/A'}, ${formData.alcoholFreq || 'N/A'})` : 'No'}</td></tr>
            <tr><th>Stress Level</th><td>${formData.stressLevel ? `${formData.stressLevel}/10` : 'N/A'}</td></tr>
            <tr><th>Sunlight Exposure</th><td>${formData.sunlightExposure || 'N/A'}</td></tr>
            <tr><th>Exercise</th><td class="boolean-field">${formData.exercise ? 'Yes' : 'No'}</td></tr>
            <tr><th>Strict Diet</th><td class="boolean-field">${formData.strictDiet ? 'Yes' : 'No'}</td></tr>
            <tr><th>Diet Type</th><td>${formData.dietType || 'N/A'}</td></tr>
            <tr><th>Skincare Routine</th><td>${formData.skincareRoutine ? formData.skincareRoutine.split(',').join(', ') : 'N/A'}</td></tr>
          </table>

          <div class="section-title">Additional Information</div>
          <table>
            <tr><th>Photo Release</th><td class="boolean-field">${formData.photoRelease ? 'Yes' : 'No'}</td></tr>
            <tr><th>Client Signature</th><td class="boolean-field">${formData.clientSignature ? 'Signed' : 'Not Signed'}</td></tr>
            <tr><th>Notes</th><td>${formData.notes || 'N/A'}</td></tr>
            <tr><th>Remarks</th><td>${formData.remarks || 'N/A'}</td></tr>
            <tr><th>Status</th><td>${formData.status || 'N/A'}</td></tr>
          </table>
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
    const data = [{
      'ID': formData.id || '',
      // 'Consulting Doctor': formData.consultingDoctor || '',
      'Consultation Date': formatDate(formData.date),
      'Client ID': twistStr(formData.clientId) || '',
      'Name': formData.name || '',
      'Age': formData.age || '',
      'DOB': formatDate(formData.dob),
      'Gender': formData.sex || '',
      'Marital Status': formData.maritalStatus || '',
      'Height (cm)': formData.height || '',
      'Weight (kg)': formData.weight || '',
      'BMI': formData.bmi || '',
      'Profession': formData.profession || '',
      'Mobile': formData.mobile || '',
      'Email': formData.email || '',
      'Address': formData.address || '',
      'How They Know Us': formData.howKnow ? `${formData.howKnow}${formData.referenceName ? ` (Ref: ${formData.referenceName})` : ''}` : '',
      'Other Source': formData.otherSource || '',
      'Main Concerns': formatConcerns(formData.concerns),
      'Other Issues': formData.otherIssue || '',
      'Medications': formData.medications || '',
      'General Health': formData.generalHealth || '',
      'Allergies': formData.allergies || '',
      'Smoking': formData.lifestyleSmoke ? `Yes (${formData.smokeQty || ''}, ${formData.smokeYears || ''})` : 'No',
      'Alcohol': formData.lifestyleAlcohol ? `Yes (${formData.alcoholQty || ''}, ${formData.alcoholFreq || ''})` : 'No',
      'Stress Level': formData.stressLevel ? `${formData.stressLevel}/10` : '',
      'Sun Exposure': formData.sunlightExposure || '',
      'Exercise': formData.exercise ? 'Yes' : 'No',
      'Strict Diet': formData.strictDiet ? 'Yes' : 'No',
      'Skincare Routine': formData.skincareRoutine ? formData.skincareRoutine.split(',').join(', ') : '',
      'Diet Type': formData.dietType || '',
      'Photo Release': formData.photoRelease ? 'Yes' : 'No',
      'Client Signature': formData.clientSignature ? 'Signed' : 'Not Signed',
      'Notes': formData.notes || '',
      'Remarks': formData.remarks || '',
      'Status': formData.status || '',
      'Created At': formatDate(formData.createdAt),
      'Updated At': formatDate(formData.updatedAt)
    }];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Client Details');
    XLSX.writeFile(wb, `Client_${formData.name || 'Details'}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="client-view-container">
      {client ? (
        <div className="client-details-wrapper">
          <div className="client-header">
            <div className="client-title">
              <h2>{formData.name || 'Client Details'}</h2>
              <p className="client-id">ID: {formData.clientId || 'N/A'}</p>
            </div>
            <div className="client-actions">
              {!editMode ? (
                <>
                  <button className="btn btn-edit" onClick={() => setEditMode(true)}>
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button className="btn btn-print" onClick={handlePrint}>
                    <i className="fas fa-print"></i> Print
                  </button>
                
                  <button className="btn btn-download" onClick={handleDownload}>
                    <i className="fas fa-download"></i> Download
                  </button>
                   <button className="btn btn-back" onClick={() => navigate('/reportPage')}>
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-save" onClick={handleUpdate}>
                    <i className="fas fa-save"></i> Save
                  </button>
                  <button className="btn btn-cancel" onClick={() => { setEditMode(false); setFormData(client); }}>
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <i className="fas fa-user"></i> Personal
            </button>
            <button 
              className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <i className="fas fa-address-book"></i> Contact
            </button>
            <button 
              className={`tab ${activeTab === 'health' ? 'active' : ''}`}
              onClick={() => setActiveTab('health')}
            >
              <i className="fas fa-heartbeat"></i> Health
            </button>
            <button 
              className={`tab ${activeTab === 'lifestyle' ? 'active' : ''}`}
              onClick={() => setActiveTab('lifestyle')}
            >
              <i className="fas fa-running"></i> Lifestyle
            </button>
            <button 
              className={`tab ${activeTab === 'additional' ? 'active' : ''}`}
              onClick={() => setActiveTab('additional')}
            >
              <i className="fas fa-info-circle"></i> Additional
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'personal' && (
              <div className="client-section">
                <div className="custom-section-header">
                  <span>Personal Information</span>
                </div>
                <div className="responsive-table">
                  <table className="modern-table">
                    <tbody>
                      <EditableRow label="Name" name="name" value={formData.name} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Client ID" name="clientId" value={formData.clientId} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Age" name="age" value={formData.age} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Sex" name="sex" value={formData.sex} editMode={editMode} handleChange={handleChange} options={['F', 'M', 'Others']} />
                      <EditableRow label="DOB" name="dob" value={formData.dob} editMode={editMode} handleChange={handleChange} type="date" />
                      <EditableRow label="Height (cm)" name="height" value={formData.height} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Weight (kg)" name="weight" value={formData.weight} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="BMI" name="bmi" value={formData.bmi} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Marital Status" name="maritalStatus" value={formData.maritalStatus} editMode={editMode} handleChange={handleChange} options={['Single', 'Married']} />
                      <EditableRow label="Profession" name="profession" value={formData.profession} editMode={editMode} handleChange={handleChange} />
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'contact' && (
              <div className="client-section">
                <div className="custom-section-header">
                  <span>Contact Information</span>
                </div>
                <div className="responsive-table">
                  <table className="modern-table">
                    <tbody>
                      <EditableRow label="Mobile" name="mobile" value={formData.mobile} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Email" name="email" value={formData.email} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Address" name="address" value={formData.address} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="How They Know Us" name="howKnow" value={formData.howKnow} editMode={editMode} handleChange={handleChange} options={['Google', 'Facebook', 'Instagram', 'Board']} />
                      <EditableRow label="Reference Name" name="referenceName" value={formData.referenceName} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Other Source" name="otherSource" value={formData.otherSource} editMode={editMode} handleChange={handleChange} />
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'health' && (
              <div className="client-section">
                <div className="custom-section-header">
                  <span>Health Information</span>
                </div>
                <div className="responsive-table">
                  <table className="modern-table">
                    <tbody>
                      <EditableRow label="Main Concerns" name="concerns" value={formData.concerns} editMode={editMode} handleChange={handleChange} options={['Hair Fall', 'Hair thinning', 'Dandruff', 'Hair Dullness', 'Itching scalp', 'Acne', 'Acne scars', 'Skin dullness', 'Pigmentation', 'Scars', 'Fine line/wrinkles', 'Sagging skin', 'Wart/Mole removal', 'Tattoo removal', 'Permanent Hair Removal']} />
                      <EditableRow label="Other Issues" name="otherIssue" value={formData.otherIssue} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Medications" name="medications" value={formData.medications} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="General Health" name="generalHealth" value={formData.generalHealth} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Allergies" name="allergies" value={formData.allergies} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Medications Health" name="medicationsHealth" value={formData.medicationsHealth} editMode={editMode} handleChange={handleChange} />
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'lifestyle' && (
              <div className="client-section">
                <div className="custom-section-header">
                  <span>Lifestyle Information</span>
                </div>
                <div className="responsive-table">
                  <table className="modern-table">
                    <tbody>
                      <EditableRow 
                        label="Smoking" 
                        name="lifestyleSmoke" 
                        value={formData.lifestyleSmoke} 
                        editMode={editMode} 
                        handleChange={handleChange} 
                        type="checkbox" 
                      />
                      {formData.lifestyleSmoke && (
                        <>
                          <EditableRow label="Smoke Quantity" name="smokeQty" value={formData.smokeQty} editMode={editMode} handleChange={handleChange} />
                          <EditableRow label="Smoke Years" name="smokeYears" value={formData.smokeYears} editMode={editMode} handleChange={handleChange} />
                        </>
                      )}
                      <EditableRow 
                        label="Alcohol" 
                        name="lifestyleAlcohol" 
                        value={formData.lifestyleAlcohol} 
                        editMode={editMode} 
                        handleChange={handleChange} 
                        type="checkbox" 
                      />
                      {formData.lifestyleAlcohol && (
                        <>
                          <EditableRow label="Alcohol Quantity" name="alcoholQty" value={formData.alcoholQty} editMode={editMode} handleChange={handleChange} />
                          <EditableRow label="Alcohol Frequency" name="alcoholFreq" value={formData.alcoholFreq} editMode={editMode} handleChange={handleChange} />
                        </>
                      )}
                      <EditableRow label="Stress Level" name="stressLevel" value={formData.stressLevel} editMode={editMode} handleChange={handleChange} options={['0-1', '2-4', '5-7', '8-10']} />
                      <EditableRow label="Sunlight Exposure" name="sunlightExposure" value={formData.sunlightExposure} editMode={editMode} handleChange={handleChange} options={['Mild', 'Moderate', 'Severe']} />
                      <EditableRow 
                        label="Exercise" 
                        name="exercise" 
                        value={formData.exercise} 
                        editMode={editMode} 
                        handleChange={handleChange} 
                        type="checkbox" 
                      />
                      <EditableRow 
                        label="Strict Diet" 
                        name="strictDiet" 
                        value={formData.strictDiet} 
                        editMode={editMode} 
                        handleChange={handleChange} 
                        type="checkbox" 
                      />
                      <EditableRow label="Diet Type" name="dietType" value={formData.dietType} editMode={editMode} handleChange={handleChange} options={['Vegetarian', 'Non-Vegetarian']} />
                      <EditableRow label="Skincare Routine" name="skincareRoutine" value={formData.skincareRoutine} editMode={editMode} handleChange={handleChange} options={['Make up off', 'Toner', 'Sun screen', 'Eye cream', 'Scrub/Exfoliate', 'Skin care related supplements']} />
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'additional' && (
              <div className="client-section">
                <div className="custom-section-header">
                  <span>Additional Information</span>
                </div>
                <div className="responsive-table">
                  <table className="modern-table">
                    <tbody>
                      <EditableRow 
                        label="Photo Release" 
                        name="photoRelease" 
                        value={formData.photoRelease} 
                        editMode={editMode} 
                        handleChange={handleChange} 
                        type="checkbox" 
                      />
                      <EditableRow 
                        label="Client Signature" 
                        name="clientSignature" 
                        value={formData.clientSignature} 
                        editMode={editMode} 
                        handleChange={handleChange} 
                        type="checkbox" 
                      />
                      <EditableRow label="Notes" name="notes" value={formData.notes} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Remarks" name="remarks" value={formData.remarks} editMode={editMode} handleChange={handleChange} />
                      <EditableRow label="Status" name="status" value={formData.status} editMode={editMode} handleChange={handleChange} />
                      {/* <EditableRow label="Consulting Doctor" name="consultingDoctor" value={formData.consultingDoctor} editMode={editMode} handleChange={handleChange} /> */}
                      <EditableRow label="Created At" name="createdAt" value={formatDate(formData.createdAt)} editMode={false} handleChange={handleChange} />
                      <EditableRow label="Updated At" name="updatedAt" value={formatDate(formData.updatedAt)} editMode={false} handleChange={handleChange} />
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="no-client">
          <i className="fas fa-user-slash"></i>
          <p>No client data found</p>
        </div>
      )}
    </div>
  );
};

const EditableRow = ({ label, name, value, editMode, handleChange, options, type = 'text' }) => (
  <tr>
    <td className="label-cell">{label}</td>
    <td className="value-cell">
      {editMode ? (
        type === 'checkbox' ? (
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name={name}
                checked={value || false}
                onChange={handleChange}
              />
              {name === 'clientSignature' ? 'Signed' : 'Yes'}
            </label>
            <label>
              <input
                type="checkbox"
                name={name}
                checked={!value}
                onChange={(e) => handleChange({ target: { name, type: 'checkbox', checked: !e.target.checked } })}
              />
              {name === 'clientSignature' ? 'Not Signed' : 'No'}
            </label>
          </div>
        ) : options ? (
          <select name={name} value={value || ''} onChange={handleChange} className="edit-input">
            <option value="">Select</option>
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={handleChange}
            className="edit-input"
          />
        )
      ) : (
        type === 'checkbox' ? (value ? (name === 'clientSignature' ? 'Signed' : 'Yes') : (name === 'clientSignature' ? 'Not Signed' : 'No')) : (value || <span className="empty-value">N/A</span>)
      )}
    </td>
  </tr>
);

const twistStr = (str) => {
  if (typeof str !== 'string') {
    return str;
  }
  return str.replace(/^C/, 'C-');
};

export default ViewClient;

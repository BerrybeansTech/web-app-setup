import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';
import '../pages/ViewClient.css';

const ViewClient = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
      <head>
        <title>Client Details - ${formData.name || 'N/A'}</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            padding: 30px; 
            line-height: 1.6; 
            color: #333; 
          }
          .print-container { 
            max-width: 800px; 
            margin: 0 auto; 
            border: 1px solid #ddd; 
            padding: 20px; 
            border-radius: 8px; 
          }
          .print-header { 
            text-align: center; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #4361ee; 
            padding-bottom: 10px; 
          }
          .print-header h1 { 
            color: #4361ee; 
            font-size: 24px; 
            margin: 0; 
          }
          .print-meta { 
            font-size: 12px; 
            color: #666; 
            margin-bottom: 20px; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px; 
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 10px; 
            text-align: left; 
          }
          th { 
            background: #f5f7fa; 
            font-weight: 600; 
            color: #2b2d42; 
          }
          .section-title { 
            font-size: 16px; 
            color: #4361ee; 
            margin: 20px 0 10px; 
            font-weight: 600; 
          }
          .boolean-field { 
            text-transform: capitalize; 
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <h1>Client Details</h1>
            <div class="print-meta">
              Client ID: ${formData.clientId || 'N/A'}<br>
              Generated on: ${new Date().toLocaleString('en-IN')}
            </div>
          </div>
          
          <div class="section-title">Personal Information</div>
          <table>
            <tr><th>Name</th><td>${formData.name || 'N/A'}</td></tr>
            <tr><th>Client ID</th><td>${formData.clientId || 'N/A'}</td></tr>
            <tr><th>Age</th><td>${formData.age || 'N/A'}</td></tr>
            <tr><th>Sex</th><td>${formData.sex || 'N/A'}</td></tr>
            <tr><th>DOB</th><td>${formData.dob || 'N/A'}</td></tr>
            <tr><th>Marital Status</th><td>${formData.maritalStatus || 'N/A'}</td></tr>
            <tr><th>Profession</th><td>${formData.profession || 'N/A'}</td></tr>
            <tr><th>Height</th><td>${formData.height || 'N/A'} cm</td></tr>
            <tr><th>Weight</th><td>${formData.weight || 'N/A'} kg</td></tr>
            <tr><th>BMI</th><td>${formData.bmi || 'N/A'}</td></tr>
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
            <tr><th>Main Concerns</th><td>${formData.concerns || 'N/A'}</td></tr>
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
            <tr><th>Stress Level</th><td>${formData.stressLevel || 'N/A'}</td></tr>
            <tr><th>Sunlight Exposure</th><td>${formData.sunlightExposure || 'N/A'}</td></tr>
            <tr><th>Exercise</th><td class="boolean-field">${formData.exercise ? 'Yes' : 'No'}</td></tr>
            <tr><th>Strict Diet</th><td class="boolean-field">${formData.strictDiet ? 'Yes' : 'No'}</td></tr>
            <tr><th>Diet Type</th><td>${formData.dietType || 'N/A'}</td></tr>
            <tr><th>Skincare Routine</th><td>${formData.skincareRoutine || 'N/A'}</td></tr>
          </table>

          <div class="section-title">Additional Information</div>
          <table>
            <tr><th>Photo Release</th><td class="boolean-field">${formData.photoRelease ? 'Yes' : 'No'}</td></tr>
            <tr><th>Notes</th><td>${formData.notes || 'N/A'}</td></tr>
            <tr><th>Remarks</th><td>${formData.remarks || 'N/A'}</td></tr>
            <tr><th>Status</th><td>${formData.status || 'N/A'}</td></tr>
            <tr><th>Consulting Doctor</th><td>${formData.consultingDoctor || 'N/A'}</td></tr>
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

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="client-view-container">
      {client ? (
        <div className="client-details-table">
          <h2>Client Details</h2>
          {successMessage && <p className="success-message">{successMessage}</p>}
          <table>
            <tbody>
              <EditableRow label="Name" name="name" value={formData.name} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Client ID" name="clientId" value={formData.clientId} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Mobile" name="mobile" value={formData.mobile} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Email" name="email" value={formData.email} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Age" name="age" value={formData.age} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Sex" name="sex" value={formData.sex} editMode={editMode} handleChange={handleChange} options={['F', 'M', 'Others']} />
              <EditableRow label="DOB" name="dob" value={formData.dob} editMode={editMode} handleChange={handleChange} type="date" />
              <EditableRow label="Height" name="height" value={formData.height} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Weight" name="weight" value={formData.weight} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="BMI" name="bmi" value={formData.bmi} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Marital Status" name="maritalStatus" value={formData.maritalStatus} editMode={editMode} handleChange={handleChange} options={['Single', 'Married']} />
              <EditableRow label="Profession" name="profession" value={formData.profession} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Address" name="address" value={formData.address} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="How Know" name="howKnow" value={formData.howKnow} editMode={editMode} handleChange={handleChange} options={['Google', 'Facebook', 'Instagram', 'Board']} />
              <EditableRow label="Reference Name" name="referenceName" value={formData.referenceName} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Other Source" name="otherSource" value={formData.otherSource} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Concerns" name="concerns" value={formData.concerns} editMode={editMode} handleChange={handleChange} options={['Hair Fall', 'Hair thinning', 'Dandruff', 'Hair Dullness', 'Itching scalp', 'Acne', 'Acne scars', 'Skin dullness', 'Pigmentation', 'Scars', 'Fine line/wrinkles', 'Sagging skin', 'Wart/Mole removal', 'Tattoo removal', 'Permanent Hair Removal']} />
              <EditableRow label="Other Issue" name="otherIssue" value={formData.otherIssue} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Medications" name="medications" value={formData.medications} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="General Health" name="generalHealth" value={formData.generalHealth} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Allergies" name="allergies" value={formData.allergies} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Medications Health" name="medicationsHealth" value={formData.medicationsHealth} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Smoke Qty" name="smokeQty" value={formData.smokeQty} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Smoke Years" name="smokeYears" value={formData.smokeYears} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Alcohol Qty" name="alcoholQty" value={formData.alcoholQty} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Alcohol Freq" name="alcoholFreq" value={formData.alcoholFreq} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Stress Level" name="stressLevel" value={formData.stressLevel} editMode={editMode} handleChange={handleChange} options={['0-1', '2-4', '5-7', '8-10']} />
              <EditableRow label="Sunlight Exposure" name="sunlightExposure" value={formData.sunlightExposure} editMode={editMode} handleChange={handleChange} options={['Mild', 'Moderate', 'Severe']} />
              <EditableRow label="Skincare Routine" name="skincareRoutine" value={formData.skincareRoutine} editMode={editMode} handleChange={handleChange} options={['Make up off', 'Toner', 'Sun screen', 'Eye cream', 'Scrub/Exfoliate', 'Skin care related supplements']} />
              <EditableRow label="Diet Type" name="dietType" value={formData.dietType} editMode={editMode} handleChange={handleChange} options={['Vegetarian', 'Non-Vegetarian']} />
              <EditableRow label="Notes" name="notes" value={formData.notes} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Remarks" name="remarks" value={formData.remarks} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Status" name="status" value={formData.status} editMode={editMode} handleChange={handleChange} />
              <EditableRow label="Consulting Doctor" name="consultingDoctor" value={formData.consultingDoctor} editMode={editMode} handleChange={handleChange} />

              <tr>
                <td className="label-cell">Smoke</td>
                <td className="value-cell">
                  {editMode ? (
                    <div className="checkbox-group">
                      <label><input type="checkbox" name="lifestyleSmoke" checked={formData.lifestyleSmoke || false} onChange={handleChange} /> Yes</label>
                      <label><input type="checkbox" name="lifestyleSmoke" checked={!formData.lifestyleSmoke} onChange={(e) => handleChange({ target: { name: 'lifestyleSmoke', type: 'checkbox', checked: !e.target.checked } })} /> No</label>
                    </div>
                  ) : (
                    formData.lifestyleSmoke ? 'Yes' : 'No'
                  )}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Alcohol</td>
                <td className="value-cell">
                  {editMode ? (
                    <div className="checkbox-group">
                      <label><input type="checkbox" name="lifestyleAlcohol" checked={formData.lifestyleAlcohol || false} onChange={handleChange} /> Yes</label>
                      <label><input type="checkbox" name="lifestyleAlcohol" checked={!formData.lifestyleAlcohol} onChange={(e) => handleChange({ target: { name: 'lifestyleAlcohol', type: 'checkbox', checked: !e.target.checked } })} /> No</label>
                    </div>
                  ) : (
                    formData.lifestyleAlcohol ? 'Yes' : 'No'
                  )}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Exercise</td>
                <td className="value-cell">
                  {editMode ? (
                    <div className="checkbox-group">
                      <label><input type="checkbox" name="exercise" checked={formData.exercise || false} onChange={handleChange} /> Yes</label>
                      <label><input type="checkbox" name="exercise" checked={!formData.exercise} onChange={(e) => handleChange({ target: { name: 'exercise', type: 'checkbox', checked: !e.target.checked } })} /> No</label>
                    </div>
                  ) : (
                    formData.exercise ? 'Yes' : 'No'
                  )}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Strict Diet</td>
                <td className="value-cell">
                  {editMode ? (
                    <div className="checkbox-group">
                      <label><input type="checkbox" name="strictDiet" checked={formData.strictDiet || false} onChange={handleChange} /> Yes</label>
                      <label><input type="checkbox" name="strictDiet" checked={!formData.strictDiet} onChange={(e) => handleChange({ target: { name: 'strictDiet', type: 'checkbox', checked: !e.target.checked } })} /> No</label>
                    </div>
                  ) : (
                    formData.strictDiet ? 'Yes' : 'No'
                  )}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Photo Release</td>
                <td className="value-cell">
                  {editMode ? (
                    <div className="checkbox-group">
                      <label><input type="checkbox" name="photoRelease" checked={formData.photoRelease || false} onChange={handleChange} /> Yes</label>
                      <label><input type="checkbox" name="photoRelease" checked={!formData.photoRelease} onChange={(e) => handleChange({ target: { name: 'photoRelease', type: 'checkbox', checked: !e.target.checked } })} /> No</label>
                    </div>
                  ) : (
                    formData.photoRelease ? 'Yes' : 'No'
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="action-buttons">
            {!editMode ? (
              <>
                <button className="edit-button" onClick={() => setEditMode(true)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button className="print-button" onClick={handlePrint}>
                  <i className="fas fa-print"></i> Print
                </button>
              </>
            ) : (
              <>
                <button className="save-button" onClick={handleUpdate}>
                  <i className="fas fa-save"></i> Save
                </button>
                <button className="cancel-button" onClick={() => { setEditMode(false); setFormData(client); }}>
                  <i className="fas fa-times"></i> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>No client data found.</p>
      )}
    </div>
  );
};

const EditableRow = ({ label, name, value, editMode, handleChange, options, type = 'text' }) => (
  <tr>
    <td className="label-cell">{label}</td>
    <td className="value-cell">
      {editMode ? (
        options ? (
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
        value || 'N/A'
      )}
    </td>
  </tr>
);

export default ViewClient;
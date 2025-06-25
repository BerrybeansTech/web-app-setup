import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FaPrint, FaDownload, FaRedo, FaInfoCircle } from 'react-icons/fa';
import './consultationForm.css';

const ConsultationForm = () => {
  const [formData, setFormData] = useState({
    consultingDoctor: '',
    date: '',
    clientId: '',
    name: '',
    age: '',
    dob: '',
    sex: 'F',
    maritalStatus: 'Single',
    height: '',
    weight: '',
    bmi: '',
    profession: '',
    mobile: '',
    email: '',
    address: '',
    howKnow: '',
    referenceName: '',
    otherSource: '',
    hairFall: false,
    hairThinning: false,
    dandruff: false,
    hairDullness: false,
    itchingScalp: false,
    acne: false,
    acneScars: false,
    skinDullness: false,
    pigmentation: false,
    scars: false,
    fineLines: false,
    saggingSkin: false,
    wartMole: false,
    tattooRemoval: false,
    permanentHair: false,
    otherIssue: '',
    medications: '',
    generalHealth: '',
    medicationsHealth: '',
    allergies: '',
    lifestyleSmoke: false,
    smokeQty: '',
    smokeYears: '',
    lifestyleAlcohol: false,
    alcoholQty: '',
    alcoholFreq: '',
    stressLevel: '',
    sunlightExposure: 'Mild',
    exercise: false,
    strictDiet: false,
    skincareRoutine: [],
    dietType: 'Vegetarian',
    photoRelease: false,
    clientSignature: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const signatureRef = useRef(null);

  const requiredFields = ['consultingDoctor', 'date', 'clientId', 'name', 'age', 'dob', 'mobile', 'email'];

  const validateForm = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(formData).length - 1; // Exclude clientSignature
    const filledFields = Object.entries(formData).filter(([key, value]) => {
      if (key === 'clientSignature') return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== false;
    }).length;
    const percentage = Math.round((filledFields / totalFields) * 100);
    setProgress(percentage);
  };

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    if (type === 'checkbox') {
      if (name === 'skincareRoutine') {
        const newRoutine = checked
          ? [...formData.skincareRoutine, value]
          : formData.skincareRoutine.filter((item) => item !== value);
        newValue = newRoutine;
      } else {
        newValue = checked;
      }
    } else if (type === 'radio') {
      newValue = value;
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const signatureData = signatureRef.current.isEmpty()
        ? ''
        : signatureRef.current.toDataURL();
      const finalData = { ...formData, clientSignature: signatureData };
      console.log('Form Data:', finalData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      alert('Consultation form data saved!');
    } catch (error) {
      alert('Error saving form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      consultingDoctor: '',
      date: '',
      clientId: '',
      name: '',
      age: '',
      dob: '',
      sex: 'F',
      maritalStatus: 'Single',
      height: '',
      weight: '',
      bmi: '',
      profession: '',
      mobile: '',
      email: '',
      address: '',
      howKnow: '',
      referenceName: '',
      otherSource: '',
      hairFall: false,
      hairThinning: false,
      dandruff: false,
      hairDullness: false,
      itchingScalp: false,
      acne: false,
      acneScars: false,
      skinDullness: false,
      pigmentation: false,
      scars: false,
      fineLines: false,
      saggingSkin: false,
      wartMole: false,
      tattooRemoval: false,
      permanentHair: false,
      otherIssue: '',
      medications: '',
      generalHealth: '',
      medicationsHealth: '',
      allergies: '',
      lifestyleSmoke: false,
      smokeQty: '',
      smokeYears: '',
      lifestyleAlcohol: false,
      alcoholQty: '',
      alcoholFreq: '',
      stressLevel: '',
      sunlightExposure: 'Mild',
      exercise: false,
      strictDiet: false,
      skincareRoutine: [],
      dietType: 'Vegetarian',
      photoRelease: false,
      clientSignature: '',
      notes: '',
    });
    setErrors({});
    signatureRef.current.clear();
    setProgress(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const signatureData = signatureRef.current.isEmpty()
      ? ''
      : signatureRef.current.toDataURL();
    const finalData = { ...formData, clientSignature: signatureData };
    const element = document.createElement('a');
    const text = JSON.stringify(finalData, null, 2);
    const blob = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    element.download = `eloraa-consultation-${formData.clientId || 'form'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="consultation-form-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="form-header">
        <h1 className="clinic-name">ELORAA CLINIQ</h1>
        <p className="clinic-specialty">SKIN - HAIR - SLIMMING - LASER</p>
        <div></div>
        
        <p className="clinic-address">
          110, Arcot Road, Opposite Jains Swarnokamol Apartments,<br />
          Saligramam, Chennai - 600093<br />
          +91 76049 89898 | +91 44 4215 9898
        </p>
        
        <hr className="header-divider" />
      </div>
      

      <h2 className="form-title">CONSULTATION SHEET</h2>

      <div className="action-buttons">
        <button onClick={handlePrint} className="print-button">
          <FaPrint /> Print
        </button>
        <button onClick={handleDownload} className="download-button">
          <FaDownload /> Download
        </button>
        <button onClick={handleReset} className="reset-button">
          <FaRedo /> Reset
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Consulting Doctor: {errors.consultingDoctor && <span className="form-error">{errors.consultingDoctor}</span>}</label>
              <input
                type="text"
                name="consultingDoctor"
                value={formData.consultingDoctor}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter doctor's name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date: {errors.date && <span className="form-error">{errors.date}</span>}</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Client ID: {errors.clientId && <span className="form-error">{errors.clientId}</span>}</label>
              <input
                type="text"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter client ID"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <p className="form-instruction">
            Kindly answer the following questions to the best of your knowledge to have a better understanding of your health, enabling us to formulate the right course of treatment for you.
          </p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name: {errors.name && <span className="form-error">{errors.name}</span>}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age: {errors.age && <span className="form-error">{errors.age}</span>}</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter age"
              />
            </div>
            <div className="form-group">
              <label className="form-label">D.O.B: {errors.dob && <span className="form-error">{errors.dob}</span>}</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Sex:</label>
              <div className="radio-group">
                <label><input type="radio" name="sex" value="F" checked={formData.sex === 'F'} onChange={handleChange} /> Female</label>
                <label><input type="radio" name="sex" value="M" checked={formData.sex === 'M'} onChange={handleChange} /> Male</label>
                <label><input type="radio" name="sex" value="Others" checked={formData.sex === 'Others'} onChange={handleChange} /> Others</label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Marital Status:</label>
              <div className="radio-group">
                <label><input type="radio" name="maritalStatus" value="Single" checked={formData.maritalStatus === 'Single'} onChange={handleChange} /> Single</label>
                <label><input type="radio" name="maritalStatus" value="Married" checked={formData.maritalStatus === 'Married'} onChange={handleChange} /> Married</label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Height:</label>
              <input type="text" name="height" value={formData.height} onChange={handleChange} className="form-input" placeholder="e.g., 170 cm" />
            </div>
            <div className="form-group">
              <label className="form-label">Weight:</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="form-input" placeholder="e.g., 70 kg" />
            </div>
            <div className="form-group">
              <label className="form-label">
                BMI: <FaInfoCircle className="tooltip-icon" />
                <span className="tooltip-text">Body Mass Index, calculated as weight (kg) / height (m)²</span>
              </label>
              <input type="text" name="bmi" value={formData.bmi} onChange={handleChange} className="form-input" placeholder="e.g., 24.2" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Profession:</label>
            <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="form-input" placeholder="Enter profession" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mobile: {errors.mobile && <span className="form-error">{errors.mobile}</span>}</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter 10-digit mobile number"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email: {errors.email && <span className="form-error">{errors.email}</span>}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input textarea"
              rows="3"
              placeholder="Enter full address"
            ></textarea>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">How did you know about Eloraa Cliniq:</h3>
          <div className="radio-group">
            <label><input type="radio" name="howKnow" value="Google" checked={formData.howKnow === 'Google'} onChange={handleChange} /> Google</label>
            <label><input type="radio" name="howKnow" value="Facebook" checked={formData.howKnow === 'Facebook'} onChange={handleChange} /> Facebook</label>
            <label><input type="radio" name="howKnow" value="Instagram" checked={formData.howKnow === 'Instagram'} onChange={handleChange} /> Instagram</label>
            <label><input type="radio" name="howKnow" value="Board" checked={formData.howKnow === 'Board'} onChange={handleChange} /> Board</label>
          </div>
          <div className="form-group">
            <label className="form-label">Reference, specify name:</label>
            <input
              type="text"
              name="referenceName"
              value={formData.referenceName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter reference name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Other, please specify:</label>
            <input
              type="text"
              name="otherSource"
              value={formData.otherSource}
              onChange={handleChange}
              className="form-input"
              placeholder="Specify other source"
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">What brings you to Eloraa Cliniq:</h3>
          <div className="checkbox-grid">
            <div className="checkbox-group">
              <label><input type="checkbox" name="hairFall" checked={formData.hairFall} onChange={handleChange} /> Hair Fall</label>
              <label><input type="checkbox" name="hairThinning" checked={formData.hairThinning} onChange={handleChange} /> Hair Thinning</label>
              <label><input type="checkbox" name="dandruff" checked={formData.dandruff} onChange={handleChange} /> Dandruff</label>
              <label><input type="checkbox" name="hairDullness" checked={formData.hairDullness} onChange={handleChange} /> Hair Dullness</label>
              <label><input type="checkbox" name="itchingScalp" checked={formData.itchingScalp} onChange={handleChange} /> Itching Scalp</label>
            </div>
            <div className="checkbox-group">
              <label><input type="checkbox" name="acne" checked={formData.acne} onChange={handleChange} /> Acne</label>
              <label><input type="checkbox" name="acneScars" checked={formData.acneScars} onChange={handleChange} /> Acne Scars</label>
              <label><input type="checkbox" name="skinDullness" checked={formData.skinDullness} onChange={handleChange} /> Skin Dullness</label>
              <label><input type="checkbox" name="pigmentation" checked={formData.pigmentation} onChange={handleChange} /> Pigmentation</label>
              <label><input type="checkbox" name="scars" checked={formData.scars} onChange={handleChange} /> Scars</label>
            </div>
            <div className="checkbox-group">
              <label><input type="checkbox" name="fineLines" checked={formData.fineLines} onChange={handleChange} /> Fine Line/Wrinkles</label>
              <label><input type="checkbox" name="saggingSkin" checked={formData.saggingSkin} onChange={handleChange} /> Sagging Skin</label>
              <label><input type="checkbox" name="wartMole" checked={formData.wartMole} onChange={handleChange} /> Wart/Mole Removal</label>
              <label><input type="checkbox" name="tattooRemoval" checked={formData.tattooRemoval} onChange={handleChange} /> Tattoo Removal</label>
              <label><input type="checkbox" name="permanentHair" checked={formData.permanentHair} onChange={handleChange} /> Permanent Hair Removal</label>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Any Other, Specify:</label>
            <input
              type="text"
              name="otherIssue"
              value={formData.otherIssue}
              onChange={handleChange}
              className="form-input"
              placeholder="Specify other issues"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Any Medications or Treatment Taken So Far for the Above Problem:</label>
            <textarea
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              className="form-input textarea"
              rows="3"
              placeholder="List medications or treatments"
            ></textarea>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">General Health Issues (Diabetes, Hypertension, Thyroid PCOD):</h3>
          <div className="form-group">
            <input
              type="text"
              name="generalHealth"
              value={formData.generalHealth}
              onChange={handleChange}
              className="form-input"
              placeholder="List health issues"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Any Medications for the Above Problem:</label>
            <input
              type="text"
              name="medicationsHealth"
              value={formData.medicationsHealth}
              onChange={handleChange}
              className="form-input"
              placeholder="List medications"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Any Allergies (Food/Medication):</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="form-input"
              placeholder="List allergies"
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Lifestyle:</h3>
          <div className="form-group">
            <label><input type="checkbox" name="lifestyleSmoke" checked={formData.lifestyleSmoke} onChange={handleChange} /> Do you smoke:</label>
            {formData.lifestyleSmoke && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">If yes, how many cigarettes a day:</label>
                  <input
                    type="text"
                    name="smokeQty"
                    value={formData.smokeQty}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., 5"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Since:</label>
                  <input
                    type="text"
                    name="smokeYears"
                    value={formData.smokeYears}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., 2 years"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label><input type="checkbox" name="lifestyleAlcohol" checked={formData.lifestyleAlcohol} onChange={handleChange} /> Do you consume alcohol:</label>
            {formData.lifestyleAlcohol && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">If yes, how many:</label>
                  <input
                    type="text"
                    name="alcoholQty"
                    value={formData.alcoholQty}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., 2 drinks"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Times a week:</label>
                  <input
                    type="text"
                    name="alcoholFreq"
                    value={formData.alcoholFreq}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., 3 times"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Rate your level of stress on a scale of 1-10: <FaInfoCircle className="tooltip-icon" />
              <span className="tooltip-text">0-1 none, 2-4 mild, 5-7 moderate, 8-10 severe</span>
            </label>
            <input
              type="range"
              name="stressLevel"
              min="0"
              max="10"
              value={formData.stressLevel}
              onChange={handleChange}
              className="form-range"
            />
            <div className="range-labels">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
            <div className="current-value">Current: {formData.stressLevel || '0'}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Sunlight Exposure:</label>
            <div className="radio-group">
              <label><input type="radio" name="sunlightExposure" value="Mild" checked={formData.sunlightExposure === 'Mild'} onChange={handleChange} /> Mild</label>
              <label><input type="radio" name="sunlightExposure" value="Moderate" checked={formData.sunlightExposure === 'Moderate'} onChange={handleChange} /> Moderate</label>
              <label><input type="radio" name="sunlightExposure" value="Severe" checked={formData.sunlightExposure === 'Severe'} onChange={handleChange} /> Severe</label>
            </div>
          </div>

          <div className="form-group">
            <label><input type="checkbox" name="exercise" checked={formData.exercise} onChange={handleChange} /> Do you Exercise Frequently:</label>
          </div>

          <div className="form-group">
            <label><input type="checkbox" name="strictDiet" checked={formData.strictDiet} onChange={handleChange} /> Do you follow Strict Diet:</label>
          </div>

          <div className="form-group">
            <label className="form-label">Your Current Skin Care Routine:</label>
            <div className="checkbox-grid">
              <label><input type="checkbox" name="skincareRoutine" value="makeupOff" checked={formData.skincareRoutine.includes('makeupOff')} onChange={handleChange} /> I take my make up off</label>
              <label><input type="checkbox" name="skincareRoutine" value="toner" checked={formData.skincareRoutine.includes('toner')} onChange={handleChange} /> I use a toner</label>
              <label><input type="checkbox" name="skincareRoutine" value="sunscreen" checked={formData.skincareRoutine.includes('sunscreen')} onChange={handleChange} /> I wear sun screen</label>
              <label><input type="checkbox" name="skincareRoutine" value="eyeCream" checked={formData.skincareRoutine.includes('eyeCream')} onChange={handleChange} /> I use an eye cream</label>
              <label><input type="checkbox" name="skincareRoutine" value="scrub" checked={formData.skincareRoutine.includes('scrub')} onChange={handleChange} /> I use a scrub/exfoliate</label>
              <label><input type="checkbox" name="skincareRoutine" value="supplements" checked={formData.skincareRoutine.includes('supplements')} onChange={handleChange} /> I take skin care related supplements</label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Are you a:</label>
            <div className="radio-group">
              <label><input type="radio" name="dietType" value="Vegetarian" checked={formData.dietType === 'Vegetarian'} onChange={handleChange} /> Vegetarian</label>
              <label><input type="radio" name="dietType" value="Non-Vegetarian" checked={formData.dietType === 'Non-Vegetarian'} onChange={handleChange} /> Non-Vegetarian</label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <p className="declaration">I hereby declare that the above mentioned information is accurate to the best of my knowledge</p>
          <div className="form-group">
            <label><input type="checkbox" name="photoRelease" checked={formData.photoRelease} onChange={handleChange} /> Use of photography and video release for promotion and advertising activities:</label>
          </div>
          <div className="form-group">
            <label className="form-label">Client's Signature:</label>
            <div className="signature-container">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{ className: 'signature-pad' }}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input textarea"
              rows="3"
              placeholder="Additional notes"
            ></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting && <span className="loading-spinner"></span>}
            {isSubmitting ? 'Saving...' : 'Save Consultation'}
          </button>
          <button type="button" className="reset-button" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;
// // ConsultationForm.jsx
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import SignatureCanvas from 'react-signature-canvas';
// import { FaPrint, FaDownload, FaRedo, FaInfoCircle, FaMapMarkerAlt, FaPhone, FaCalculator } from 'react-icons/fa';
// import * as XLSX from 'xlsx';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './ConsultationForm.css';
// import Logo from '../assets/images/logo.png';
// import { submitConsultationForm } from '../services/api';
// import { useNavigate } from 'react-router-dom';



// const CONCERNS_OPTIONS = [
//   { id: 'hairFall', label: 'Hair Fall' },
//   { id: 'hairThinning', label: 'Hair Thinning' },
//   { id: 'dandruff', label: 'Dandruff' },
//   { id: 'hairDullness', label: 'Hair Dullness' },
//   { id: 'itchingScalp', label: 'Itching Scalp' },
//   { id: 'acne', label: 'Acne' },
//   { id: 'acneScars', label: 'Acne Scars' },
//   { id: 'skinDullness', label: 'Skin Dullness' },
//   { id: 'pigmentation', label: 'Pigmentation' },
//   { id: 'scars', label: 'Scars' },
//   { id: 'fineLines', label: 'Fine Line/Wrinkles' },
//   { id: 'saggingSkin', label: 'Sagging Skin' },
//   { id: 'wartMole', label: 'Wart/Mole Removal' },
//   { id: 'tattooRemoval', label: 'Tattoo Removal' },
//   { id: 'permanentHair', label: 'Permanent Hair Removal' }
// ];

// const SKINCARE_ROUTINE_OPTIONS = [
//   { id: 'makeupOff', label: 'I take my make up off' },
//   { id: 'toner', label: 'I use a toner' },
//   { id: 'sunscreen', label: 'I wear sun screen' },
//   { id: 'eyeCream', label: 'I use an eye cream' },
//   { id: 'scrub', label: 'I use a scrub/exfoliate' },
//   { id: 'supplements', label: 'I take skin care related supplements' }
// ];

// const INITIAL_FORM_DATA = {
//   date: new Date().toISOString().split('T')[0],
//   clientId: '',
//   name: '',
//   age: '',
//   dob: '',
//   sex: 'F',
//   maritalStatus: 'Single',
//   height: '',
//   weight: '',
//   bmi: '',
//   profession: '',
//   mobile: '',
//   email: '',
//   address: '',
//   howKnow: '',
//   referenceName: '',
//   otherSource: '',
//   concerns: [],
//   otherIssue: '',
//   medications: '',
//   generalHealth: '',
//   medicationsHealth: '',
//   allergies: '',
//   lifestyleSmoke: false,
//   smokeQty: '',
//   smokeYears: '',
//   lifestyleAlcohol: false,
//   alcoholQty: '',
//   alcoholFreq: '',
//   stressLevel: '',
//   sunlightExposure: 'Mild',
//   exercise: false,
//   strictDiet: false,
//   skincareRoutine: [],
//   dietType: 'Vegetarian',
//   photoRelease: false,
//   clientSignature: '',
//   notes: ''
// };

// const ConsultationForm = () => {
//   const [formData, setFormData] = useState(INITIAL_FORM_DATA);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const signatureRef = useRef(null);
//   const formRef = useRef(null);
//   const navigate = useNavigate();

//   const requiredFields = ['date', 'clientId', 'name', 'age', 'dob', 'mobile', 'email'];

//   // Calculate age from DOB
//   useEffect(() => {
//     if (formData.dob) {
//       const dobDate = new Date(formData.dob);
//       const today = new Date();
//       let age = today.getFullYear() - dobDate.getFullYear();
//       const monthDiff = today.getMonth() - dobDate.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
//         age--;
//       }
//       setFormData(prev => ({ ...prev, age: age.toString() }));
//     }
//   }, [formData.dob]);



//   // Calculate BMI
//   useEffect(() => {
//     if (formData.height && formData.weight) {
//       const heightInMeters = parseFloat(formData.height) / 100;
//       const weightInKg = parseFloat(formData.weight);
//       if (heightInMeters > 0 && weightInKg > 0) {
//         const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
//         setFormData(prev => ({ ...prev, bmi: bmiValue }));
//       }
//     }
//   }, [formData.height, formData.weight]);

//   // Generate client ID
//   useEffect(() => {
//     const generateClientId = () => {
//       const now = new Date();
//       const yy = now.getFullYear().toString().slice(-2);
//       const mm = String(now.getMonth() + 1).padStart(2, '0');
//       const dd = String(now.getDate()).padStart(2, '0');
//       const randomNum = Math.floor(1000 + Math.random() * 9000);
//       return `EC-${yy}${mm}${dd}-${randomNum}`;
//     };
//     setFormData(prev => ({ ...prev, clientId: generateClientId() }));
//   }, []);

//   // Validate form
//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     requiredFields.forEach(field => {
//       if (!formData[field]) {
//         newErrors[field] = 'This field is required';
//       }
//     });
//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//     }
//     if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
//       newErrors.mobile = 'Mobile number must be 10 digits';
//     }
//     if (formData.dob) {
//       const dobDate = new Date(formData.dob);
//       if (dobDate > new Date()) {
//         newErrors.dob = 'Date of birth cannot be in the future';
//       }
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData]);

//   // Calculate progress
//   const calculateProgress = useCallback(() => {
//     const totalFields = Object.keys(formData).length - 1;
//     const filledFields = Object.entries(formData).filter(([key, value]) => {
//       if (key === 'clientSignature') return false;
//       if (Array.isArray(value)) return value.length > 0;
//       return value !== '' && value !== false;
//     }).length;
//     const percentage = Math.round((filledFields / totalFields) * 100);
//     setProgress(percentage);
//   }, [formData]);

//   useEffect(() => {
//     calculateProgress();
//   }, [formData, calculateProgress]);

//   console.log('Form Data:', formData);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     let newValue = value;
//     if (type === 'checkbox') {
//       if (name === 'concerns') {
//         newValue = checked
//           ? [...formData.concerns, value]
//           : formData.concerns.filter(item => item !== value);
//       } else if (name === 'skincareRoutine') {
//         newValue = checked
//           ? [...formData.skincareRoutine, value]
//           : formData.skincareRoutine.filter(item => item !== value);
//       } else {
//         newValue = checked;
//       }
//     } else if (type === 'number') {
//       newValue = value === '' ? '' : Number(value);
//     }
//     setFormData(prev => ({ ...prev, [name]: newValue }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       toast.error('Please fill all required fields correctly!');
//       return;
//     }
//     if (signatureRef.current.isEmpty()) {
//       toast.error('Please provide a signature!');
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const signatureData = signatureRef.current.toDataURL();
//       const finalData = {
//         ...formData,
//         concerns: formData.concerns.join(','),
//         skincareRoutine: formData.skincareRoutine.join(','),
//         clientSignature: signatureData
//       };
//       await submitConsultationForm(finalData);
//       toast.success('Form submitted successfully!');
//       handleReset();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to submit form.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Reset form
//   const handleReset = () => {
//     setFormData(INITIAL_FORM_DATA);
//     setErrors({});
//     if (signatureRef.current) {
//       signatureRef.current.clear();
//     }
//     setProgress(0);
//     toast.info('Form has been reset');
//   };

//   // Print form
//   const handlePrint = () => {
//     window.print();
//   };

//   // Download as Excel
//   const handleDownload = () => {
//     const formattedData = {
//       ...formData,
//       concerns: formData.concerns.join(', '),
//       skincareRoutine: formData.skincareRoutine.join(', '),
//       clientSignature: formData.clientSignature ? 'Signed' : 'Not signed'
//     };
//     const ws = XLSX.utils.json_to_sheet([formattedData]);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'ConsultationData');
//     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     const url = window.URL.createObjectURL(data);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `consultation_${formData.clientId || 'form'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//     toast.success('Form downloaded as Excel');
//   };

//   // Calculate BMI
//   const calculateBMI = () => {
//     if (formData.height && formData.weight) {
//       const heightInMeters = parseFloat(formData.height) / 100;
//       const weightInKg = parseFloat(formData.weight);
//       if (heightInMeters > 0 && weightInKg > 0) {
//         const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
//         setFormData(prev => ({ ...prev, bmi: bmiValue }));
//       }
//     } else {
//       toast.warn('Please enter both height and weight to calculate BMI');
//     }
//   };

//   return (
//     <div className="consultation-form-container" ref={formRef}>
//       <ToastContainer />
//       <div className="form-header">
//         <img src={Logo} alt="Eloraa Clinic Logo" className="clinic-logo" draggable="false" aria-hidden="true" />
//         <div className="clinic-address">
//           <div className="address-item">
//             <FaMapMarkerAlt className="address-icon" aria-hidden="true" />
//             <span>110, Arcot Road, Opposite Jains Swarnokamol Apartments, Saligramam, Chennai - 600093</span>
//           </div>
//           <div className="address-item">
//             <FaPhone className="address-icon" aria-hidden="true" />
//             <span>+91 76049 89898 | +91 44 4215 9898</span>
//           </div>
//         </div>
//       </div>
//       <div className="progress-bar">
//         <div className="progress-fill" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
//           <span className="sr-only">{progress}% complete</span>
//         </div>
//       </div>
//       <h1 className="form-title">CONSULTATION SHEET</h1>
//       <form onSubmit={handleSubmit} noValidate>
//         <fieldset className="form-section">
//           <legend className="section-title">Basic Information</legend>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="date" className="form-label">
//                 Date: {errors.date && <span className="form-error" role="alert">{errors.date}</span>}
//               </label>
//               <input
//                 type="date"
//                 id="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 className={`form-input ${errors.date ? 'input-error' : ''}`}
//                 aria-required="true"
//                 aria-invalid={!!errors.date}
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="clientId" className="form-label">
//                 Client ID: {errors.clientId && <span className="form-error" role="alert">{errors.clientId}</span>}
//               </label>
//               <input
//                 type="text"
//                 id="clientId"
//                 name="clientId"
//                 value={formData.clientId}
//                 readOnly
//                 className={`form-input ${errors.clientId ? 'input-error' : ''}`}
//                 aria-required="true"
//               />
//             </div>
//           </div>
//           <div className="form-instruction">
//             Kindly answer the following questions to the best of your knowledge to have a better understanding of your health, enabling us to formulate the right course of treatment for you.
//           </div>
//         </fieldset>
//         <fieldset className="form-section">
//           <legend className="section-title">Personal Details</legend>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="name" className="form-label">
//                 Full Name: {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`form-input ${errors.name ? 'input-error' : ''}`}
//                 placeholder="Enter full name"
//                 aria-required="true"
//                 aria-invalid={!!errors.name}
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="dob" className="form-label">
//                 Date of Birth: {errors.dob && <span className="form-error" role="alert">{errors.dob}</span>}
//               </label>
//               <input
//                 type="date"
//                 id="dob"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 className={`form-input ${errors.dob ? 'input-error' : ''}`}
//                 aria-required="true"
//                 aria-invalid={!!errors.dob}
//                 max={new Date().toISOString().split('T')[0]}
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="age" className="form-label">
//                 Age: {errors.age && <span className="form-error" role="alert">{errors.age}</span>}
//               </label>
//               <input
//                 type="number"
//                 id="age"
//                 name="age"
//                 value={formData.age}
//                 readOnly
//                 className={`form-input ${errors.age ? 'input-error' : ''}`}
//                 placeholder="Auto-calculated"
//                 aria-required="true"
//                 aria-invalid={!!errors.age}
//               />
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="form-group">
//               <fieldset className="radio-fieldset">
//                 <legend className="radio-legend">Sex:</legend>
//                 <div className="radio-group">
//                   <label>
//                     <input type="radio" name="sex" value="F" checked={formData.sex === 'F'} onChange={handleChange} aria-checked={formData.sex === 'F'} /> Female
//                   </label>
//                   <label>
//                     <input type="radio" name="sex" value="M" checked={formData.sex === 'M'} onChange={handleChange} aria-checked={formData.sex === 'M'} /> Male
//                   </label>
//                   <label>
//                     <input type="radio" name="sex" value="Others" checked={formData.sex === 'Others'} onChange={handleChange} aria-checked={formData.sex === 'Others'} /> Others
//                   </label>
//                 </div>
//               </fieldset>
//             </div>
//             <div className="form-group">
//               <fieldset className="radio-fieldset">
//                 <legend className="radio-legend">Marital Status:</legend>
//                 <div className="radio-group">
//                   <label>
//                     <input type="radio" name="maritalStatus" value="Single" checked={formData.maritalStatus === 'Single'} onChange={handleChange} aria-checked={formData.maritalStatus === 'Single'} /> Single
//                   </label>
//                   <label>
//                     <input type="radio" name="maritalStatus" value="Married" checked={formData.maritalStatus === 'Married'} onChange={handleChange} aria-checked={formData.maritalStatus === 'Married'} /> Married
//                   </label>
//                 </div>
//               </fieldset>
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="height" className="form-label">Height (cm):</label>
//               <input
//                 type="number"
//                 id="height"
//                 name="height"
//                 value={formData.height}
//                 onChange={handleChange}
//                 className="form-input"
//                 placeholder="e.g., 170"
//                 min="100"
//                 max="250"
//                 step="0.1"
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="weight" className="form-label">Weight (kg):</label>
//               <input
//                 type="number"
//                 id="weight"
//                 name="weight"
//                 value={formData.weight}
//                 onChange={handleChange}
//                 className="form-input"
//                 placeholder="e.g., 70"
//                 min="20"
//                 max="200"
//                 step="0.1"
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="bmi" className="form-label">
//                 BMI: <FaInfoCircle className="tooltip-icon" />
//                 <span className="tooltip-text">Body Mass Index, calculated as weight (kg) / height (m)²</span>
//               </label>
//               <div className="bmi-input-group">
//                 <input
//                   type="text"
//                   id="bmi"
//                   name="bmi"
//                   value={formData.bmi}
//                   readOnly
//                   className="form-input"
//                   placeholder="Auto-calculated"
//                 />
//                 <button type="button" className="calculate-button" onClick={calculateBMI} aria-label="Calculate BMI">
//                   <FaCalculator />
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="form-group">
//             <label htmlFor="profession" className="form-label">Profession:</label>
//             <input
//               type="text"
//               id="profession"
//               name="profession"
//               value={formData.profession}
//               onChange={handleChange}
//               className="form-input"
//               placeholder="Enter profession"
//             />
//           </div>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="mobile" className="form-label">
//                 Mobile: {errors.mobile && <span className="form-error" role="alert">{errors.mobile}</span>}
//               </label>
//               <input
//                 type="tel"
//                 id="mobile"
//                 name="mobile"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 className={`form-input ${errors.mobile ? 'input-error' : ''}`}
//                 placeholder="Enter 10-digit mobile number"
//                 pattern="[0-9]{10}"
//                 aria-required="true"
//                 aria-invalid={!!errors.mobile}
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="email" className="form-label">
//                 Email: {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`form-input ${errors.email ? 'input-error' : ''}`}
//                 placeholder="Enter email address"
//                 aria-required="true"
//                 aria-invalid={!!errors.email}
//               />
//             </div>
//           </div>
//           <div className="form-group">
//             <label htmlFor="address" className="form-label">Address:</label>
//             <textarea
//               id="address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               className="form-input textarea"
//               rows="3"
//               placeholder="Enter full address"
//             ></textarea>
//           </div>
//         </fieldset>
//         <fieldset className="form-section">
//           <legend className="section-title">How did you know about Eloraa Cliniq</legend>
//           <div className="radio-group">
//             <label>
//               <input type="radio" name="howKnow" value="Google" checked={formData.howKnow === 'Google'} onChange={handleChange} aria-checked={formData.howKnow === 'Google'} /> Google
//             </label>
//             <label>
//               <input type="radio" name="howKnow" value="Facebook" checked={formData.howKnow === 'Facebook'} onChange={handleChange} aria-checked={formData.howKnow === 'Facebook'} /> Facebook
//             </label>
//             <label>
//               <input type="radio" name="howKnow" value="Instagram" checked={formData.howKnow === 'Instagram'} onChange={handleChange} aria-checked={formData.howKnow === 'Instagram'} /> Instagram
//             </label>
//             <label>
//               <input type="radio" name="howKnow" value="Board" checked={formData.howKnow === 'Board'} onChange={handleChange} aria-checked={formData.howKnow === 'Board'} /> Board
//             </label>
//           </div>
//           <div className="form-group">
//             <label htmlFor="referenceName" className="form-label">Reference, specify name:</label>
//             <input
//               type="text"
//               id="referenceName"
//               name="referenceName"
//               value={formData.referenceName}
//               onChange={handleChange}
//               className="form-input"
//               placeholder="Enter reference name"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="otherSource" className="form-label">Other, please specify:</label>
//             <input
//               type="text"
//               id="otherSource"
//               name="otherSource"
//               value={formData.otherSource}
//               onChange={handleChange}
//               className="form-input"
//               placeholder="Specify other source"
//             />
//           </div>
//         </fieldset>
//         <fieldset className="form-section">
//           <legend className="section-title">What brings you to Eloraa Cliniq</legend>
//           <div className="checkbox-grid">
//             {CONCERNS_OPTIONS.map(option => (
//               <label key={option.id}>
//                 <input
//                   type="checkbox"
//                   name="concerns"
//                   value={option.id}
//                   checked={formData.concerns.includes(option.id)}
//                   onChange={handleChange}
//                   aria-checked={formData.concerns.includes(option.id)}
//                 /> {option.label}
//               </label>
//             ))}
//           </div>
//           <div className="form-group">
//             <label htmlFor="otherIssue" className="form-label">Any Other, Specify:</label>
//             <input
//               type="text"
//               id="otherIssue"
//               name="otherIssue"
//               value={formData.otherIssue}
//               onChange={handleChange}
//               className="form-input"
//               placeholder="Specify other issues"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="medications" className="form-label">Any Medications or Treatment Taken So Far for the Above Problem:</label>
//             <textarea
//               id="medications"
//               name="medications"
//               value={formData.medications}
//               onChange={handleChange}
//               className="form-input textarea"
//               rows="3"
//               placeholder="List medications or treatments"
//             ></textarea>
//           </div>
//         </fieldset>
//         <fieldset className="form-section">
//           <legend className="section-title">General Health</legend>
//           <div className="form-group">
//             <label htmlFor="generalHealth" className="form-label">Health Issues (Diabetes, Hypertension, Thyroid PCOD):</label>
//             <input
//               type="text"
//               id="generalHealth"
//               name="generalHealth"
//               value={formData.generalHealth}
//               onChange={handleChange}
//               className="form-input"
//               placeholder="List health issues"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="medicationsHealth" className="form-label">Any Medications for the Above Problem:</label>
//             <input
//               type="text"
//               id="medicationsHealth"
//               name="medicationsHealth"
//               value={formData.medicationsHealth}
//               onChange={handleChange}
//               className="form-input"
//               placeholder="List medications"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="allergies" className="form-label">Any Allergies (Food/Medication):</label>
//             <input
//               type="text"
//               id="allergies"
//               name="allergies"
//               value={formData.allergies}
//               onChange={handleChange}
//               className="form-input"
//               placeholder="List allergies"
//             />
//           </div>
//         </fieldset>
//         <fieldset className="form-section">
//           <legend className="section-title">Lifestyle</legend>
//           <div className="form-group">
//             <label>
//               <input type="checkbox" name="lifestyleSmoke" checked={formData.lifestyleSmoke} onChange={handleChange} aria-checked={formData.lifestyleSmoke} /> Do you smoke:
//             </label>
//             {formData.lifestyleSmoke && (
//               <div className="form-row nested-fields">
//                 <div className="form-group">
//                   <label htmlFor="smokeQty" className="form-label">If yes, how many cigarettes a day:</label>
//                   <input
//                     type="number"
//                     id="smokeQty"
//                     name="smokeQty"
//                     value={formData.smokeQty}
//                     onChange={handleChange}
//                     className="form-input"
//                     placeholder="e.g., 5"
//                     min="0"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="smokeYears" className="form-label">Since:</label>
//                   <input
//                     type="text"
//                     id="smokeYears"
//                     name="smokeYears"
//                     value={formData.smokeYears}
//                     onChange={handleChange}
//                     className="form-input"
//                     placeholder="e.g., 2 years"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="form-group">
//             <label>
//               <input type="checkbox" name="lifestyleAlcohol" checked={formData.lifestyleAlcohol} onChange={handleChange} aria-checked={formData.lifestyleAlcohol} /> Do you consume alcohol:
//             </label>
//             {formData.lifestyleAlcohol && (
//               <div className="form-row nested-fields">
//                 <div className="form-group">
//                   <label htmlFor="alcoholQty" className="form-label">If yes, how many:</label>
//                   <input
//                     type="text"
//                     id="alcoholQty"
//                     name="alcoholQty"
//                     value={formData.alcoholQty}
//                     onChange={handleChange}
//                     className="form-input"
//                     placeholder="e.g., 2 drinks"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="alcoholFreq" className="form-label">Times a week:</label>
//                   <input
//                     type="text"
//                     id="alcoholFreq"
//                     name="alcoholFreq"
//                     value={formData.alcoholFreq}
//                     onChange={handleChange}
//                     className="form-input"
//                     placeholder="e.g., 3 times"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="form-group">
//             <label htmlFor="stressLevel" className="form-label">
//               Rate your level of stress on a scale of 1-10: <FaInfoCircle className="tooltip-icon" />
//               <span className="tooltip-text">0-1 none, 2-4 mild, 5-7 moderate, 8-10 severe</span>
//             </label>
//             <input
//               type="range"
//               id="stressLevel"
//               name="stressLevel"
//               min="0"
//               max="10"
//               value={formData.stressLevel}
//               onChange={handleChange}
//               className="form-range"
//             />
//             <div className="range-labels">
//               <span>0 (None)</span>
//               <span>5 (Moderate)</span>
//               <span>10 (Severe)</span>
//             </div>
//             <div className="current-value">Current: {formData.stressLevel || '0'}</div>
//           </div>
//           <div className="form-group">
//             <fieldset className="radio-fieldset">
//               <legend className="radio-legend">Sunlight Exposure:</legend>
//               <div className="radio-group">
//                 <label>
//                   <input type="radio" name="sunlightExposure" value="Mild" checked={formData.sunlightExposure === 'Mild'} onChange={handleChange} aria-checked={formData.sunlightExposure === 'Mild'} /> Mild
//                 </label>
//                 <label>
//                   <input type="radio" name="sunlightExposure" value="Moderate" checked={formData.sunlightExposure === 'Moderate'} onChange={handleChange} aria-checked={formData.sunlightExposure === 'Moderate'} /> Moderate
//                 </label>
//                 <label>
//                   <input type="radio" name="sunlightExposure" value="Severe" checked={formData.sunlightExposure === 'Severe'} onChange={handleChange} aria-checked={formData.sunlightExposure === 'Severe'} /> Severe
//                 </label>
//               </div>
//             </fieldset>
//           </div>
//           <div className="form-group">
//             <label>
//               <input type="checkbox" name="exercise" checked={formData.exercise} onChange={handleChange} aria-checked={formData.exercise} /> Do you Exercise Frequently:
//             </label>
//           </div>
//           <div className="form-group">
//             <label>
//               <input type="checkbox" name="strictDiet" checked={formData.strictDiet} onChange={handleChange} aria-checked={formData.strictDiet} /> Do you follow Strict Diet:
//             </label>
//           </div>
//           <div className="form-group">
//             <fieldset className="checkbox-fieldset">
//               <legend className="checkbox-legend">Your Current Skin Care Routine:</legend>
//               <div className="checkbox-grid">
//                 {SKINCARE_ROUTINE_OPTIONS.map(option => (
//                   <label key={option.id}>
//                     <input
//                       type="checkbox"
//                       name="skincareRoutine"
//                       value={option.id}
//                       checked={formData.skincareRoutine.includes(option.id)}
//                       onChange={handleChange}
//                       aria-checked={formData.skincareRoutine.includes(option.id)}
//                     /> {option.label}
//                   </label>
//                 ))}
//               </div>
//             </fieldset>
//           </div>
//           <div className="form-group">
//             <fieldset className="radio-fieldset">
//               <legend className="radio-legend">Are you a:</legend>
//               <div className="radio-group">
//                 <label>
//                   <input type="radio" name="dietType" value="Vegetarian" checked={formData.dietType === 'Vegetarian'} onChange={handleChange} aria-checked={formData.dietType === 'Vegetarian'} /> Vegetarian
//                 </label>
//                 <label>
//                   <input type="radio" name="dietType" value="Non-Vegetarian" checked={formData.dietType === 'Non-Vegetarian'} onChange={handleChange} aria-checked={formData.dietType === 'Non-Vegetarian'} /> Non-Vegetarian
//                 </label>
//               </div>
//             </fieldset>
//           </div>
//         </fieldset>
//         <fieldset className="form-section">
//           <legend className="section-title">Declaration</legend>
//           <p className="declaration">
//             I hereby declare that the above mentioned information is accurate to the best of my knowledge
//           </p>
//           <div className="form-group">
//             <label>
//               <input type="checkbox" name="photoRelease" checked={formData.photoRelease} onChange={handleChange} aria-checked={formData.photoRelease} /> Use of photography and video release for promotion and advertising activities:
//             </label>
//           </div>
//           <div className="form-group">
//             <label htmlFor="signature" className="form-label">Client's Signature:</label>
//             <div className="signature-container">
//               <SignatureCanvas
//                 ref={signatureRef}
//                 canvasProps={{ className: 'signature-pad', id: 'signature', 'aria-label': 'Signature pad' }}
//               />
//             </div>
//             <button type="button" className="clear-signature" onClick={() => signatureRef.current.clear()} aria-label="Clear signature">
//               Clear Signature
//             </button>
//           </div>
//           <div className="form-group">
//             <label htmlFor="notes" className="form-label">Notes:</label>
//             <textarea
//               id="notes"
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               className="form-input textarea"
//               rows="3"
//               placeholder="Additional notes"
//             ></textarea>
//           </div>
//         </fieldset>
//         <div className="form-actions">
//           <button type="submit" className="submit-button" disabled={isSubmitting} aria-label="Save Consultation" aria-busy={isSubmitting}>
//             {isSubmitting ? (
//               <>
//                 <span className="loading-spinner" aria-hidden="true"></span>
//                 Saving...
//               </>
//             ) : 'Save Consultation'}
//           </button>
//           <div className="action-buttons">
//             <button type="button" onClick={handlePrint} className="print-button" aria-label="Print Form">
//               <FaPrint aria-hidden="true" /> Print
//             </button>
//             <button type="button" onClick={handleDownload} className="download-button" aria-label="Download Excel">
//               <FaDownload aria-hidden="true" /> Download Excel
//             </button>
//             <button type="button" onClick={handleReset} className="reset-button" aria-label="Reset Form">
//               <FaRedo aria-hidden="true" /> Reset
//             </button>
//               <button
//       type="button"
//       className="back-button"
//       onClick={() => navigate('/reportPage')}
//     >
//       <i className="fas fa-arrow-left"></i> Back
//     </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ConsultationForm;
import React, { useState, useRef, useEffect, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FaPrint, FaDownload, FaRedo, FaInfoCircle, FaMapMarkerAlt, FaPhone, FaCalculator, FaExclamationCircle } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ConsultationForm.css';
import Logo from '../assets/images/logo.png';
import { submitConsultationForm } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CONCERNS_OPTIONS = [
  { id: 'hairFall', label: 'Hair Fall' },
  { id: 'hairThinning', label: 'Hair Thinning' },
  { id: 'dandruff', label: 'Dandruff' },
  { id: 'hairDullness', label: 'Hair Dullness' },
  { id: 'itchingScalp', label: 'Itching Scalp' },
  { id: 'acne', label: 'Acne' },
  { id: 'acneScars', label: 'Acne Scars' },
  { id: 'skinDullness', label: 'Skin Dullness' },
  { id: 'pigmentation', label: 'Pigmentation' },
  { id: 'scars', label: 'Scars' },
  { id: 'fineLines', label: 'Fine Line/Wrinkles' },
  { id: 'saggingSkin', label: 'Sagging Skin' },
  { id: 'wartMole', label: 'Wart/Mole Removal' },
  { id: 'tattooRemoval', label: 'Tattoo Removal' },
  { id: 'permanentHair', label: 'Permanent Hair Removal' }
];

const SKINCARE_ROUTINE_OPTIONS = [
  { id: 'makeupOff', label: 'I take my make up off' },
  { id: 'toner', label: 'I use a toner' },
  { id: 'sunscreen', label: 'I wear sun screen' },
  { id: 'eyeCream', label: 'I use an eye cream' },
  { id: 'scrub', label: 'I use a scrub/exfoliate' },
  { id: 'supplements', label: 'I take skin care related supplements' }
];

const INITIAL_FORM_DATA = {
  date: new Date().toISOString().split('T')[0],
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
  concerns: [],
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
  notes: ''
};

const ConsultationForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const signatureRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Helper function to format concerns
  const formatConcerns = (concerns) => {
    if (!concerns || concerns.length === 0) return 'N/A';
    return concerns
      .map(id => CONCERNS_OPTIONS.find(option => option.id === id)?.label || id)
      .join(', ');
  };

  // Calculate age from DOB
  useEffect(() => {
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dob]);

  // Calculate BMI
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setFormData(prev => ({ ...prev, bmi: bmiValue }));
      }
    }
  }, [formData.height, formData.weight]);

  // Generate client ID
  useEffect(() => {
    // Start clientId from 3000 and increment for each new form (simple in-memory counter)
    let clientIdCounter = 3000;
    const generateClientId = () => {
      const now = new Date();
      const yy = now.getFullYear().toString().slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      // Use counter instead of random number
      const id = clientIdCounter++;
      return `EC-${yy}${mm}${dd}-${id}`;
    };
    setFormData(prev => ({ ...prev, clientId: generateClientId() }));
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required fields validation
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.clientId) newErrors.clientId = 'Client ID is required';
    if (!formData.name || formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Valid 10-digit mobile number is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (formData.concerns.length === 0) newErrors.concerns = 'Please select at least one concern';
    if (signatureRef.current?.isEmpty()) newErrors.clientSignature = 'Signature is required';

    // Additional validations
    if (formData.dob && new Date(formData.dob) > new Date()) {
      newErrors.dob = 'Date of birth cannot be in the future';
    }
    if (formData.height && (formData.height < 100 || formData.height > 250)) {
      newErrors.height = 'Height must be between 100-250 cm';
    }
    if (formData.weight && (formData.weight < 20 || formData.weight > 200)) {
      newErrors.weight = 'Weight must be between 20-200 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Calculate progress
  const calculateProgress = useCallback(() => {
    const totalFields = Object.keys(formData).length - 1;
    const filledFields = Object.entries(formData).filter(([key, value]) => {
      if (key === 'clientSignature') return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== false;
    }).length;
    const percentage = Math.round((filledFields / totalFields) * 100);
    setProgress(percentage);
  }, [formData]);

  useEffect(() => {
    calculateProgress();
  }, [formData, calculateProgress]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    if (type === 'checkbox') {
      if (name === 'concerns') {
        newValue = checked
          ? [...formData.concerns, value]
          : formData.concerns.filter(item => item !== value);
      } else if (name === 'skincareRoutine') {
        newValue = checked
          ? [...formData.skincareRoutine, value]
          : formData.skincareRoutine.filter(item => item !== value);
      }
    } else if (type === 'number') {
      newValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) {
    toast.error('Please fill all required fields correctly!');
    return;
  }
  if (signatureRef.current.isEmpty()) {
    toast.error('Please provide a signature!');
    return;
  }
  setIsSubmitting(true);
  try {
    const signatureData = signatureRef.current.toDataURL();
    const finalData = {
      ...formData,
      concerns: formData.concerns.join(','),
      skincareRoutine: formData.skincareRoutine.join(','),
      clientSignature: signatureData
    };
    await submitConsultationForm(finalData);
    toast.success('Form submitted successfully!');
    handleReset();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to submit form.');
  } finally {
    setIsSubmitting(false);
  }
};
  // Reset form
  const handleReset = () => {
    setFormData(prev => ({
      ...INITIAL_FORM_DATA,
      clientId: prev.clientId, // Preserve existing clientId
      date: prev.date // Preserve existing date
    }));
    setErrors({});
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
    setProgress(0);
    toast.info('Form has been reset');
  };

  // Print form
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
            <div class="clinic-details">
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
            <tr><th>Smoking</th><td>${formData.lifestyleSmoke ? `Yes (${formData.smokeQty || 'N/A'}, ${formData.smokeYears || 'N/A'})` : 'No'}</td></tr>
            <tr><th>Alcohol</th><td>${formData.lifestyleAlcohol ? `Yes (${formData.alcoholQty || 'N/A'}, ${formData.alcoholFreq || 'N/A'})` : 'No'}</td></tr>
            <tr><th>Stress Level</th><td>${formData.stressLevel ? `${formData.stressLevel}/10` : 'N/A'}</td></tr>
            <tr><th>Sunlight Exposure</th><td>${formData.sunlightExposure || 'N/A'}</td></tr>
            <tr><th>Exercise</th><td>${formData.exercise ? 'Yes' : 'No'}</td></tr>
            <tr><th>Strict Diet</th><td>${formData.strictDiet ? 'Yes' : 'No'}</td></tr>
            <tr><th>Diet Type</th><td>${formData.dietType || 'N/A'}</td></tr>
            <tr><th>Skincare Routine</th><td>${formData.skincareRoutine ? formData.skincareRoutine.join(', ') : 'N/A'}</td></tr>
          </table>

          <div class="section-title">Additional Information</div>
          <table>
            <tr><th>Photo Release</th><td>${formData.photoRelease ? 'Yes' : 'No'}</td></tr>
            <tr><th>Client Signature</th><td>${formData.clientSignature ? 'Signed' : 'Not Signed'}</td></tr>
            <tr><th>Notes</th><td>${formData.notes || 'N/A'}</td></tr>
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

  // Download as Excel
  const handleDownload = () => {
    const formattedData = {
      ...formData,
      concerns: formData.concerns.join(', '),
      skincareRoutine: formData.skincareRoutine.join(', '),
      clientSignature: formData.clientSignature ? 'Signed' : 'Not signed'
    };
    const ws = XLSX.utils.json_to_sheet([formattedData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ConsultationData');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `consultation_${formData.clientId || 'form'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Form downloaded as Excel');
  };

  // Calculate BMI
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setFormData(prev => ({ ...prev, bmi: bmiValue }));
      }
    } else {
      toast.warn('Please enter both height and weight to calculate BMI');
    }
  };

  // Render input field with validation
  const renderInputField = (name, label, type = 'text', options = {}) => {
    const { required, placeholder, min, max, step, pattern, readOnly } = options;
    const error = errors[name];
    
    return (
      <div className={`form-group ${error ? 'has-error' : ''}`}>
        <label htmlFor={name} className="form-label">
          {label} 
          {required && <span className="required-asterisk">*</span>}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          className={`form-input ${error ? 'input-error' : ''}`}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          readOnly={readOnly}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {error && (
          <div id={`${name}-error`} className="form-error-message" role="alert">
            <FaExclamationCircle className="error-icon" /> {error}
          </div>
        )}
      </div>
    );
  };

  // Render radio group
  const renderRadioGroup = (name, label, options) => {
    const error = errors[name];
    
    return (
      <div className={`form-group ${error ? 'has-error' : ''}`}>
        <fieldset className="radio-fieldset">
          <legend className="radio-legend">
            {label}
            {error && (
              <span className="form-error-message" role="alert">
                <FaExclamationCircle className="error-icon" /> {error}
              </span>
            )}
          </legend>
          <div className="radio-group">
            {options.map(option => (
              <label key={option.value}>
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={formData[name] === option.value}
                  onChange={handleChange}
                  aria-checked={formData[name] === option.value}
                /> {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    );
  };

  // Render checkbox group
  const renderCheckboxGroup = (name, label, options) => {
    const error = errors[name];
    
    return (
      <div className={`form-group ${error ? 'has-error' : ''}`}>
        <fieldset className="checkbox-fieldset">
          <legend className="checkbox-legend">
            {label}
            {error && (
              <span className="form-error-message" role="alert">
                <FaExclamationCircle className="error-icon" /> {error}
              </span>
            )}
          </legend>
          <div className="checkbox-grid">
            {options.map(option => (
              <label key={option.id}>
                <input
                  type="checkbox"
                  name={name}
                  value={option.id}
                  checked={formData[name].includes(option.id)}
                  onChange={handleChange}
                  aria-checked={formData[name].includes(option.id)}
                /> {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    );
  };

  return (
    <div className="consultation-form-container" ref={formRef}>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="form-header">
        <img src={Logo} alt="Eloraa Clinic Logo" className="clinic-logo" draggable="false" />
        <div className="clinic-address">
          <div className="address-item">
            <FaMapMarkerAlt className="address-icon" />
            <span>110, Arcot Road, Opposite Jains Swarnokamol Apartments, Saligramam, Chennai - 600093</span>
          </div>
          <div className="address-item">
            <FaPhone className="address-icon" />
            <span>+91 76049 89898 | +91 44 4215 9898</span>
          </div>
        </div>
      </div>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}>
          <span className="progress-text">{progress}% Complete</span>
        </div>
      </div>
      
      <h1 className="form-title">CONSULTATION SHEET</h1>
      
      <form onSubmit={handleSubmit} noValidate>
        {/* Basic Information Section */}
        <fieldset className="form-section">
          <legend className="section-title">Basic Information</legend>
          <div className="form-row">
            {renderInputField('date', 'Date', 'date', { required: true })}
            {renderInputField('clientId', 'Client ID', 'text', { required: true, readOnly: true })}
          </div>
          <div className="form-instruction">
            Kindly answer the following questions to the best of your knowledge to have a better understanding of your health, enabling us to formulate the right course of treatment for you.
          </div>
        </fieldset>

        {/* Personal Details Section */}
        <fieldset className="form-section">
          <legend className="section-title">Personal Details</legend>
          <div className="form-row">
            {renderInputField('name', 'Full Name', 'text', { 
              required: true, 
              placeholder: 'Enter full name'
            })}
            {renderInputField('dob', 'Date of Birth', 'date', { 
              required: true,
              max: new Date().toISOString().split('T')[0]
            })}
            {renderInputField('age', 'Age', 'number', { 
              required: true,
              readOnly: true,
              placeholder: 'Auto-calculated'
            })}
          </div>
          
          <div className="form-row">
            {renderRadioGroup('sex', 'Sex:', [
              { value: 'F', label: 'Female' },
              { value: 'M', label: 'Male' },
              { value: 'Others', label: 'Others' }
            ])}
            {renderRadioGroup('maritalStatus', 'Marital Status:', [
              { value: 'Single', label: 'Single' },
              { value: 'Married', label: 'Married' }
            ])}
          </div>
          
          <div className="form-row">
            {renderInputField('height', 'Height (cm)', 'number', {
              min: 100,
              max: 250,
              placeholder: 'e.g., 170'
            })}
            {renderInputField('weight', 'Weight (kg)', 'number', {
              min: 20,
              max: 200,
              placeholder: 'e.g., 70'
            })}
            <div className="form-group">
              <label htmlFor="bmi" className="form-label">
                BMI: <FaInfoCircle className="tooltip-icon" />
                <span className="tooltip-text">Body Mass Index, calculated as weight (kg) / height (m)²</span>
              </label>
              <div className="bmi-input-group">
                <input
                  type="text"
                  id="bmi"
                  name="bmi"
                  value={formData.bmi}
                  readOnly
                  className="form-input"
                  placeholder="Auto-calculated"
                />
                <button 
                  type="button" 
                  className="calculate-button" 
                  onClick={calculateBMI}
                  aria-label="Calculate BMI"
                >
                  <FaCalculator />
                </button>
              </div>
            </div>
          </div>
          
          {renderInputField('profession', 'Profession', 'text', {
            placeholder: 'Enter profession'
          })}
          
          <div className="form-row">
            {renderInputField('mobile', 'Mobile', 'tel', {
              required: true,
              placeholder: 'Enter 10-digit number',
              pattern: '^\\d{10}$'
            })}
            {renderInputField('email', 'Email', 'email', {
              required: true,
              placeholder: 'Enter email address'
            })}
          </div>
          
          <div className="form-group">
            <label htmlFor="address" className="form-label">Address:</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input textarea"
              rows="3"
              placeholder="Enter full address"
            ></textarea>
          </div>
        </fieldset>

        {/* How did you know section */}
        <fieldset className="form-section">
          <legend className="section-title">How did you know about Eloraa Cliniq</legend>
          {renderRadioGroup('howKnow', '', [
            { value: 'Google', label: 'Google' },
            { value: 'Facebook', label: 'Facebook' },
            { value: 'Instagram', label: 'Instagram' },
            { value: 'Board', label: 'Board' }
          ])}
          
          <div className="form-row">
            {renderInputField('referenceName', 'Reference, specify name:', 'text', {
              placeholder: 'Enter reference name'
            })}
            {renderInputField('otherSource', 'Other, please specify:', 'text', {
              placeholder: 'Specify other source'
            })}
          </div>
        </fieldset>

        {/* Concerns section */}
        <fieldset className="form-section">
          <legend className="section-title">What brings you to Eloraa Cliniq</legend>
          {renderCheckboxGroup('concerns', '', CONCERNS_OPTIONS)}
          
          {renderInputField('otherIssue', 'Any Other, Specify:', 'text', {
            placeholder: 'Specify other issues'
          })}
          
          <div className="form-group">
            <label htmlFor="medications" className="form-label">Any Medications or Treatment Taken So Far for the Above Problem:</label>
            <textarea
              id="medications"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              className="form-input textarea"
              rows="3"
              placeholder="List medications or treatments"
            ></textarea>
          </div>
        </fieldset>

        {/* General Health section */}
        <fieldset className="form-section">
          <legend className="section-title">General Health</legend>
          {renderInputField('generalHealth', 'Health Issues (Diabetes, Hypertension, Thyroid PCOD):', 'text', {
            placeholder: 'List health issues'
          })}
          
          {renderInputField('medicationsHealth', 'Any Medications for the Above Problem:', 'text', {
            placeholder: 'List medications'
          })}
          
          {renderInputField('allergies', 'Any Allergies (Food/Medication):', 'text', {
            placeholder: 'List allergies'
          })}
        </fieldset>

        {/* Lifestyle section */}
        <fieldset className="form-section">
          <legend className="section-title">Lifestyle</legend>
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="lifestyleSmoke" 
                checked={formData.lifestyleSmoke} 
                onChange={handleChange} 
              /> Do you smoke:
            </label>
            {formData.lifestyleSmoke && (
              <div className="form-row nested-fields">
                {renderInputField('smokeQty', 'If yes, how many cigarettes a day:', 'number', {
                  placeholder: 'e.g., 5',
                  min: 0
                })}
                {renderInputField('smokeYears', 'Since:', 'text', {
                  placeholder: 'e.g., 2 years'
                })}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="lifestyleAlcohol" 
                checked={formData.lifestyleAlcohol} 
                onChange={handleChange} 
              /> Do you consume alcohol:
            </label>
            {formData.lifestyleAlcohol && (
              <div className="form-row nested-fields">
                {renderInputField('alcoholQty', 'If yes, how many:', 'text', {
                  placeholder: 'e.g., 2 drinks'
                })}
                {renderInputField('alcoholFreq', 'Times a week:', 'text', {
                  placeholder: 'e.g., 3 times'
                })}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="stressLevel" className="form-label">
              Rate your level of stress on a scale of 1-10: <FaInfoCircle className="tooltip-icon" />
              <span className="tooltip-text">0-1 none, 2-4 mild, 5-7 moderate, 8-10 severe</span>
            </label>
            <input
              type="range"
              id="stressLevel"
              name="stressLevel"
              min="0"
              max="10"
              value={formData.stressLevel}
              onChange={handleChange}
              className="form-range"
            />
            <div className="range-labels">
              <span>0 (None)</span>
              <span>5 (Moderate)</span>
              <span>10 (Severe)</span>
            </div>
            <div className="current-value">Current: {formData.stressLevel || '0'}</div>
          </div>
          
          {renderRadioGroup('sunlightExposure', 'Sunlight Exposure:', [
            { value: 'Mild', label: 'Mild' },
            { value: 'Moderate', label: 'Moderate' },
            { value: 'Severe', label: 'Severe' }
          ])}
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="exercise" 
                checked={formData.exercise} 
                onChange={handleChange} 
              /> Do you Exercise Frequently:
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="strictDiet" 
                checked={formData.strictDiet} 
                onChange={handleChange} 
              /> Do you follow Strict Diet:
            </label>
          </div>
          
          {renderCheckboxGroup('skincareRoutine', 'Your Current Skin Care Routine:', SKINCARE_ROUTINE_OPTIONS)}
          
          {renderRadioGroup('dietType', 'Are you a:', [
            { value: 'Vegetarian', label: 'Vegetarian' },
            { value: 'Non-Vegetarian', label: 'Non-Vegetarian' }
          ])}
        </fieldset>

        {/* Declaration section */}
        <fieldset className="form-section">
          <legend className="section-title">Declaration</legend>
          <p className="declaration">
            I hereby declare that the above mentioned information is accurate to the best of my knowledge
          </p>
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="photoRelease" 
                checked={formData.photoRelease} 
                onChange={handleChange} 
              /> Use of photography and video release for promotion and advertising activities:
            </label>
          </div>
          
          <div className="form-group">
            <label htmlFor="signature" className="form-label">
              Client's Signature <span className="required-asterisk">*</span>
            </label>
            <div className="signature-container">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{ 
                  className: `signature-pad ${errors.clientSignature ? 'signature-error' : ''}`,
                  id: 'signature',
                  'aria-label': 'Signature pad',
                  'aria-required': 'true',
                  'aria-invalid': !!errors.clientSignature
                }}
                onEnd={() => {
                  if (errors.clientSignature && !signatureRef.current.isEmpty()) {
                    setErrors(prev => ({ ...prev, clientSignature: '' }));
                  }
                }}
              />
            </div>
            <button 
              type="button" 
              className="clear-signature" 
              onClick={() => {
                signatureRef.current.clear();
                setErrors(prev => ({ ...prev, clientSignature: '' }));
              }}
            >
              Clear Signature
            </button>
            {errors.clientSignature && (
              <div className="form-error-message" role="alert">
                <FaExclamationCircle className="error-icon" /> {errors.clientSignature}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="notes" className="form-label">Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input textarea"
              rows="3"
              placeholder="Additional notes"
            ></textarea>
          </div>
        </fieldset>

        {/* Form actions */}
        <div className="form-actions">
          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner" aria-hidden="true"></span>
                Saving...
              </>
            ) : 'Save Consultation'}
          </button>
          
          <div className="action-buttons">
            <button 
              type="button" 
              onClick={handlePrint} 
              className="print-button"
            >
              <FaPrint/> Print
            </button>
            <button 
              type="button" 
              onClick={handleDownload} 
              className="download-button"
            >
              <FaDownload /> Download Excel
            </button>
            <button 
              type="button" 
              onClick={handleReset} 
              className="reset-button"
            >
              <FaRedo /> Reset
            </button>
            <button
              type="button"
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <FaRedo /> Back
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;
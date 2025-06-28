// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import SignatureCanvas from 'react-signature-canvas';
// import { FaPrint, FaDownload, FaRedo, FaInfoCircle, FaMapMarkerAlt, FaPhone, FaCalculator } from 'react-icons/fa';
// import * as XLSX from 'xlsx';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './consultationForm.css';
// import Logo from '../assets/images/logo.png';

// // Constants for better maintainability
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
//   consultingDoctor: '',
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

//   const requiredFields = ['consultingDoctor', 'date', 'clientId', 'name', 'age', 'dob', 'mobile', 'email'];

//   // Calculate BMI when height or weight changes
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

//   // Validate form fields
//   const validateForm = useCallback(() => {
//     const newErrors = {};
    
//     requiredFields.forEach((field) => {
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

//   // Calculate form completion progress
//   const calculateProgress = useCallback(() => {
//     const totalFields = Object.keys(formData).length - 1; // exclude signature
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

//   // Handle form field changes
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
    
//     // Clear error when field is modified
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast.error('Please fill all required fields correctly', {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       });
      
//       // Scroll to first error
//       const firstError = Object.keys(errors)[0];
//       if (firstError) {
//         const element = document.querySelector(`[name="${firstError}"]`);
//         if (element) {
//           element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//           element.focus();
//         }
//       }
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       const signatureData = signatureRef.current.isEmpty()
//         ? ''
//         : signatureRef.current.toDataURL();
      
//       const finalData = {
//         ...formData,
//         concerns: formData.concerns.join(','),
//         skincareRoutine: formData.skincareRoutine.join(','),
//         clientSignature: signatureData
//       };

//       // In a real application, you would send this to your backend
//       console.log('Form submission data:', finalData);
      
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       toast.success('Form submitted successfully!', {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       });
      
//       // Reset form after successful submission
//       handleReset();
//     } catch (error) {
//       toast.error('Error submitting form. Please try again.', {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Reset form to initial state
//   const handleReset = () => {
//     setFormData(INITIAL_FORM_DATA);
//     setErrors({});
//     if (signatureRef.current) {
//       signatureRef.current.clear();
//     }
//     setProgress(0);
    
//     toast.info('Form has been reset', {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true
//     });
//   };

//   // Print form
//   const handlePrint = () => {
//     window.print();
//   };

//   // Download form as Excel
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
//     const data = new Blob([excelBuffer], { 
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//     });
    
//     const url = window.URL.createObjectURL(data);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `consultation_${formData.clientId || 'form'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
    
//     toast.success('Form downloaded as Excel', {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true
//     });
//   };

//   // Calculate BMI manually
//   const calculateBMI = () => {
//     if (formData.height && formData.weight) {
//       const heightInMeters = parseFloat(formData.height) / 100;
//       const weightInKg = parseFloat(formData.weight);
//       if (heightInMeters > 0 && weightInKg > 0) {
//         const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
//         setFormData(prev => ({ ...prev, bmi: bmiValue }));
//       }
//     } else {
//       toast.warn('Please enter both height and weight to calculate BMI', {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       });
//     }
//   };

//   return (
//     <div className="consultation-form-container" ref={formRef}>
//       <ToastContainer />
//       <div className="form-header">
//         <img 
//           src={Logo} 
//           alt="Eloraa Clinic Logo" 
//           className="clinic-logo" 
//           draggable="false" 
//           aria-hidden="true"
//         />
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
//         <div 
//           className="progress-fill" 
//           style={{ width: `${progress}%` }}
//           role="progressbar"
//           aria-valuenow={progress}
//           aria-valuemin="0"
//           aria-valuemax="100"
//         >
//           <span className="sr-only">{progress}% complete</span>
//         </div>
//       </div>
      
//       <h1 className="form-title">CONSULTATION SHEET</h1>
      
//       <form onSubmit={handleSubmit} noValidate>
//         {/* Basic Information Section */}
//         <fieldset className="form-section">
//           <legend className="section-title">Basic Information</legend>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="consultingDoctor" className="form-label">
//                 Consulting Doctor: {errors.consultingDoctor && (
//                   <span className="form-error" role="alert">{errors.consultingDoctor}</span>
//                 )}
//               </label>
//               <input
//                 type="text"
//                 id="consultingDoctor"
//                 name="consultingDoctor"
//                 value={formData.consultingDoctor}
//                 onChange={handleChange}
//                 className={`form-input ${errors.consultingDoctor ? 'input-error' : ''}`}
//                 placeholder="Enter doctor's name"
//                 aria-required="true"
//                 aria-invalid={!!errors.consultingDoctor}
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="date" className="form-label">
//                 Date: {errors.date && (
//                   <span className="form-error" role="alert">{errors.date}</span>
//                 )}
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
//                 Client ID: {errors.clientId && (
//                   <span className="form-error" role="alert">{errors.clientId}</span>
//                 )}
//               </label>
//               <input
//                 type="text"
//                 id="clientId"
//                 name="clientId"
//                 value={formData.clientId}
//                 onChange={handleChange}
//                 className={`form-input ${errors.clientId ? 'input-error' : ''}`}
//                 placeholder="Enter client ID"
//                 aria-required="true"
//                 aria-invalid={!!errors.clientId}
//               />
//             </div>
//           </div>
          
//           <div className="form-instruction">
//             Kindly answer the following questions to the best of your knowledge to have a better 
//             understanding of your health, enabling us to formulate the right course of treatment for you.
//           </div>
//         </fieldset>

//         {/* Personal Details Section */}
//         <fieldset className="form-section">
//           <legend className="section-title">Personal Details</legend>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="name" className="form-label">
//                 Full Name: {errors.name && (
//                   <span className="form-error" role="alert">{errors.name}</span>
//                 )}
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
//               <label htmlFor="age" className="form-label">
//                 Age: {errors.age && (
//                   <span className="form-error" role="alert">{errors.age}</span>
//                 )}
//               </label>
//               <input
//                 type="number"
//                 id="age"
//                 name="age"
//                 value={formData.age}
//                 onChange={handleChange}
//                 className={`form-input ${errors.age ? 'input-error' : ''}`}
//                 placeholder="Enter age"
//                 min="1"
//                 max="120"
//                 aria-required="true"
//                 aria-invalid={!!errors.age}
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="dob" className="form-label">
//                 Date of Birth: {errors.dob && (
//                   <span className="form-error" role="alert">{errors.dob}</span>
//                 )}
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
//           </div>
          
//           <div className="form-row">
//             <div className="form-group">
//               <fieldset className="radio-fieldset">
//                 <legend className="radio-legend">Sex:</legend>
//                 <div className="radio-group">
//                   <label>
//                     <input
//                       type="radio"
//                       name="sex"
//                       value="F"
//                       checked={formData.sex === 'F'}
//                       onChange={handleChange}
//                       aria-checked={formData.sex === 'F'}
//                     /> Female
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       name="sex"
//                       value="M"
//                       checked={formData.sex === 'M'}
//                       onChange={handleChange}
//                       aria-checked={formData.sex === 'M'}
//                     /> Male
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       name="sex"
//                       value="Others"
//                       checked={formData.sex === 'Others'}
//                       onChange={handleChange}
//                       aria-checked={formData.sex === 'Others'}
//                     /> Others
//                   </label>
//                 </div>
//               </fieldset>
//             </div>
            
//             <div className="form-group">
//               <fieldset className="radio-fieldset">
//                 <legend className="radio-legend">Marital Status:</legend>
//                 <div className="radio-group">
//                   <label>
//                     <input
//                       type="radio"
//                       name="maritalStatus"
//                       value="Single"
//                       checked={formData.maritalStatus === 'Single'}
//                       onChange={handleChange}
//                       aria-checked={formData.maritalStatus === 'Single'}
//                     /> Single
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       name="maritalStatus"
//                       value="Married"
//                       checked={formData.maritalStatus === 'Married'}
//                       onChange={handleChange}
//                       aria-checked={formData.maritalStatus === 'Married'}
//                     /> Married
//                   </label>
//                 </div>
//               </fieldset>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="height" className="form-label">
//                 Height (cm):
//               </label>
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
//               <label htmlFor="weight" className="form-label">
//                 Weight (kg):
//               </label>
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
//                 <button
//                   type="button"
//                   className="calculate-button"
//                   onClick={calculateBMI}
//                   aria-label="Calculate BMI"
//                 >
//                   <FaCalculator />
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="profession" className="form-label">
//               Profession:
//             </label>
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
//                 Mobile: {errors.mobile && (
//                   <span className="form-error" role="alert">{errors.mobile}</span>
//                 )}
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
//                 Email: {errors.email && (
//                   <span className="form-error" role="alert">{errors.email}</span>
//                 )}
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
//             <label htmlFor="address" className="form-label">
//               Address:
//             </label>
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

//         {/* How Did You Know Section */}
//         <fieldset className="form-section">
//           <legend className="section-title">How did you know about Eloraa Cliniq</legend>
          
//           <div className="radio-group">
//             <label>
//               <input
//                 type="radio"
//                 name="howKnow"
//                 value="Google"
//                 checked={formData.howKnow === 'Google'}
//                 onChange={handleChange}
//                 aria-checked={formData.howKnow === 'Google'}
//               /> Google
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="howKnow"
//                 value="Facebook"
//                 checked={formData.howKnow === 'Facebook'}
//                 onChange={handleChange}
//                 aria-checked={formData.howKnow === 'Facebook'}
//               /> Facebook
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="howKnow"
//                 value="Instagram"
//                 checked={formData.howKnow === 'Instagram'}
//                 onChange={handleChange}
//                 aria-checked={formData.howKnow === 'Instagram'}
//               /> Instagram
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="howKnow"
//                 value="Board"
//                 checked={formData.howKnow === 'Board'}
//                 onChange={handleChange}
//                 aria-checked={formData.howKnow === 'Board'}
//               /> Board
//             </label>
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="referenceName" className="form-label">
//               Reference, specify name:
//             </label>
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
//             <label htmlFor="otherSource" className="form-label">
//               Other, please specify:
//             </label>
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

//         {/* Concerns Section */}
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
//             <label htmlFor="otherIssue" className="form-label">
//               Any Other, Specify:
//             </label>
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
//             <label htmlFor="medications" className="form-label">
//               Any Medications or Treatment Taken So Far for the Above Problem:
//             </label>
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

//         {/* Health Section */}
//         <fieldset className="form-section">
//           <legend className="section-title">General Health</legend>
          
//           <div className="form-group">
//             <label htmlFor="generalHealth" className="form-label">
//               Health Issues (Diabetes, Hypertension, Thyroid PCOD):
//             </label>
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
//             <label htmlFor="medicationsHealth" className="form-label">
//               Any Medications for the Above Problem:
//             </label>
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
//             <label htmlFor="allergies" className="form-label">
//               Any Allergies (Food/Medication):
//             </label>
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

//         {/* Lifestyle Section */}
//         <fieldset className="form-section">
//           <legend className="section-title">Lifestyle</legend>
          
//           <div className="form-group">
//             <label>
//               <input
//                 type="checkbox"
//                 name="lifestyleSmoke"
//                 checked={formData.lifestyleSmoke}
//                 onChange={handleChange}
//                 aria-checked={formData.lifestyleSmoke}
//               /> Do you smoke:
//             </label>
            
//             {formData.lifestyleSmoke && (
//               <div className="form-row nested-fields">
//                 <div className="form-group">
//                   <label htmlFor="smokeQty" className="form-label">
//                     If yes, how many cigarettes a day:
//                   </label>
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
//                   <label htmlFor="smokeYears" className="form-label">
//                     Since:
//                   </label>
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
//               <input
//                 type="checkbox"
//                 name="lifestyleAlcohol"
//                 checked={formData.lifestyleAlcohol}
//                 onChange={handleChange}
//                 aria-checked={formData.lifestyleAlcohol}
//               /> Do you consume alcohol:
//             </label>
            
//             {formData.lifestyleAlcohol && (
//               <div className="form-row nested-fields">
//                 <div className="form-group">
//                   <label htmlFor="alcoholQty" className="form-label">
//                     If yes, how many:
//                   </label>
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
//                   <label htmlFor="alcoholFreq" className="form-label">
//                     Times a week:
//                   </label>
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
//                   <input
//                     type="radio"
//                     name="sunlightExposure"
//                     value="Mild"
//                     checked={formData.sunlightExposure === 'Mild'}
//                     onChange={handleChange}
//                     aria-checked={formData.sunlightExposure === 'Mild'}
//                   /> Mild
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name="sunlightExposure"
//                     value="Moderate"
//                     checked={formData.sunlightExposure === 'Moderate'}
//                     onChange={handleChange}
//                     aria-checked={formData.sunlightExposure === 'Moderate'}
//                   /> Moderate
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name="sunlightExposure"
//                     value="Severe"
//                     checked={formData.sunlightExposure === 'Severe'}
//                     onChange={handleChange}
//                     aria-checked={formData.sunlightExposure === 'Severe'}
//                   /> Severe
//                 </label>
//               </div>
//             </fieldset>
//           </div>
          
//           <div className="form-group">
//             <label>
//               <input
//                 type="checkbox"
//                 name="exercise"
//                 checked={formData.exercise}
//                 onChange={handleChange}
//                 aria-checked={formData.exercise}
//               /> Do you Exercise Frequently:
//             </label>
//           </div>
          
//           <div className="form-group">
//             <label>
//               <input
//                 type="checkbox"
//                 name="strictDiet"
//                 checked={formData.strictDiet}
//                 onChange={handleChange}
//                 aria-checked={formData.strictDiet}
//               /> Do you follow Strict Diet:
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
//                   <input
//                     type="radio"
//                     name="dietType"
//                     value="Vegetarian"
//                     checked={formData.dietType === 'Vegetarian'}
//                     onChange={handleChange}
//                     aria-checked={formData.dietType === 'Vegetarian'}
//                   /> Vegetarian
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name="dietType"
//                     value="Non-Vegetarian"
//                     checked={formData.dietType === 'Non-Vegetarian'}
//                     onChange={handleChange}
//                     aria-checked={formData.dietType === 'Non-Vegetarian'}
//                   /> Non-Vegetarian
//                 </label>
//               </div>
//             </fieldset>
//           </div>
//         </fieldset>

//         {/* Declaration Section */}
//         <fieldset className="form-section">
//           <legend className="section-title">Declaration</legend>
          
//           <p className="declaration">
//             I hereby declare that the above mentioned information is accurate to the best of my knowledge
//           </p>
          
//           <div className="form-group">
//             <label>
//               <input
//                 type="checkbox"
//                 name="photoRelease"
//                 checked={formData.photoRelease}
//                 onChange={handleChange}
//                 aria-checked={formData.photoRelease}
//               /> Use of photography and video release for promotion and advertising activities:
//             </label>
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="signature" className="form-label">
//               Client's Signature:
//             </label>
//             <div className="signature-container">
//               <SignatureCanvas
//                 ref={signatureRef}
//                 canvasProps={{ 
//                   className: 'signature-pad',
//                   id: 'signature',
//                   'aria-label': 'Signature pad'
//                 }}
//               />
//             </div>
//             <button
//               type="button"
//               className="clear-signature"
//               onClick={() => signatureRef.current.clear()}
//               aria-label="Clear signature"
//             >
//               Clear Signature
//             </button>
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="notes" className="form-label">
//               Notes:
//             </label>
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

//         {/* Form Actions */}
//         <div className="form-actions">
//           <button
//             type="submit"
//             className="submit-button"
//             disabled={isSubmitting}
//             aria-label="Save Consultation"
//             aria-busy={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <span className="loading-spinner" aria-hidden="true"></span>
//                 Saving...
//               </>
//             ) : 'Save Consultation'}
//           </button>
          
//           <div className="action-buttons">
//             <button
//               type="button"
//               onClick={handlePrint}
//               className="print-button"
//               aria-label="Print Form"
//             >
//               <FaPrint aria-hidden="true" /> Print
//             </button>
            
//             <button
//               type="button"
//               onClick={handleDownload}
//               className="download-button"
//               aria-label="Download Excel"
//             >
//               <FaDownload aria-hidden="true" /> Download Excel
//             </button>
            
//             <button
//               type="button"
//               onClick={handleReset}
//               className="reset-button"
//               aria-label="Reset Form"
//             >
//               <FaRedo aria-hidden="true" /> Reset
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ConsultationForm;


import React, { useState, useRef, useEffect, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FaPrint, FaDownload, FaRedo, FaInfoCircle, FaMapMarkerAlt, FaPhone, FaCalculator } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './consultationForm.css';
import Logo from '../assets/images/logo.png';

import { submitConsultationForm } from '../services/api';


// Constants for better maintainability
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
  consultingDoctor: '',
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

  const requiredFields = ['consultingDoctor', 'date', 'clientId', 'name', 'age', 'dob', 'mobile', 'email'];

  // Calculate BMI when height or weight changes
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

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      if (dobDate > new Date()) {
        newErrors.dob = 'Date of birth cannot be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Calculate form completion progress
  const calculateProgress = useCallback(() => {
    const totalFields = Object.keys(formData).length - 1; // exclude signature
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    
    if (type === 'checkbox') {
      if (name === 'concerns') {
        newValue = checked
          ? [...formData.concerns, value]
          : formData.concerns.filter(item => item !== value);
      } else if (name === 'skincareRoutine') {
        newValue = checked
          ? [...formData.skincareRoutine, value]
          : formData.skincareRoutine.filter(item => item !== value);
      } else {
        newValue = checked;
      }
    } else if (type === 'number') {
      newValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

//   // Handle form submission
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
     console.log('Final Data to Submit:', finalData);

    const response = await submitConsultationForm(finalData);

    toast.success('Form submitted successfully!');
    handleReset();
    
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to submit form. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
  // Reset form to initial state
  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
    setProgress(0);
    
    toast.info('Form has been reset', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  // Print form
  const handlePrint = () => {
    window.print();
  };

  // Download form as Excel
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
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `consultation_${formData.clientId || 'form'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Form downloaded as Excel', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  // Calculate BMI manually
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setFormData(prev => ({ ...prev, bmi: bmiValue }));
      }
    } else {
      toast.warn('Please enter both height and weight to calculate BMI', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  return (
    <div className="consultation-form-container" ref={formRef}>
      <ToastContainer />
      <div className="form-header">
        <img 
          src={Logo} 
          alt="Eloraa Clinic Logo" 
          className="clinic-logo" 
          draggable="false" 
          aria-hidden="true"
        />
        <div className="clinic-address">
          <div className="address-item">
            <FaMapMarkerAlt className="address-icon" aria-hidden="true" />
            <span>110, Arcot Road, Opposite Jains Swarnokamol Apartments, Saligramam, Chennai - 600093</span>
          </div>
          <div className="address-item">
            <FaPhone className="address-icon" aria-hidden="true" />
            <span>+91 76049 89898 | +91 44 4215 9898</span>
          </div>
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span className="sr-only">{progress}% complete</span>
        </div>
      </div>
      
      <h1 className="form-title">CONSULTATION SHEET</h1>
      
      <form onSubmit={handleSubmit} noValidate>
        {/* Basic Information Section */}
        <fieldset className="form-section">
          <legend className="section-title">Basic Information</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="consultingDoctor" className="form-label">
                Consulting Doctor: {errors.consultingDoctor && (
                  <span className="form-error" role="alert">{errors.consultingDoctor}</span>
                )}
              </label>
              <input
                type="text"
                id="consultingDoctor"
                name="consultingDoctor"
                value={formData.consultingDoctor}
                onChange={handleChange}
                className={`form-input ${errors.consultingDoctor ? 'input-error' : ''}`}
                placeholder="Enter doctor's name"
                aria-required="true"
                aria-invalid={!!errors.consultingDoctor}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date: {errors.date && (
                  <span className="form-error" role="alert">{errors.date}</span>
                )}
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`form-input ${errors.date ? 'input-error' : ''}`}
                aria-required="true"
                aria-invalid={!!errors.date}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="clientId" className="form-label">
                Client ID: {errors.clientId && (
                  <span className="form-error" role="alert">{errors.clientId}</span>
                )}
              </label>
              <input
                type="text"
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className={`form-input ${errors.clientId ? 'input-error' : ''}`}
                placeholder="Enter client ID"
                aria-required="true"
                aria-invalid={!!errors.clientId}
              />
            </div>
          </div>
          
          <div className="form-instruction">
            Kindly answer the following questions to the best of your knowledge to have a better 
            understanding of your health, enabling us to formulate the right course of treatment for you.
          </div>
        </fieldset>

        {/* Personal Details Section */}
        <fieldset className="form-section">
          <legend className="section-title">Personal Details</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name: {errors.name && (
                  <span className="form-error" role="alert">{errors.name}</span>
                )}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter full name"
                aria-required="true"
                aria-invalid={!!errors.name}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="age" className="form-label">
                Age: {errors.age && (
                  <span className="form-error" role="alert">{errors.age}</span>
                )}
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`form-input ${errors.age ? 'input-error' : ''}`}
                placeholder="Enter age"
                min="1"
                max="120"
                aria-required="true"
                aria-invalid={!!errors.age}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dob" className="form-label">
                Date of Birth: {errors.dob && (
                  <span className="form-error" role="alert">{errors.dob}</span>
                )}
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`form-input ${errors.dob ? 'input-error' : ''}`}
                aria-required="true"
                aria-invalid={!!errors.dob}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <fieldset className="radio-fieldset">
                <legend className="radio-legend">Sex:</legend>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="sex"
                      value="F"
                      checked={formData.sex === 'F'}
                      onChange={handleChange}
                      aria-checked={formData.sex === 'F'}
                    /> Female
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="sex"
                      value="M"
                      checked={formData.sex === 'M'}
                      onChange={handleChange}
                      aria-checked={formData.sex === 'M'}
                    /> Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="sex"
                      value="Others"
                      checked={formData.sex === 'Others'}
                      onChange={handleChange}
                      aria-checked={formData.sex === 'Others'}
                    /> Others
                  </label>
                </div>
              </fieldset>
            </div>
            
            <div className="form-group">
              <fieldset className="radio-fieldset">
                <legend className="radio-legend">Marital Status:</legend>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="Single"
                      checked={formData.maritalStatus === 'Single'}
                      onChange={handleChange}
                      aria-checked={formData.maritalStatus === 'Single'}
                    /> Single
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="Married"
                      checked={formData.maritalStatus === 'Married'}
                      onChange={handleChange}
                      aria-checked={formData.maritalStatus === 'Married'}
                    /> Married
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height" className="form-label">
                Height (cm):
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 170"
                min="100"
                max="250"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="weight" className="form-label">
                Weight (kg):
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 70"
                min="20"
                max="200"
                step="0.1"
              />
            </div>
            
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
          
          <div className="form-group">
            <label htmlFor="profession" className="form-label">
              Profession:
            </label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter profession"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mobile" className="form-label">
                Mobile: {errors.mobile && (
                  <span className="form-error" role="alert">{errors.mobile}</span>
                )}
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`form-input ${errors.mobile ? 'input-error' : ''}`}
                placeholder="Enter 10-digit mobile number"
                pattern="[0-9]{10}"
                aria-required="true"
                aria-invalid={!!errors.mobile}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email: {errors.email && (
                  <span className="form-error" role="alert">{errors.email}</span>
                )}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter email address"
                aria-required="true"
                aria-invalid={!!errors.email}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address:
            </label>
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

        {/* How Did You Know Section */}
        <fieldset className="form-section">
          <legend className="section-title">How did you know about Eloraa Cliniq</legend>
          
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="howKnow"
                value="Google"
                checked={formData.howKnow === 'Google'}
                onChange={handleChange}
                aria-checked={formData.howKnow === 'Google'}
              /> Google
            </label>
            <label>
              <input
                type="radio"
                name="howKnow"
                value="Facebook"
                checked={formData.howKnow === 'Facebook'}
                onChange={handleChange}
                aria-checked={formData.howKnow === 'Facebook'}
              /> Facebook
            </label>
            <label>
              <input
                type="radio"
                name="howKnow"
                value="Instagram"
                checked={formData.howKnow === 'Instagram'}
                onChange={handleChange}
                aria-checked={formData.howKnow === 'Instagram'}
              /> Instagram
            </label>
            <label>
              <input
                type="radio"
                name="howKnow"
                value="Board"
                checked={formData.howKnow === 'Board'}
                onChange={handleChange}
                aria-checked={formData.howKnow === 'Board'}
              /> Board
            </label>
          </div>
          
          <div className="form-group">
            <label htmlFor="referenceName" className="form-label">
              Reference, specify name:
            </label>
            <input
              type="text"
              id="referenceName"
              name="referenceName"
              value={formData.referenceName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter reference name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="otherSource" className="form-label">
              Other, please specify:
            </label>
            <input
              type="text"
              id="otherSource"
              name="otherSource"
              value={formData.otherSource}
              onChange={handleChange}
              className="form-input"
              placeholder="Specify other source"
            />
          </div>
        </fieldset>

        {/* Concerns Section */}
        <fieldset className="form-section">
          <legend className="section-title">What brings you to Eloraa Cliniq</legend>
          
          <div className="checkbox-grid">
            {CONCERNS_OPTIONS.map(option => (
              <label key={option.id}>
                <input
                  type="checkbox"
                  name="concerns"
                  value={option.id}
                  checked={formData.concerns.includes(option.id)}
                  onChange={handleChange}
                  aria-checked={formData.concerns.includes(option.id)}
                /> {option.label}
              </label>
            ))}
          </div>
          
          <div className="form-group">
            <label htmlFor="otherIssue" className="form-label">
              Any Other, Specify:
            </label>
            <input
              type="text"
              id="otherIssue"
              name="otherIssue"
              value={formData.otherIssue}
              onChange={handleChange}
              className="form-input"
              placeholder="Specify other issues"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="medications" className="form-label">
              Any Medications or Treatment Taken So Far for the Above Problem:
            </label>
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

        {/* Health Section */}
        <fieldset className="form-section">
          <legend className="section-title">General Health</legend>
          
          <div className="form-group">
            <label htmlFor="generalHealth" className="form-label">
              Health Issues (Diabetes, Hypertension, Thyroid PCOD):
            </label>
            <input
              type="text"
              id="generalHealth"
              name="generalHealth"
              value={formData.generalHealth}
              onChange={handleChange}
              className="form-input"
              placeholder="List health issues"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="medicationsHealth" className="form-label">
              Any Medications for the Above Problem:
            </label>
            <input
              type="text"
              id="medicationsHealth"
              name="medicationsHealth"
              value={formData.medicationsHealth}
              onChange={handleChange}
              className="form-input"
              placeholder="List medications"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="allergies" className="form-label">
              Any Allergies (Food/Medication):
            </label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="form-input"
              placeholder="List allergies"
            />
          </div>
        </fieldset>

        {/* Lifestyle Section */}
        <fieldset className="form-section">
          <legend className="section-title">Lifestyle</legend>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="lifestyleSmoke"
                checked={formData.lifestyleSmoke}
                onChange={handleChange}
                aria-checked={formData.lifestyleSmoke}
              /> Do you smoke:
            </label>
            
            {formData.lifestyleSmoke && (
              <div className="form-row nested-fields">
                <div className="form-group">
                  <label htmlFor="smokeQty" className="form-label">
                    If yes, how many cigarettes a day:
                  </label>
                  <input
                    type="number"
                    id="smokeQty"
                    name="smokeQty"
                    value={formData.smokeQty}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., 5"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="smokeYears" className="form-label">
                    Since:
                  </label>
                  <input
                    type="text"
                    id="smokeYears"
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
            <label>
              <input
                type="checkbox"
                name="lifestyleAlcohol"
                checked={formData.lifestyleAlcohol}
                onChange={handleChange}
                aria-checked={formData.lifestyleAlcohol}
              /> Do you consume alcohol:
            </label>
            
            {formData.lifestyleAlcohol && (
              <div className="form-row nested-fields">
                <div className="form-group">
                  <label htmlFor="alcoholQty" className="form-label">
                    If yes, how many:
                  </label>
                  <input
                    type="text"
                    id="alcoholQty"
                    name="alcoholQty"
                    value={formData.alcoholQty}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., 2 drinks"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="alcoholFreq" className="form-label">
                    Times a week:
                  </label>
                  <input
                    type="text"
                    id="alcoholFreq"
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
          
          <div className="form-group">
            <fieldset className="radio-fieldset">
              <legend className="radio-legend">Sunlight Exposure:</legend>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="sunlightExposure"
                    value="Mild"
                    checked={formData.sunlightExposure === 'Mild'}
                    onChange={handleChange}
                    aria-checked={formData.sunlightExposure === 'Mild'}
                  /> Mild
                </label>
                <label>
                  <input
                    type="radio"
                    name="sunlightExposure"
                    value="Moderate"
                    checked={formData.sunlightExposure === 'Moderate'}
                    onChange={handleChange}
                    aria-checked={formData.sunlightExposure === 'Moderate'}
                  /> Moderate
                </label>
                <label>
                  <input
                    type="radio"
                    name="sunlightExposure"
                    value="Severe"
                    checked={formData.sunlightExposure === 'Severe'}
                    onChange={handleChange}
                    aria-checked={formData.sunlightExposure === 'Severe'}
                  /> Severe
                </label>
              </div>
            </fieldset>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="exercise"
                checked={formData.exercise}
                onChange={handleChange}
                aria-checked={formData.exercise}
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
                aria-checked={formData.strictDiet}
              /> Do you follow Strict Diet:
            </label>
          </div>
          
          <div className="form-group">
            <fieldset className="checkbox-fieldset">
              <legend className="checkbox-legend">Your Current Skin Care Routine:</legend>
              <div className="checkbox-grid">
                {SKINCARE_ROUTINE_OPTIONS.map(option => (
                  <label key={option.id}>
                    <input
                      type="checkbox"
                      name="skincareRoutine"
                      value={option.id}
                      checked={formData.skincareRoutine.includes(option.id)}
                      onChange={handleChange}
                      aria-checked={formData.skincareRoutine.includes(option.id)}
                    /> {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          
          <div className="form-group">
            <fieldset className="radio-fieldset">
              <legend className="radio-legend">Are you a:</legend>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="dietType"
                    value="Vegetarian"
                    checked={formData.dietType === 'Vegetarian'}
                    onChange={handleChange}
                    aria-checked={formData.dietType === 'Vegetarian'}
                  /> Vegetarian
                </label>
                <label>
                  <input
                    type="radio"
                    name="dietType"
                    value="Non-Vegetarian"
                    checked={formData.dietType === 'Non-Vegetarian'}
                    onChange={handleChange}
                    aria-checked={formData.dietType === 'Non-Vegetarian'}
                  /> Non-Vegetarian
                </label>
              </div>
            </fieldset>
          </div>
        </fieldset>

        {/* Declaration Section */}
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
                aria-checked={formData.photoRelease}
              /> Use of photography and video release for promotion and advertising activities:
            </label>
          </div>
          
          <div className="form-group">
            <label htmlFor="signature" className="form-label">
              Client's Signature:
            </label>
            <div className="signature-container">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{ 
                  className: 'signature-pad',
                  id: 'signature',
                  'aria-label': 'Signature pad'
                }}
              />
            </div>
            <button
              type="button"
              className="clear-signature"
              onClick={() => signatureRef.current.clear()}
              aria-label="Clear signature"
            >
              Clear Signature
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes:
            </label>
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

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            aria-label="Save Consultation"
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
              aria-label="Print Form"
            >
              <FaPrint aria-hidden="true" /> Print
            </button>
            
            <button
              type="button"
              onClick={handleDownload}
              className="download-button"
              aria-label="Download Excel"
            >
              <FaDownload aria-hidden="true" /> Download Excel
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="reset-button"
              aria-label="Reset Form"
            >
              <FaRedo aria-hidden="true" /> Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;
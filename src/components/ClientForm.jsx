import React, { useState } from 'react';
import { validateForm } from '../utils/formValidation';
import './clientForm.css';
import '../styles/form.css';

const ClientForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="form-container client-form">
      <h2>{initialData.id ? 'Edit Client' : 'Add Client'}</h2>
      <div>
        <label className="form-label">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>
      <div>
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>
      <div>
        <label className="form-label">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="form-input"
        />
        {errors.phone && <p className="form-error">{errors.phone}</p>}
      </div>
      <button onClick={handleSubmit} className="form-button">
        {initialData.id ? 'Update Client' : 'Add Client'}
      </button>
    </div>
  );
};

export default ClientForm;
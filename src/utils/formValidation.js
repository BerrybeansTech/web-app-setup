export const validateForm = (formData) => {
  const errors = {};
  if (!formData.name) errors.name = 'Name is required';
  if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email is required';
  if (!formData.phone) errors.phone = 'Phone is required';
  return errors;
};
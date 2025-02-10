const validateField = (value, validators, row) => {
  const errors = [];
  validators.forEach((validator) => {
    const error = validator(value, row);
    if (error) {
      errors.push(error);
    }
  });
  return errors;
};

const validators = {
  'First Name': [(value) => (!value ? 'First Name is missing' : null)],
  'Last Name': [(value) => (!value ? 'Last Name is missing' : null)],
  Email: [
    (value) => (!value ? 'Email is missing' : null),
    (value) =>
      value && !/\S+@\S+\.\S+/.test(value) ? 'Enter a valid email' : null,
  ],
  'Phone Number': [
    (value) =>
      value && value.length !== 11 ? 'Phone number must be of 11 digits' : null,
  ],
  'Mobile Number': [
    (value) =>
      value && value.length !== 11
        ? 'Mobile number must be of 11 digits'
        : null,
  ],
  Title: [(value) => (!value ? 'Job Title is missing' : null)],
  Location: [(value) => (!value ? 'Location is missing' : null)],
  Department: [(value) => (!value ? 'Department is missing' : null)],
  Language: [(value) => (!value ? 'Language is missing' : null)],
  'Employee Start Date': [(value) => (!value ? 'Start date is missing' : null)],
  'Termination Date': [
    (value, row) =>
      value && new Date(value) <= new Date(row['Employee Start Date'])
        ? 'End date must be after start date'
        : null,
  ],
};

module.exports = { validateField, validators };

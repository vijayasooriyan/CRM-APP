// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (basic - digits and common phone symbols)
const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
};

// Lead source validation
const validateLeadSource = (source) => {
  const validSources = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];
  return validSources.includes(source);
};

// Status validation
const validateStatus = (status) => {
  const validStatuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
  return validStatuses.includes(status);
};

module.exports = {
  validateEmail,
  validatePhone,
  validateLeadSource,
  validateStatus,
};

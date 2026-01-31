const validator = require("validator");

const adminValidate = (data) => {
  const { firstName, lastName, emailId, password } = data;

  // Required fields
  if (!firstName || !emailId || !password) {
    throw new Error("Required fields missing");
  }

  // Sanitize email
  const cleanEmail = emailId.trim().toLowerCase();

  if (!validator.isEmail(cleanEmail)) {
    throw new Error("Invalid Email");
  }

  // Strong password
  if (!validator.isStrongPassword(password)) {
    throw new Error("Weak Password");
  }

  // First name validation
  if (firstName.trim().length < 2 || firstName.trim().length > 40) {
    throw new Error("First name should be between 2-40 characters");
  }

  // Optional last name validation
  if (lastName && lastName.trim().length > 40) {
    throw new Error("Last name too long");
  }
};

module.exports = adminValidate;

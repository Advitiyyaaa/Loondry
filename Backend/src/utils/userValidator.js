const validator = require("validator");

const userValidate = (data) => {
  const { firstName, emailId, password, bagNo } = data;

  // Required fields check (not exact keys)
  if (!firstName || !emailId || !password || bagNo === undefined) {
    throw new Error("Required fields missing");
  }

  // Trim & normalize
  const cleanEmail = emailId.trim().toLowerCase();

  if (!validator.isEmail(cleanEmail)) {
    throw new Error("Invalid Email");
  }

  // Bennett email rule
  if (!cleanEmail.endsWith("@bennett.edu.in")) {
    throw new Error("Only college email addresses are allowed");
  }

  // Strong password
  if (!validator.isStrongPassword(password)) {
    throw new Error("Weak Password");
  }

  // Name length
  if (firstName.trim().length < 2 || firstName.trim().length > 40) {
    throw new Error("Name should be between 2-40 characters");
  }

  // Proper bag number validation
  const bag = Number(bagNo);
  if (isNaN(bag) || bag <= 0) {
    throw new Error("Invalid Bag Number");
  }
};

module.exports = userValidate;

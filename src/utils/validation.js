const validator = require("validator");

let validateSignUpData = (data) => {
  const { firstName, lastName, email, password } = data || {};

  if (!firstName || !lastName) {
    throw new Error("Please enter firstName and lastName");
  } else if (!email || !validator.isEmail(email)) {
    throw new Error("Please enter valid email");
  } 
  else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

module.exports = validateSignUpData

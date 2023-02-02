import { MAX_NAME_CHARS, PASSWORD_LENGTH } from '../config';

const emailIsValid = (email) => {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
};

const FieldsValidated = (name, email, password = null, confirmPass = null) => {
  if (name === '' || email === '') {
    return {
      success: false,
      message: 'Please fill up the required fields',
    };
  }

  if (name.length > MAX_NAME_CHARS) {
    return {
      success: false,
      message: `Name cannot contain more than ${MAX_NAME_CHARS} characters`,
    };
  }

  if (email !== '' && !emailIsValid(email)) {
    return {
      success: false,
      message: `Please enter a valid email`,
    };
  }

  if (password !== null) {
    if (password !== confirmPass) {
      return {
        success: false,
        message: 'Passwords do not match',
      };
    }

    if (password.length < PASSWORD_LENGTH) {
      return {
        success: false,
        message: `Password cannot be less than ${PASSWORD_LENGTH} characters`,
      };
    }
  }

  return { success: true, basicVal: password !== null };
};

export default FieldsValidated;

// 👉 IsEmpty
export const isEmpty = (value: string | number | unknown[] | null | undefined): boolean => {
  // Null, undefined, or empty string
  if (value == null || value === '') return true;

  // Check for strings (trim whitespace)
  if (typeof value === 'string') return value.trim().length === 0;

  // Check for arrays
  if (Array.isArray(value)) return value.length === 0;

  // Numbers are NOT empty (return false)
  if (typeof value === 'number') return false;

  return false; // All other values are considered non-empty
};



// 👉 IsNullOrUndefined
export const isNullOrUndefined = (value: unknown): boolean => {
  return value === null || value === undefined;
}

// 👉 IsEmptyArray
export const isEmptyArray = (arr: unknown[]): boolean => {
  return !arr.length;
}

// 👉 IsObject
export const isObject = (obj: unknown): boolean =>
  obj !== null && typeof obj === 'object' && !Array.isArray(obj);

// 👉 Required Validator
export const requiredValidator = (value: string | string[] | null | undefined): boolean | string => {
  if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
      return 'This field is required';
  }

  return !!String(value).trim().length; // Returns true or false
}

// 👉 Email Validator
export const emailValidator = (value: string | string[]): string | boolean => {
  if (isEmpty(value)) return true;

  const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (Array.isArray(value))
      return (
          value.every((val) => re.test(String(val))) || 'The Email field must be a valid email address'
      );

  return re.test(String(value)) || 'The Email field must be a valid email address';
}

export const usernameValidator = (value: string | string[]): string | boolean => {
  if (isEmpty(value)) return true; // Allow empty value if needed

  // Regular expression for username validation
  const re = /^(?!.*[_.-]{2})[a-zA-Z0-9_.-]{3,20}(?<![_.-])$/;

  if (Array.isArray(value)) {
    return (
      value.every((val) => re.test(String(val))) || 'The Username field must be a valid username'
    );
  }

  return re.test(String(value)) || 'The Username field must be a valid username';
}

// 👉 Password Validator
export const passwordValidator = (password: string): string | boolean => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
  const validPassword = regExp.test(password);

  return (
      validPassword ||
      'The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
  );
}

// 👉 Confirm Password Validator
export const confirmedValidator = (value: string, target: string): string | boolean =>
  value === target || 'The Confirm Password field confirmation does not match';

// 👉 Between Validator
export const betweenValidator = (value: number, min: number, max: number): string | boolean => {
  return (
      (min <= value && max >= value) ||
      `Enter number between ${min} and ${max}`
  );
}

// 👉 Integer Validator
export const integerValidator = (value: string | number | (string | number)[] | null | undefined): string | boolean => {
  if (isEmpty(value)) return true; // Allow empty values

  // If value is an array, validate each element
  if (Array.isArray(value)) {
    return value.every(val => typeof val === 'string' || typeof val === 'number'
      ? /^-?\d+$/.test(String(val)) // Check if it's an integer
      : false
    ) || 'This field must be a number';
  }

  // Handle single value (string or number)
  return /^-?\d+$/.test(String(value)) || 'This field must be a number';
};



// 👉 Regex Validator
export const regexValidator = (value: string | string[], regex: RegExp | string): string | boolean => {
  if (isEmpty(value)) return true;

  const regeX = typeof regex === 'string' ? new RegExp(regex) : regex;
  if (Array.isArray(value)) return value.every((val) => regexValidator(val, regeX));

  return regeX.test(String(value)) || "The input doesn't match the expected format";
}

// 👉 Alpha Validator
export const alphaValidator = (value: string | null | undefined): string | boolean => {
  if (isEmpty(value)) return true;

  return /^[A-Z]*$/i.test(String(value)) || 'The Alpha field may only contain alphabetic characters';
}

// 👉 URL Validator
export const urlValidator = (value: string | null | undefined): string | boolean => {
  if (isEmpty(value)) return true;

  const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}[.]{0,1}/;

  return re.test(String(value)) || 'URL is invalid';
}

// 👉 Length Validator
export const lengthValidator = (value: string | null | undefined, length: number): string | boolean => {
  if (isEmpty(value)) return true;

  return (
      String(value).length >= length ||
      `The Min Character field must be at least ${length} characters`
  );
}

// 👉 Alpha-dash Validator
export const alphaDashValidator = (value: string | null | undefined): string | boolean => {
  if (isEmpty(value)) return true;

  const valueAsString = String(value);

  return (
      /^[0-9A-Z_-]*$/i.test(valueAsString) ||
      'The input must be alphanumeric and can only include dashes (-) and underscores (_).'
  );
}

// 👉 Image Validator
export const imageValidator = (value: FileList | null | undefined): string | boolean => {
  if (!value || value.length === 0) return true; // If value is null, undefined, or empty, it's valid.

  if (value instanceof FileList) {
    const file = value[0]; // Get the first file
    if (file && file.size >= 2000000) {
      return 'Image size should be less than 2 MB';
    }
    return true;
  }

  return 'Invalid input';
};


// 👉 General Date Comparison Validator
export const compareDatesValidator = (
  date1: string,
  date2: string,
  operator: string,
  date1Name = 'first',
  date2Name = 'second'
): string | boolean => {
  if (isEmpty(date1)) return true;

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 'Invalid date input';

  const time1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
  const time2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();

  const messages: Record<string, string> = {
      '===': 'Dates must be exactly the same',
      '==': 'Dates must be equal',
      '!==': 'Dates must not be the same',
      '!=': 'Dates must not be equal',
      '>': `The ${date1Name} date must be later than the ${date2Name} date`,
      '>=': `The ${date1Name} date must be the same or later than the ${date2Name} date`,
      '<': `The ${date1Name} date must be earlier than the ${date2Name} date`,
      '<=': `The ${date1Name} date must be the same or earlier than the ${date2Name} date`
  };

  if (!(operator in messages)) return `Invalid operator: ${operator}`;

  const comparisons: Record<string, boolean> = {
      '===': time1 === time2,
      '==': time1 == time2,
      '!==': time1 !== time2,
      '!=': time1 != time2,
      '>': time1 > time2,
      '>=': time1 >= time2,
      '<': time1 < time2,
      '<=': time1 <= time2
  };

  return comparisons[operator] || messages[operator];
}
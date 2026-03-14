export function isPositiveNumber(value) {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
}

export function validateAgriForm(form) {
  const errors = {};

  if (!isPositiveNumber(form.documented_income)) {
    errors.documented_income = "Enter a valid documented income";
  }

  if (!isPositiveNumber(form.tax)) {
    errors.tax = "Enter a valid tax amount";
  }

  if (!isPositiveNumber(form.undocumented_income_monthly)) {
    errors.undocumented_income_monthly =
      "Enter a valid monthly informal income";
  }

  if (!isPositiveNumber(form.emi_monthly)) {
    errors.emi_monthly = "Enter a valid EMI amount";
  }

  return errors;
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}

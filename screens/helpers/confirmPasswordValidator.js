export function confirmPasswordValidator(password, confirmPassword) {
    return (password.localeCompare(confirmPassword) == 0) ? '' : 'Passwords do not match.'
  }
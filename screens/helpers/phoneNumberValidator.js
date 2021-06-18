export function phoneNumberValidator(phoneNumber) {
    const re = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
    // re expression courtesy of https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
    if (!phoneNumber) return "Phone number can't be empty."
    if (!re.test(phoneNumber)) return 'Ooops! We need a valid phone number.'
    return ''
  }
  
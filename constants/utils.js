import { Platform, StatusBar } from 'react-native';
import { theme } from 'galio-framework';

export const StatusHeight = StatusBar.currentHeight;
export const HeaderHeight = (theme.SIZES.BASE * 3.5 + (StatusHeight || 0));
export const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812);
export const validateContent = (text) => {
    console.log("TEXT IS ", text);
    if(!text) {
        return "Field cannot be blank";
    }
}
// Below helper methods courtesy of https://scottdomes.com/react-native-sexy-forms/
export const validateField = (validators, value) => {
    let error = '';
    validators.forEach((validator) => {
      const validationError = validator(value);
      if (validationError) {
        error = validationError;
      }
    });
    return error;
  };

  export const validateFields = (fields, values) => {
    const errors = {};
    const fieldKeys = Object.keys(fields);
    console.log("Fields are", fields)
    console.log("Values are", values)
    fieldKeys.forEach((key) => {
      const field = fields[key];
      const validators = field.validators;
      const value = values[key];
      if (validators && validators.length > 0) {
        console.log("validating VALUE OF", value);
        const error = validateField(validators, value);
  
        if (error) {
          errors[key] = error;
        }
      }
    });
    console.log("validate fields errors after are", errors)
    return errors;
  };

  export const hasValidationError = (errors) => {
    return Object.values(errors).find((error) => error.length > 0);
  };
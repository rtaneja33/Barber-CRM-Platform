import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Button, Animated } from "react-native";
import { hasValidationError, validateFields } from "../constants/utils";
import {argonTheme} from '../constants';

import CustomField from "./CustomField";
import SubmitFormButton from "./SubmitFormButton";
// import Button  from './Button';
const getInitialState = (fieldKeys) => {
  const state = {};
  fieldKeys.forEach((key) => {
    state[key] = '';
  });

  return state;
};
// example usage: pass fields like so 
{/* <CustomForm
  action = {()=> console.log("performed action!")}
  afterSubmit = {() => console.log("afterSubmit!")}
  buttonText = "Submit"
  fields={{ // renders field with label Email, field with label Password
    email: {
      label: 'Email',
      validators: [validateContent],
      inputProps: {
        keyboardType: 'email-address',
      },
    },
    password: {
      label: 'Password',
      inputProps: {
        secureTextEntry: true,
      },
    },
  }}
/> */}

// shoutout https://scottdomes.com/react-native-sexy-forms/
const CustomForm = ({ fields, buttonText, action, afterSubmit, closeModal, closeModalText }) => {
  const fieldKeys = Object.keys(fields);
  const [values, setValues] = useState(getInitialState(fieldKeys));
  const [validationErrors, setValidationErrors] = useState(
    getInitialState(fieldKeys),
  );
  const [opacity, setOpacity] = useState(new Animated.Value(1))
  useEffect(()=>{
    setOpacity(new Animated.Value(1));
  }, []);
  const onChangeValue = (key, value) => {
    const newState = { ...values, [key]: value };
    setValues(newState);

    if(validationErrors[key]){
      const newErrors = { ...validationErrors, [key]:''}
      setValidationErrors(newErrors)
    }
  };

  const getValues = () => {
    return fieldKeys.sort().map((key) => values[key]);
  }

  const submit = () => {
    setValidationErrors(getInitialState(fieldKeys));
    const errors = validateFields(fields, values);
    if (hasValidationError(errors)) {
      return setValidationErrors(errors);
    }
    const result = action(...getValues()); 
    const afterSubmitResult = afterSubmit(result);
  };
  
  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity }}>
      {fieldKeys.map((key) => {
        const field = fields[key];
        const fieldError = validationErrors[key];
        return (
          <View key={key}>
            <CustomField
              key={key}
              fieldName={key}
              field={fields[key]}
              error={validationErrors[key]}
              onChangeText={onChangeValue}
              value={values[key]}
          />
          </View>
        );
      })}
      </Animated.View>
      {
        closeModal ?
          <SubmitFormButton title={closeModalText} titleStyle={{ color: 'white' }} style={{ marginBottom: 10 ,backgroundColor: argonTheme.COLORS.HEADER}} onPress ={closeModal} />
        :     
          <></>  
      }
      <SubmitFormButton title={buttonText} titleStyle= {{ color: argonTheme.COLORS.HEADER }} style={{ backgroundColor: 'white', borderColor: argonTheme.COLORS.HEADER, borderWidth: 1 }} onPress ={submit} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  error: {
    marginBottom: 20,
    height: 17.5,
  },
});

export default CustomForm;


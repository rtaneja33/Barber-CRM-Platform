import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Button, Animated, Dimensions } from "react-native";
import { hasValidationError, validateFields } from "../constants/utils";
import {argonTheme} from '../constants';
const { width, height } = Dimensions.get("screen");

import OnboardingField from "./OnboardingField";
import SubmitFormButton from "./SubmitFormButton";
// import Button  from './Button';
const getInitialState = (fieldKeys, fields) => {
  const state = {};
  fieldKeys.forEach((key) => {
    state[key] = fields[key].defaultValue || ''; 
  });

  return state;
};

const getInitialErrorsState = (fieldKeys) => {
  const state = {};
  fieldKeys.forEach((key) => {
    state[key] = ''; 
  });

  return state;
};
// example usage: pass fields like so 
{/* <OnboardingForm
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
const OnboardingForm = ({ fields, buttonText, action, afterSubmit, deleteButton, closeModalText }) => {
  const fieldKeys = Object.keys(fields);
  const [values, setValues] = useState(getInitialState(fieldKeys, fields));
  const [validationErrors, setValidationErrors] = useState(
    getInitialErrorsState(fieldKeys),
  );
  const [disabled, setDisabled] = useState(true);
  const [opacity, setOpacity] = useState(new Animated.Value(1))
  useEffect(()=>{
    setOpacity(new Animated.Value(1));
  }, []);
  const onChangeValue = (key, value) => {
    const newState = { ...values, [key]: value };
    setDisabled(false);
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
    setValidationErrors(getInitialErrorsState(fieldKeys));
    const errors = validateFields(fields, values);
    if (hasValidationError(errors)) {
      return setValidationErrors(errors);
    }
    console.log("IN SUBMIT, getvals ios",getValues());
    const result = action(...getValues()); 
   // const afterSubmitResult = afterSubmit(result);
  };
  
  
  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 15}}>
      {fieldKeys.map((key) => {
        const field = fields[key];
        const fieldError = validationErrors[key];
        return (
          <View key={key}>
            <OnboardingField
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
      </View>
      <View style={{ justifyContent:'center', alignItems: 'center'}}>
      <SubmitFormButton disabled={disabled} title={buttonText} titleStyle={{ color: 'white' }} style={ disabled ? styles.disabled : { marginTop: 15 ,backgroundColor: argonTheme.COLORS.HEADER, width: width*0.7}} onPress ={submit} />
      {
        deleteButton ?
          <SubmitFormButton title={closeModalText}  titleStyle= {{ color: argonTheme.COLORS.BARBERRED }}  style={{ backgroundColor: 'white', borderColor: argonTheme.COLORS.BARBERRED, borderWidth: 1 }} onPress ={deleteButton} />
        :     
          <></>  
      }
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
  },
  disabled: {
    marginTop: 15,
    backgroundColor: "#ccc",
    color: "#999",
    width: width*0.7
  },
  error: {
    marginBottom: 20,
    height: 17.5,
  },
});

export default OnboardingForm;


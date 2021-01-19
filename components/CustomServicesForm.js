import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Button, Animated } from "react-native";
import { hasValidationError, validateFields } from "../constants/utils";
import CustomField from "./CustomField";
import _uniqueId from 'lodash'
import SubmitFormButton from "./SubmitFormButton";
// import Button  from './Button';
const getInitialState = (fieldKeys) => {
  const state = {};
  fieldKeys.forEach((key) => {
    state[key] = '';
  });

  return state;
};
// shoutout https://scottdomes.com/react-native-sexy-forms/
const CustomForm = ({ fields, buttonText, action, afterSubmit }) => {
  // const fieldKeys = Object.keys(fields);
  // const [values, setValues] = useState(getInitialState(fieldKeys));
  // const [validationErrors, setValidationErrors] = useState(
  //   getInitialState(fieldKeys),
  // );
  // const onChangeValue = (key, value) => {
  //   const newState = { ...values, [key]: value };
  //   setValues(newState);

  //   if(validationErrors[key]){
  //     const newErrors = { ...validationErrors, [key]:''}
  //     setValidationErrors(newErrors)
  //   }
  // };

  // const getValues = () => {
  //   return fieldKeys.sort().map((key) => values[key]);
  // }

  // const submit = () => {
  //   setValidationErrors(getInitialState(fieldKeys));
  //   const errors = validateFields(fields, values);
  //   if (hasValidationError(errors)) {
  //     return setValidationErrors(errors);
  //   }
  //   const result = action(...getValues()); 
  //   const afterSubmitResult = afterSubmit(result);
  // };
  const [serviceObj, setServiceObj] = React.useState(fields)
  const handleServiceTypeChange = (i, text) => {
    console.log("serviceObj at start of handleChange", serviceObj);
    let items = [...serviceObj];
    let item = {...items[i]};
    item.serviceType = text;
    console.log("text is", text);
    console.log("updated item is", item);
    items[i] = item;
    setServiceObj(items);
  }
  const handleServiceNameChange = (i,j,text) => {
    let items = [...serviceObj];
    let item = {...items[i]};
    item.services[j].serviceName = text;
    items[i] = item;
    console.log("now items are",items)
    setServiceObj(items);
    console.log("value of name in serviceobj is now",serviceObj[i].services[j].serviceName )
    
  }
  const handleServicePriceChange = (i,j,text) => {
    console.log("IN PRICE CHANGE")
    let items = [...serviceObj];
    let item = {...items[i]};
    let itemPrice= {...item.services[j]}
    itemPrice.price = text;
    items[i].services[j] = itemPrice;
    setServiceObj(items);
  }
  
  return (
    <View style={styles.container}>
      <Animated.View>
      {fields.map((servList, i) => {
        return (
          <View>
            <CustomField
              key={servList.serviceType}
              fieldName={"Service Category"}
              field={servList.serviceType}
              error={'um'}
              onChangeText={text => {handleServiceTypeChange(i, text)}}
              value={serviceObj[i].serviceType}
          />
          <View style={{ marginLeft: 20}}>
          {
            servList.services.map((service, j) => {
              const [serviceNameValue, setServiceNameValue] = React.useState(service.serviceName)
              const [servicePriceValue, setServicePriceValue] = React.useState(service.price)
              return(
                <View>
                  <CustomField
                    key={_uniqueId("name-")}
                    fieldName={"Service Name"}
                    field={service.serviceName}
                    error={'um'}
                    onChangeText={text => {handleServiceNameChange(i,j, text)}}
                    value={serviceObj[i].services[j].serviceName}
                />
                <CustomField
                    key={_uniqueId("price-")}
                    fieldName={"Price"}
                    field={service.price}
                    error={'um'}
                    onChangeText={text => {handleServicePriceChange(i,j, text)}}
                    value={serviceObj[i].services[j].price}
                />
                </View>
              )
            })
          }
          </View>
          </View>
        )
      })}
      {/* {fieldKeys.map((key) => {
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
      }
      )} */}
      </Animated.View>
      <SubmitFormButton title={buttonText} style={{ color: 'red'}} /> 
      {/* onPress ={submit} */}
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


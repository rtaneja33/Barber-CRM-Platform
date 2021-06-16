import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Button,
  Animated,
} from "react-native";
import { hasValidationError, validateFields } from "../constants/utils";
import { argonTheme } from "../constants";
import DropDownPicker from "react-native-dropdown-picker";
import CustomField from "./CustomField";
import SubmitFormButton from "./SubmitFormButton";
// import Button  from './Button';
const getInitialState = (fieldKeys, fields) => {
  const state = {};
  fieldKeys.forEach((key) => {
    state[key] = fields[key].defaultValue || "";
  });

  return state;
};

const getInitialErrorsState = (fieldKeys) => {
  const state = {};
  fieldKeys.forEach((key) => {
    state[key] = "";
  });

  return state;
};
// example usage: pass fields like so
{
  /* <CustomForm
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
/> */
}

// shoutout https://scottdomes.com/react-native-sexy-forms/
const CustomForm = ({
  fields,
  buttonText,
  action,
  afterSubmit,
  deleteButton,
  closeModalText,
  dropdownItems,
}) => {
  const [dropdownValue, setDropdownValue] = (dropdownItems && dropdownItems.length > 0) ? useState(dropdownItems[0].label) : useState(null);
  const fieldKeys = Object.keys(fields);
  const [values, setValues] = useState(getInitialState(fieldKeys, fields));
  const [validationErrors, setValidationErrors] = useState(
    getInitialErrorsState(fieldKeys)
  );
  const [disabled, setDisabled] = useState(true);
  const [opacity, setOpacity] = useState(new Animated.Value(1));
  useEffect(() => {
    setOpacity(new Animated.Value(1));
  }, []);
  const onChangeValue = (key, value) => {
    const newState = { ...values, [key]: value };
    setDisabled(false);
    setValues(newState);

    if (validationErrors[key]) {
      const newErrors = { ...validationErrors, [key]: "" };
      setValidationErrors(newErrors);
    }
  };

  const getValues = () => {
    return fieldKeys.sort().map((key) => values[key]);
  };

  const submit = () => {
    setValidationErrors(getInitialErrorsState(fieldKeys));
    const errors = validateFields(fields, values);
    if (hasValidationError(errors)) {
      return setValidationErrors(errors);
    }
    const result = action(values, dropdownValue);//replaced ...getValues()
    const afterSubmitResult = afterSubmit(result);
  };

  return (
    <View style={styles.container}>
      {dropdownItems && dropdownItems.length > 0 ? (
         <View style={styles.inputContainer}>
        <Text style={styles.label}>Service Category* </Text>
        <DropDownPicker
          items={dropdownItems}
          containerStyle={{ width: "100%", marginBottom: 30 }}
          defaultValue={dropdownValue}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{backgroundColor: 'white'}}
          // activeItemStyle={{backgroundColor: 'black'}}
          activeLabelStyle={{
            color: argonTheme.COLORS.HEADER,
            fontWeight: "bold",
          }}
          selectedLabelStyle={{
            color: argonTheme.COLORS.HEADER,
            fontWeight: "bold",
          }}
          onChangeItem={item => {setDropdownValue(item.label); console.log("now dropdownVal is", dropdownValue, "change item was", item.label)}}
        />
        </View>
      ) : (
        <></>
      )}
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

      <SubmitFormButton
        disabled={disabled}
        title={buttonText}
        titleStyle={{ color: "white" }}
        style={
          disabled
            ? styles.disabled
            : { marginBottom: 10, backgroundColor: argonTheme.COLORS.HEADER }
        }
        onPress={submit}
      />
      {deleteButton ? (
        <SubmitFormButton
          title={closeModalText}
          titleStyle={{ color: argonTheme.COLORS.BARBERRED }}
          style={{
            backgroundColor: "white",
            borderColor: argonTheme.COLORS.BARBERRED,
            borderWidth: 1,
          }}
          onPress={deleteButton}
        />
      ) : (
        <></>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  disabled: {
    marginBottom: 10,
    backgroundColor: "#ccc",
    color: "#999",
  },
  error: {
    marginBottom: 20,
    height: 17.5,
  },
  label: {
    color: argonTheme.COLORS.HEADER,
    fontWeight: 'bold',
    marginBottom: 3,
},
inputContainer: {
  width: "100%",
  zIndex: 10,
}
});

export default CustomForm;

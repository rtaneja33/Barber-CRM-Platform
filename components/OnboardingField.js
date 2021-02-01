import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Dimensions } from 'react-native';
import {argonTheme} from '../constants';
const { width, height } = Dimensions.get("screen");
const OnboardingField = ({ fieldName, field, value, onChangeText, error }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{field.label}</Text>
      <TextInput
        style={[styles.input, { 
            borderBottomColor: error ? argonTheme.COLORS.INPUT_ERROR : argonTheme.COLORS.MUTED,
            borderBottomWidth: error ? 2 : 1
        }]} //'#3F5EFB'
        {...field.inputProps}
        value={value}
        onChangeText={(text) => onChangeText(fieldName, text)}
      />
      <Text style={styles.error}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    label: {
        color: argonTheme.COLORS.HEADER,
        fontWeight: 'bold'
    },
    input: {
      width: width*.8,
      fontSize: 20,
      color: '#00000090',
      paddingHorizontal: 3,
      backgroundColor: 'white',
      marginBottom: 5,

    },
    inputContainer: {
      marginBottom: 10,
      width: "100%"
    //   shadowColor: '#000',
    //   shadowOffset: {
    //     width: 0,
    //     height: 2,
    //   },
    //   shadowOpacity: 0.23,
    //   shadowRadius: 2.62,
    //   elevation: 4,
    },
    error: {  height: 17.5, fontSize: 12, color: 'red'},
  });

export default OnboardingField;
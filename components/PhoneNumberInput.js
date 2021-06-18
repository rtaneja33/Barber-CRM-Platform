import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import PhoneInput from "react-native-phone-number-input";
import { argonTheme } from '../constants'
import { theme } from '../core/theme'

export default function PhoneNumberInput({ errorText, description, ...props }) {
  return (
    <View style={styles.container}>
      <PhoneInput
        style={styles.input}
        containerStyle={[{width: '100%'}, errorText ? styles.errorInputContainer : styles.inputContainer]}
        textContainerStyle={styles.textStyle}
        // underlineColor="transparent"
        mode="outlined"
        theme={{ colors: { primary: argonTheme.COLORS.BARBERBLUE  }}}
        {...props}
        defaultCode="US"
        layout="first"
        // onChangeFormattedText={(text) => {
        //   setFormattedValue(text);
        // }}
        
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    },
    inputContainer: {
        borderColor: theme.colors.secondary,
        borderWidth: 1,
        borderRadius: 2,
    },
    textStyle: {
        backgroundColor: theme.colors.surface,
    },
    errorInputContainer: {
        borderColor: theme.colors.error,
        borderWidth: 2
    },
  input: {
    backgroundColor: theme.colors.surface,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
})

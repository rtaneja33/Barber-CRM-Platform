import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import HeaderSpecial from '../components/HeaderSpecial'
import ButtonSpecial from '../components/ButtonSpecial'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from './helpers/emailValidator'
import { passwordValidator } from './helpers/passwordValidator'
import { firebase } from '../src/firebase/config';
import { argonTheme } from '../constants'


export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onLoginPressed = () => {
    console.log("route params isBarber?",route.params.isBarber)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    signinPressed(email.value, password.value)
  }

  const signinPressed = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then((response) => {
         const uid = response.user.uid
            const barberShopsRef = firebase.firestore().collection('BarberShops')
            barberShopsRef
                .doc(uid)
                .get()
                .then(firestoreDocument => {
                    if (!firestoreDocument.exists) {
                        alert("User does not exist!")
                        return;
                    }
                    const { navigation } = this.props;
                    // navigation.navigate('App')
                })
                .catch(error => {
                    alert(error)
                });
    })
    .catch(error => {
      alert(error.code)
      switch(error.code) {
        case 'auth/user-not-found':
              setEmail({ ...email, error: "Account with this email was not found." })
              break;
        case 'auth/wrong-password':
              setPassword({ ...password, error: "Incorrect password." })
              break;
        default:
          alert(error)
        }
        // alert( error.code)
    })
}

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <HeaderSpecial>Welcome back.</HeaderSpecial>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <ButtonSpecial mode="contained" style={{backgroundColor: route.params.isBarber ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}} onPress={onLoginPressed}> 
        Login
      </ButtonSpecial>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => {
          route.params.isBarber ?
            navigation.navigate('CreateBarbershop') :
            navigation.navigate('CreateCustomer2', {phoneNumber: '7037951312'})
      }}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.primary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})

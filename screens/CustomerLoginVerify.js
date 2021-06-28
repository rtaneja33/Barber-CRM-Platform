import React, {useRef} from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Button,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { firebase, firebaseConfig } from "../src/firebase/config";
import { Block, Button as GaButton, theme, Text } from "galio-framework";
import { argonTheme, tabs } from "../constants";
import OnboardingForm from "../components/OnboardingForm";
import { validateContent } from "../constants/utils";
const { width, height } = Dimensions.get("screen");
import Spinner from "react-native-loading-spinner-overlay";
import BarberShop from "../models/BarberShop";
import Customer from "../models/Customer";
import { BackButton, Logo, HeaderSpecial, Background, ButtonSpecial, TextInput, PhoneNumberInput } from '../components'
import { phoneNumberValidator } from './helpers/phoneNumberValidator'
import { passwordValidator } from './helpers/passwordValidator'
import { confirmPasswordValidator } from './helpers/confirmPasswordValidator'
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { Platform } from "react-native";
import PhoneInput from "react-native-phone-number-input";

// import PhoneInput from "react-native-phone-number-input";

class CustomerLoginVerify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          phoneNumber: {value: "", error:""},
          recaptchaVerifier: React.createRef(null),
          formattedNum: "",
          verificationId: this.props.route.params.verificationId,
          verificationCode: "",
          verificationCodeInput: {value: "", error:""},
          firebaseConfig: firebaseConfig,
        //   message: !firebase || Platform.OS === 'web' ? { text: 'To get started, provide a valid firebase config boi' } : undefined,
          attemptInvisibleVerification : true,
        };
      }

  validatePhoneField = () => {
    console.log("calling code is", this.state.formattedNum);
    return  
    const phoneNumberError = phoneNumberValidator(this.state.phoneNumber.value)
    if (phoneNumberError){
      this.setState({
        phoneNumber: { ...this.state.fullName, error: phoneNumberError },
      })
      return
    }
    const {navigation} = this.props;
    navigation.navigate('CustomerLoginVerify', {phoneNumber: this.state.phoneNumber.value});
  }

  onVerify = () => {
    return new Promise((resolve, reject) => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            this.state.verificationId,
            this.state.verificationCodeInput.value
        );
        firebase.auth().signInWithCredential(credential).then((response) => {
            resolve(response);
        }).catch((err) => {
            console.log("error signing in with credential:", err)
            this.setState({
                verificationCodeInput: { ...this.state.verificationCodeInput, error: "Incorrect Code. Please try again." },
            })
            reject(err)
        });
        // alert('Phone authentication successful 👍')
    })
  }
  
 
  
  render() {
    return (
      <Background>
      <BackButton goBack={this.props.navigation.goBack} />
      
      {/* <HeaderSpecial>Welcome back.</HeaderSpecial> */}
      <Logo />
      <HeaderSpecial>Help us confirm it's really you!</HeaderSpecial>
        <Spinner
          // textContent={"Loading..."}
          textStyle={styles.spinnerTextStyles}
          visible={this.state.loading}
        />
        <Text 
            bold  
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            style={styles.title}
          >
            Enter Verification Code
          </Text>
          {/* <Block center>
          <HeaderSpecial >This information is stored securely.</HeaderSpecial>
          </Block> */}
        <TextInput
            style={{ marginVertical: 10, fontSize: 17 }}
            editable={!!this.state.verificationId}
            label="Verification Code"
            returnKeyType="done"
            value={this.state.verificationCodeInput.value}
            onChangeText={(text) => this.setState({verificationCodeInput: { value: text, error: '' }})}
            error={!!this.state.verificationCodeInput.error}
            errorText={this.state.verificationCodeInput.error}
            autoCompleteType="cc-number"
            textContentType="oneTimeCode"
            keyboardType="number-pad"
        />
        <Button
            title="Confirm Verification Code"
            disabled={!this.state.verificationCodeInput.value}
            onPress={async () => {
                try {
                    const credential = firebase.auth.PhoneAuthProvider.credential(
                    this.state.verificationId,
                    this.state.verificationCode
                    );
                    await firebase.auth().signInWithCredential(credential);
                    alert('Phone authentication successful 👍')
                } catch (err) {
                    alert('Error confirming code', err)
                }
            }}
        />
         <ButtonSpecial disabled = {this.state.verificationCodeInput.value.trim().length != 6 }
             mode="contained" 
             style={
              (this.state.verificationCodeInput.value.trim().length == 6)
              ? {backgroundColor: argonTheme.COLORS.BARBERBLUE, marginTop: 30}
              : {backgroundColor: argonTheme.COLORS.MUTED, marginTop: 30}
             }
             onPress={this.onVerify}
        > 
             Create Account
        </ButtonSpecial>  
      
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  child: {
    width: "100%",
  },
  centeredView: {
    // // position: "relative",
    // padding: theme.SIZES.BASE,
    flexDirection: 'row',
  
  },
  title: {
    paddingBottom: argonTheme.SIZES.BASE,
    // paddingHorizontal: 15,
    color: argonTheme.COLORS.HEADER,
    fontSize: 36,
  },
  
});

export default CustomerLoginVerify;
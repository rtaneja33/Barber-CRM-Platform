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
import { firebase, firebaseConfig } from "../../src/firebase/config";
import { Block, Button as GaButton, theme, Text } from "galio-framework";
import { argonTheme, tabs } from "../../constants";
import OnboardingForm from "../../components/OnboardingForm";
import { validateContent } from "../../constants/utils";
const { width, height } = Dimensions.get("screen");
import Spinner from "react-native-loading-spinner-overlay";
import BarberShop from "../../models/BarberShop";
import { ThermometerSun } from "react-bootstrap-icons";
import Customer from "../../models/Customer";
import { BackButton, Logo, HeaderSpecial, Background, ButtonSpecial, TextInput, PhoneNumberInput } from '../../components'
import { phoneNumberValidator } from '../helpers/phoneNumberValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { confirmPasswordValidator } from '../helpers/confirmPasswordValidator'
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { Platform } from "react-native";
import PhoneInput from "react-native-phone-number-input";

// import PhoneInput from "react-native-phone-number-input";

class CustomerVerifyPhone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          phoneNumber: {value: "", error:""},
          recaptchaVerifier: React.createRef(null),
          formattedNum: "",
          verificationId: "",
          verificationCode: "",
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
    navigation.navigate('CustomerVerifyPhone', {phoneNumber: this.state.phoneNumber.value});
  }
  
 
  
  render() {
    return (
      <Background>
        <FirebaseRecaptchaVerifierModal
        ref={this.state.recaptchaVerifier}
        firebaseConfig={this.state.firebaseConfig}
        attemptInvisibleVerification={this.state.attemptInvisibleVerification}
      />
      <BackButton goBack={this.props.navigation.goBack} />
      
      {/* <HeaderSpecial>Welcome back.</HeaderSpecial> */}
      
        <Spinner
          // textContent={"Loading..."}
          textStyle={styles.spinnerTextStyles}
          visible={this.state.loading}
        />
        <Text bold size={33} style={styles.title}>
            Welcome to Cliply!
          </Text>
          {/* <Block center>
          <HeaderSpecial >This information is stored securely.</HeaderSpecial>
          </Block> */}
        <TextInput
            style={{ marginVertical: 10, fontSize: 17 }}
            editable={!!this.state.verificationId}
            placeholder="123456"
            onChangeText={(text)=>{ this.setState({verificationCode: text}) }}
        />
        <Button
            title="Confirm Verification Code"
            disabled={!this.state.verificationId}
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

        {this.state.attemptInvisibleVerification && <FirebaseRecaptchaBanner />}

            <ButtonSpecial disabled = {!this.state.phoneNumber.value }
             mode="contained" 
             style={
              (this.state.phoneNumber.value)
              ? {backgroundColor: argonTheme.COLORS.BARBERBLUE, marginTop: 30}
              : {backgroundColor: argonTheme.COLORS.MUTED, marginTop: 30}
             }
             onPress={this.validatePhoneField}> 
             Continue</ButtonSpecial>

             
      
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
  },
  
});

export default CustomerVerifyPhone;
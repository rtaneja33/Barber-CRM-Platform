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

class CustomerPhone extends React.Component {
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

  validatePhoneField = async () => {

    
    const phoneNumberError = phoneNumberValidator(this.state.phoneNumber.value)
    if (phoneNumberError){
      this.setState({
        phoneNumber: { ...this.state.fullName, error: phoneNumberError },
      })
      return
    }

    try {
      console.log("hit send verification code with this phoneNum", this.state.formattedNum)
      console.log("and this ref",this.state.recaptchaVerifier.current )
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        this.state.formattedNum,
        this.state.recaptchaVerifier.current
      )
      // .catch(error => {
      //     // Handle Errors here.
      //     console.log("ERROR ON VERIFY PHONE", error);
      //     console.log("ERROR ON VERIFY PHONE MSG" ,error.message);
      //   });;
      console.log("verificationId is now", verificationId)
      this.setState({verificationId: verificationId})
      const {navigation} = this.props;
      navigation.navigate('CustomerVerifyPhone', {phoneNumber: this.state.phoneNumber.value, verificationId: this.state.verificationId, fullName: this.props.route.params.fullName});
      console.log("calling code is", this.state.formattedNum);
      return  
    } catch (err) {
      console.log("error occurred,",err)
      console.log("err message is", err.message)
      console.log("err description is", err.localizedDescription)

      // alert("Error is ", err.message);
    }
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
          <Text 
            bold  
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            style={styles.title}
          >
            Enter Your Phone #
          </Text>
          {/* <Block center>
          <HeaderSpecial >This information is stored securely.</HeaderSpecial>
          </Block> */}
           <PhoneNumberInput
            defaultValue={this.state.phoneNumber.value}
            defaultCode="US"
            layout="first"
            onChangeText={(text) => this.setState({phoneNumber: { value: text, error: '' }})}
            error={!!this.state.phoneNumber.error}
            errorText={this.state.phoneNumber.error}
            onChangeFormattedText={(text) => {
                this.setState({formattedNum: text})
            }}
            
          />
          {/* <Button
        title="Send Verification Code"
        disabled={!this.state.phoneNumber.value}
        onPress={async () => {
          // The FirebaseRecaptchaVerifierModal ref implements the
          // FirebaseAuthApplicationVerifier interface and can be
          // passed directly to `verifyPhoneNumber`.
          try {
            console.log("hit send verification code with this phoneNum", this.state.formattedNum)
            console.log("and this ref",this.state.recaptchaVerifier.current )
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
              this.state.formattedNum,
              this.state.recaptchaVerifier.current
            )
            // .catch(error => {
            //     // Handle Errors here.
            //     console.log("ERROR ON VERIFY PHONE", error);
            //     console.log("ERROR ON VERIFY PHONE MSG" ,error.message);
            //   });;
            console.log("verificationId is now", verificationId)
            this.setState({verificationId: verificationId})
            alert("text: 'Verification code has been sent to your phone.")
          } catch (err) {
            console.log("error occurred,",err)
            console.log("err message is", err.message)
            console.log("err description is", err.localizedDescription)

            // alert("Error is ", err.message);
          }
        }}
      /> */}

        {/* <TextInput
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
        /> */}

        {this.state.attemptInvisibleVerification && <FirebaseRecaptchaBanner />}

            <ButtonSpecial disabled = {!this.state.phoneNumber.value }
             mode="contained" 
             style={
              (this.state.phoneNumber.value)
              ? {backgroundColor: argonTheme.COLORS.BARBERBLUE, marginTop: 30}
              : {backgroundColor: argonTheme.COLORS.MUTED, marginTop: 30}
             }
             onPress={this.validatePhoneField}> 
             Send Verification Code</ButtonSpecial>

             
      
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
    fontSize: 36
  },
  
});

export default CustomerPhone;

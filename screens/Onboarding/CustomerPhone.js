import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { firebase } from "../../src/firebase/config";
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
// import PhoneInput from "react-native-phone-number-input";

class CreateCustomer2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          phoneNumber: {value: "", error:""},
        };
      }

  validatePhoneField = () => {
    const phoneNumberError = phoneNumberValidator(this.state.phoneNumber.value)
    if (phoneNumberError){
      this.setState({
        phoneNumber: { ...this.state.fullName, error: phoneNumberError },
      })
      return
    }
    const {navigation} = this.props;
    navigation.navigate('CreateCustomer2', {phoneNumber: this.state.phoneNumber.value});
  }
  
 
  
  render() {
    return (
      <Background>
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
           <PhoneNumberInput
            defaultValue={this.state.phoneNumber.value}
            defaultCode="US"
            layout="first"
            onChangeText={(text) => this.setState({phoneNumber: { value: text, error: '' }})}
            error={!!this.state.phoneNumber.error}
            errorText={this.state.phoneNumber.error}
            // onChangeFormattedText={(text) => {
            //   setFormattedValue(text);
            // }}
            
          />
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

export default CreateCustomer2;

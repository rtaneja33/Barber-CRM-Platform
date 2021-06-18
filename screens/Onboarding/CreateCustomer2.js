import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
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
import { BackButton, Logo, HeaderSpecial, Background, ButtonSpecial, TextInput, fullNameInput } from '../../components'
import { fullNameValidator } from '../helpers/fullNameValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { confirmPasswordValidator } from '../helpers/confirmPasswordValidator'
// import PhoneInput from "react-native-phone-number-input";

class CreateCustomer2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          fullname: "",
          phone: this.stripPhoneNumber(this.props.route.params.phoneNumber),
          fullName: {value: "", error:""},
          password: {value: "", error:""},
          confirmPassword: {value: "", error:""},
        };
      }
  stripPhoneNumber = (phoneNum) => {
    console.log(this.props.route.params.phoneNumber);
    return phoneNum.replace(/\D/g, "").trim();
  }
  validateRegisterFields = () => {
    // try {
    
    const fullNameError = fullNameValidator(this.state.fullName.value);
    const passwordError = passwordValidator(this.state.password.value);
    const confirmPasswordError = confirmPasswordValidator(this.state.password.value, this.state.confirmPassword.value);
    if(fullNameError || passwordError || confirmPasswordError){
      this.setState({
        fullName: { ...this.state.fullName, error: fullNameError },
        password: { ...this.state.password, error: passwordError },
        confirmPassword: { ...this.state.confirmPassword, error: confirmPasswordError }
      })
      return
    }
    console.log("OK - THE CUSTOMER FIELDS ARE VALID!");
  }
  //   const timer = setTimeout(() => {
  //     this.setState({loading: false})
  // },);
  onRegisterCustomer = (fullName, password, name) => {
    console.log("IN ON REGISTER");
    // try {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithfullNameAndPassword(fullName, password)
        .then((response) => {
          const uid = response.user.uid;
          return Customer.createNew(uid)
            .then((customer) => {
              customer.name = name;
              customer.fullName = fullName;
              return customer.update().then((updated) => {
                  console.log("RESPONSE FROM UPDATE IS", updated);
                  resolve(updated);
                })
                .catch((err) => {
                  alert("error updating info", err);
                });
            })
            .catch((error) => {
              alert("Error occured with creating Barbershop", error);
            });
        })
    }).catch((err)=> {alert(err); reject(err);});
  };
  
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
        <Text bold size={36} style={styles.title}>
            Create My Account
          </Text>
          {/* <Block center>
          <HeaderSpecial >This information is stored securely.</HeaderSpecial>
          </Block> */}
          <TextInput
          
          label="Full Name"
          returnKeyType="next"
          value={this.state.fullName.value}
          onChangeText={(text) => this.setState({fullName: { value: text, error: '' }})}
          error={!!this.state.fullName.error}
          errorText={this.state.fullName.error}
          autoCompleteType="name"
          textContentType="name"
        />
        <TextInput
          label="Password"
          returnKeyType="next"
          value={this.state.password.value}
          onChangeText={(text) => this.setState({password: { value: text, error: '' }})}
          error={!!this.state.password.error}
          errorText={this.state.password.error}
          textContentType="password"
          secureTextEntry
        />
        <TextInput
          label="Confirm Password"
          returnKeyType="done"
          value={this.state.confirmPassword.value}
          onChangeText={(text) => this.setState({confirmPassword: { value: text, error: '' }})}
          error={!!this.state.confirmPassword.error}
          errorText={this.state.confirmPassword.error}
          textContentType="password"
          secureTextEntry
        />
            <ButtonSpecial disabled = {!this.state.fullName.value || !this.state.password.value || !this.state.confirmPassword.value}
             mode="contained" 
             style={
              (this.state.fullName.value && this.state.password.value && this.state.confirmPassword.value)
              ? {backgroundColor: argonTheme.COLORS.BARBERBLUE, marginTop: 30}
              : {backgroundColor: argonTheme.COLORS.MUTED, marginTop: 30}
             }
             onPress={this.validateRegisterFields}> 
             Create Account</ButtonSpecial>
        {/* <Block style={styles.centeredView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={styles.child}
          >
            {/* <View> */}
            {/* <OnboardingForm
              action={(fullName, fullName, pass, fullName) => {
                console.log("full name is", fullName, "phone number is", fullName, "fullName is", fullName, "pass is", pass);
                 this.setState({ loading: true });
                 setTimeout(() => {
                  this.setState({ loading: false });
                  this.onRegisterCustomer(fullName, pass, fullName, fullName)
                  // const {navigation} = this.props;
                  // var barberShop = new BarberShop();
                  // barberShop.fullName = fullName;
                  // barberShop.shopName = name;
                  // barberShop.address = address;
                  // navigation.navigate('AddServices', {barberShop: barberShop,fullName: this.state.fullName, password: this.state.password });
                }, 200);
              }}
              afterSubmit={() => console.log("afterSubmit!")}
              buttonText="Create Account"
              fields={{
                fullName: {
                  label: "Full Name*",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                  },
                },
                fullName: {
                  label: "Phone Number*",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                  },
                },
                fullName: {
                    label: "fullName*",
                    validators: [validateContent],
                    inputProps: {
                      backgroundColor: "transparent",
                    },
                },
                pass: {
                    label: "Password*",
                    validators: [validateContent],
                    inputProps: {
                      backgroundColor: "transparent",
                      secureTextEntry: true
                    },
                },
              }}
            ></OnboardingForm> */}
            {/* </View> */}
          {/* </ScrollView>
        </Block>  */}
      
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

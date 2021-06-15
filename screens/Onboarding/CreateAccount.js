import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { firebase } from "../../src/firebase/config";
import { Block, Button as GaButton, theme, Text } from "galio-framework";
import { argonTheme, tabs } from "../../constants";
import OnboardingForm from "../../components/OnboardingForm";
import { validateContent, validateAddress } from "../../constants/utils";
const { width, height } = Dimensions.get("screen");
import Spinner from "react-native-loading-spinner-overlay";
import BarberShop from "../../models/BarberShop";
import { BackButton, Logo, HeaderSpecial, Background, ButtonSpecial, TextInput } from '../../components'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { confirmPasswordValidator } from '../helpers/confirmPasswordValidator'


class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    console.log("PROPS in CreateAccount ARE", props);
    this.state = {
      loading: false,
      email: {value: "", error:""},
      password: {value: "", error:""},
      confirmPassword: {value: "", error:""},
      barberShop: this.props.route.params.barberShop,
      email: "",
      password: "",
    //   barberShop: null,
    };
  }

  //   const timer = setTimeout(() => {
  //     this.setState({loading: false})
  // },);

  toFirestore(services){
    if(!services)
      return []
    if(services.length < 1){
      console.log("no services!!");
      return []
    }
    var firestoreServices = []
    services.map((serviceList)=>{
      var firestoreObj = { serviceType: serviceList.serviceType, services: []}
      serviceList.services.map((serviceObj) =>{
        firestoreObj.services.push({price: serviceObj.price, serviceName: serviceObj.serviceName})
      })
      firestoreServices.push(firestoreObj)
    })
    console.log("returning firestoreServices from toFirestore: ", firestoreServices)
    return firestoreServices
  }

  validateRegisterFields = () => {
    const {email, password, confirmPassword} = this.state;
    // try {
    const emailError = emailValidator(this.state.email.value);
    const passwordError = passwordValidator(this.state.password.value);
    const confirmPasswordError = confirmPasswordValidator(this.state.password.value, this.state.confirmPassword.value);
    if(emailError || passwordError || confirmPasswordError){
      this.setState({
        email: { ...this.state.email, error: emailError },
        password: { ...this.state.password, error: passwordError },
        confirmPassword: { ...this.state.confirmPassword, error: confirmPasswordError }
      })
      return
    }
    this.onRegister()
  }

  onRegister = () => {
    const email = this.state.email.value;
    const password = this.state.password.value;

    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          const uid = response.user.uid;
          return BarberShop.createNew(uid)
            .then((barberShop) => {
              barberShop.email = email;
              console.log("in onRegister, state barbershop is", this.state.barberShop)
              barberShop.services = this.state.barberShop.services ? this.toFirestore(this.state.barberShop.services) : []; //if this does not work, try https://stackoverflow.com/questions/46761718/update-nested-object-using-object-assign
              barberShop.shopName = this.state.barberShop.shopName;
              barberShop.barberIDs = this.state.barberShop.barberIDs;
              barberShop.address= this.state.barberShop.address;

              barberShop.barberIDs = this.state.barberShop.barberIDs || null;
              
              //can add more fields here when add barbers complete, or about description etc.! 
              // barberShop.update()
              return barberShop
                .update()
                .then((updated) => {
                  resolve(updated);
                })
                .catch((err) => {
                  console.log("ERROR UPDATING ERROR", err);
                  alert("error updating info", err);
                });
            })
            .catch((error) => {
              console.log("the create shop error is", error)
              alert("Error occured with creating Barbershop", error);
            });
        })
    }).catch((err)=> {alert(err);});
  };

  render() {
    // console.log("this.state.barberShop in CreateMyAccount is", this.state.barberShop);
    return (
      <Background>
      <BackButton goBack={this.props.navigation.goBack} />
      
      {/* <HeaderSpecial>Welcome back.</HeaderSpecial> */}
      {/* <Block> */}
        <Spinner
          // textContent={"Loading..."}
          textStyle={styles.spinnerTextStyles}
          visible={this.state.loading}
        />
        <Text bold size={32} style={styles.title}>
            Create My Account
          </Text>
          {/* <Block center>
          <HeaderSpecial >One Last Step!</HeaderSpecial>
          </Block> */}
        
        {/* <Block style={styles.centeredView}> */}
          <TextInput
          label="Email"
          returnKeyType="next"
          value={this.state.email.value}
          onChangeText={(text) => this.setState({email: { value: text, error: '' }})}
          error={!!this.state.email.error}
          errorText={this.state.email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          returnKeyType="next"
          value={this.state.password.value}
          onChangeText={(text) => this.setState({password: { value: text, error: '' }})}
          error={!!this.state.password.error}
          errorText={this.state.password.error}
          secureTextEntry
        />
        <TextInput
          label="Confirm Password"
          returnKeyType="next"
          value={this.state.confirmPassword.value}
          onChangeText={(text) => this.setState({confirmPassword: { value: text, error: '' }})}
          error={!!this.state.confirmPassword.error}
          errorText={this.state.confirmPassword.error}
          secureTextEntry
        />
            <ButtonSpecial disabled = {!this.state.email.value || !this.state.password.value}
             mode="contained" 
             style={
              (this.state.email.value && this.state.password.value)
              ? {backgroundColor: argonTheme.COLORS.BARBERBLUE, marginTop: 30}
              : {backgroundColor: argonTheme.COLORS.MUTED, marginTop: 30}
             }
             onPress={this.validateRegisterFields}> 
             Create Account</ButtonSpecial>
          {/* <ScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={styles.child}
          >
            {/* <View> */}
            {/* <OnboardingForm
              action={(confirmPass, pass, email) => {
                console.log(this.state.barberShop)
                 this.setState({ loading: true });
                 setTimeout(() => {
                  this.setState({ loading: false });
                  this.onRegister(email, pass)
                  // const {navigation} = this.props;
                  // var barberShop = new BarberShop();
                  // barberShop.email = email;
                  // barberShop.shopName = name;
                  // barberShop.address = address;
                  // navigation.navigate('AddServices', {barberShop: barberShop,email: this.state.email, password: this.state.password });
                }, 300);
              }}
              afterSubmit={() => console.log("afterSubmit!")}
              buttonText="Create Account"
              fields={{
                shopName: {
                  label: "Email",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                  },
                },
                shopEmail: {
                  label: "Password",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                    secureTextEntry:true,
                  },
                },
                shopAddress: {
                  label: "Confirm Password",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                    secureTextEntry:true,
                  },
                },
              }}
            ></OnboardingForm> */}
            {/* </View> */}
          {/* </ScrollView> */}
        {/* </Block> */}
      {/* </Block> */}
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

export default CreateAccount;

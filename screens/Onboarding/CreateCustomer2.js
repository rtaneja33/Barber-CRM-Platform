import React from "react";
import {
  StyleSheet,
  TextInput,
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
import { BackButton, Logo, HeaderSpecial, Background } from '../../components'
import { ThermometerSun } from "react-bootstrap-icons";
import Customer from "../../models/Customer";



class CreateCustomer2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          fullname: "",
          phone: "",
          email: "fakeemail",
          password: "fakepass",
        };
      }

  //   const timer = setTimeout(() => {
  //     this.setState({loading: false})
  // },);
  onRegisterCustomer = (email, password, name, phoneNumber) => {
    console.log("IN ON REGISTER");
    // try {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          const uid = response.user.uid;
          return Customer.createNew(uid)
            .then((customer) => {
              customer.name = name;
              customer.phonenumber = phoneNumber;
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
      <Block>
        <Spinner
          // textContent={"Loading..."}
          textStyle={styles.spinnerTextStyles}
          visible={this.state.loading}
        />
        <Text bold size={36} style={styles.title}>
            Create My Account
          </Text>
          <Block center>
          {/* <HeaderSpecial >This information is stored securely.</HeaderSpecial> */}
          </Block>
        
        <Block style={styles.centeredView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={styles.child}
          >
            {/* <View> */}
            <OnboardingForm
              action={(email, fullName, pass, phoneNumber) => {
                console.log("full name is", fullName, "phone number is", phoneNumber, "email is", email, "pass is", pass);
                 this.setState({ loading: true });
                 setTimeout(() => {
                  this.setState({ loading: false });
                  this.onRegisterCustomer(email, pass, fullName, phoneNumber)
                  // const {navigation} = this.props;
                  // var barberShop = new BarberShop();
                  // barberShop.email = email;
                  // barberShop.shopName = name;
                  // barberShop.address = address;
                  // navigation.navigate('AddServices', {barberShop: barberShop,email: this.state.email, password: this.state.password });
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
                phoneNumber: {
                  label: "Phone Number*",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                  },
                },
                email: {
                    label: "Email*",
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
            ></OnboardingForm>
            {/* </View> */}
          </ScrollView>
        </Block>
      </Block>
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

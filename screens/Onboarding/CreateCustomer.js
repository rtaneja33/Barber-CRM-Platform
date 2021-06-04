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
import Customer from "../../models/Customer";


class CreateCustomer extends React.Component {
  constructor(props) {
    super(props);
    console.log("PROPS ARE", props);
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

    onRegisterCustomer = (name, phoneNumber) => {
      console.log("IN ON REGISTER");
      const { email, password } = this.state;
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
      <Block flex>
        <Spinner
          // textContent={"Loading..."}
          textStyle={styles.spinnerTextStyles}
          visible={this.state.loading}
        />
        <Block style={styles.centeredView}>
          <Text bold size={28} style={styles.title}>
            Create Account
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={styles.child}
          >
            {/* <View> */}
            <OnboardingForm
              action={(customerName, customerPhoneNumber) => {
                 this.setState({ loading: true });
                 setTimeout(() => {
                  this.setState({ loading: false });
                  const {navigation} = this.props;
                  navigation.navigate('CreateAccount', {customerName: customerName, customerPhoneNumber: customerPhoneNumber, isBarber: false});
                    //  this.onRegisterCustomer(customerName, customerPhoneNumber).done(response => {
                    //      console.log("hey! Customer has been registered.")
                    //      //navigation.navigate('UserProfile', {fullName: customerName});
                    //  })
                }, 200);
              }}
              afterSubmit={() => console.log("afterSubmit!")}
              buttonText="Create Account"
              fields={{
                customerName: {
                  label: "Full Name*",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                  },
                },
                customerPhoneNumber: {
                  label: "Phone Number*",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                  },
                },
              }}
            ></OnboardingForm>
            {/* </View> */}
          </ScrollView>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  child: {
    width: "100%",
  },
  centeredView: {
    // position: "relative",
    padding: theme.SIZES.BASE,
  },
  title: {
    paddingBottom: argonTheme.SIZES.BASE,
    paddingHorizontal: 15,
    color: argonTheme.COLORS.HEADER,
    textAlign: "left",
  },
  
});

export default CreateCustomer;

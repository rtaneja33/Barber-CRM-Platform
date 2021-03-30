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


class CreateBarbershop extends React.Component {
  constructor(props) {
    super(props);
    console.log("PROPS ARE", props);
    this.state = {
      loading: false,
      fullname: "",
      phone: "",
      email: this.props.route.params.email,
      password: this.props.route.params.password,
      barberShop: null,
    };
  }

  //   const timer = setTimeout(() => {
  //     this.setState({loading: false})
  // },);

  onRegister = (address, shopEmail, name) => {
    console.log("IN ON REGISTER");
    const { email, password } = this.props.route.params;
    // try {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          const uid = response.user.uid;
          return BarberShop.createNew(uid)
            .then((barberShop) => {
              barberShop.email = shopEmail;
              barberShop.shopName = name;
              barberShop.address = address;
              barberShop.updateLatLongFromAddress();
              // barberShop.update()
              return barberShop
                .update()
                .then((updated) => {
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
            Create My Shop
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={styles.child}
          >
            {/* <View> */}
            <OnboardingForm
              action={(address, email, name) => {
                 this.setState({ loading: true });
                 setTimeout(() => {
                  this.setState({ loading: false });
                  const {navigation} = this.props;
                  var barberShop = new BarberShop();
                  barberShop.email = email;
                  barberShop.shopName = name;
                  barberShop.address = address;
                  navigation.navigate('AddServices', {barberShop: barberShop,email: this.state.email, password: this.state.password });
                }, 300);
              }}
              afterSubmit={() => console.log("afterSubmit!")}
              buttonText="Create Account"
              fields={{
                shopName: {
                  label: "Shop Name*",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                  },
                },
                shopEmail: {
                  label: "Shop Email*",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                  },
                },
                shopAddress: {
                  label: "Shop Address*",
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

export default CreateBarbershop;

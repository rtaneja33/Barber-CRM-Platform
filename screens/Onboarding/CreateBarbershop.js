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

// import firebase from "react-native-firebase";

class CreateBarbershop extends React.Component {
  constructor(props) {
    super(props);
    console.log("PROPS ARE", props);
    this.state = {
      loading: false,
      fullname: "",
      phone: "",
      email: this.props.route.params,
      password: this.props.route.params,
      barberShopSoFar: null,
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
      // <View style={{ flexDirection: "row" }}>
      // <Text numberOfLines={1} style={{ flex: 1, textAlign: "left" }}>
      //     {title}
      // </Text>
      // <Text style={{ textAlign: "right" }}>{duration}</Text>
      // </View>;

      <Block flex style={styles.centeredView}>
        <Spinner
          // textContent={"Loading..."}
          textStyle={styles.spinnerTextStyles}
          visible={this.state.loading}
        />
        <Block>
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
                this.onRegister(address, email, name)
                    .then((updated) => {
                        console.log("updated is", updated);
                        this.setState({ loading: false })
                    })
                    .catch((err) => {
                        this.setState({ loading: false })
                    });
                // shopInformation
                //   .updateAboutDescription(description)
                //   .then((updated) => {
                //     setModalVisible(!modalVisible);
                //     setSpinner();
                //   })
                //   .catch((err) => {
                //     setSpinner(false);
                //     console.log("An error occurred with updating about", err);
                //   });
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
                // shopAbout: {
                //   label: "About Description",
                //   validators: [],
                //   inputProps: {
                //     multiline: true,
                //     backgroundColor: 'transparent'
                //   },
                // },
              }}
            ></OnboardingForm>
            {/* </View> */}
          </ScrollView>
        </Block>
      </Block>
      //     <Block flex>
      //     <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30, width }}>
      //     <Block flex>
      //         <Text bold style={styles.title}>
      //         Create your Barbershop
      //         </Text>
      //     </Block>
      //     </ScrollView>
      //   </Block>
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

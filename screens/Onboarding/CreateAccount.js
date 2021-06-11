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



class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    console.log("PROPS in CreateAccount ARE", props);
    this.state = {
      loading: false,
    //   fullname: "",
    //   phone: "",
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
      return null
    var firestoreServices = []
    console.log("services in toFirestore is..", services)
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

  onRegister = (email, password) => {
    console.log("IN ON REGISTER");
    console.log("EMAIL IS", email);
    // try {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          const uid = response.user.uid;
          return BarberShop.createNew(uid)
            .then((barberShop) => {
              console.log("ROHAN THIS>BARBER is", this.state.barberShop);
              barberShop.email = email;
              
              barberShop.services = this.state.barberShop.services ? this.toFirestore(this.state.barberShop.services) : []; // this won't work, need to convert back by doing opposite of loadServices. or try https://stackoverflow.com/questions/46761718/update-nested-object-using-object-assign
              barberShop.shopName = this.state.barberShop.shopName;
              barberShop.barberIDs = this.state.barberShop.barberIDs;
              barberShop.address= this.state.barberShop.address;
              barberShop.updateLatLongFromAddress();

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
    }).catch((err)=> {alert(err); reject(err);});
  };

  render() {
    console.log("this.state.barberShop in CreateMyAccount is", this.state.barberShop);
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
          <HeaderSpecial >One Last Step!</HeaderSpecial>
          </Block>
        
        <Block style={styles.centeredView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={styles.child}
          >
            {/* <View> */}
            <OnboardingForm
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

export default CreateAccount;

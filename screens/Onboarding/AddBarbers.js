import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { firebase } from "../../src/firebase/config";
import { Block, Button as GaButton, theme, Text } from "galio-framework";
import { argonTheme, tabs } from "../../constants";
import OnboardingForm from "../../components/OnboardingForm";
import { validateContent } from "../../constants/utils";
const { width, height } = Dimensions.get("screen");
import Spinner from "react-native-loading-spinner-overlay";
import BarberShop from "../../models/BarberShop";
import { BackButton, Background } from '../../components'


class AddBarbers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fullname: "",
      phone: "",
      email: this.props.route.params.email,
      barberShop: this.props.route.params.barberShop,
      password: this.props.route.params.password,
    };
  }

  toFirestore(services){
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

  onRegister = (isSkipped) => {
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
              barberShop.email = this.state.barberShop.email;
              barberShop.services = this.toFirestore(this.state.barberShop.services); // this won't work, need to convert back by doing opposite of loadServices. or try https://stackoverflow.com/questions/46761718/update-nested-object-using-object-assign
              barberShop.shopName = this.state.barberShop.shopName;
              barberShop.address= this.state.barberShop.address;
              barberShop.updateLatLongFromAddress();

              if(!isSkipped){
                barberShop.baberIDs = this.state.barberShop.baberIDs;
              }
              //can add more fields here when add barbers complete, or about description etc.! 
              // barberShop.update()
              return barberShop
                .update()
                .then((updated) => {
                  console.log("RESPONSE FROM UPDATE IS", updated);
                  resolve(updated);
                })
                .catch((err) => {
                  console.log("ERROR UPDATING ROHAN ERROR", err);
                  alert("error updating info", err);
                });
            })
            .catch((error) => {
              console.log("the create shop  error is", error)
              alert("Error occured with creating Barbershop", error);
            });
        })
    }).catch((err)=> {alert(err); reject(err);});
  };

  continueToNext = () => {
    const {navigation} = this.props;
    console.log("before navigation to CreateAccount, we are passing barberShop: ", this.state.barberShop)
    var shop = {...this.state.barberShop};
    if(!shop.services){
      shop.services = []
    }
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      navigation.navigate('CreateAccount', {barberShop: shop});
    }, 200);
    
  }

  render() {
    console.log(this.props)
    return (
      <Background>
      <BackButton goBack={this.props.navigation.goBack} />
      <Block flex style={styles.centeredView}>
        <Spinner
          // textContent={"Loading..."}
          textStyle={styles.spinnerTextStyles}
          visible={this.state.loading}
        />
        <Block flex style={styles.addBarbers}>
          <Text bold size={28} style={styles.title}>
            Add Barbers
          </Text>
          {/* <ScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={styles.child}
          > */}
            {/* <Text>Have a way to create barbers here / just add their names+create profiles? @Emerson</Text> */}
          {/* </ScrollView> */}
        </Block>
        <View style={styles.bottom}>
          <Block flex row>
            <TouchableOpacity
              style={{
                position: "absolute",
                left: 25,
                top: 25,
                zIndex: 0,
                color: "#00000080",
              }}
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
              onPress={() => {
                this.continueToNext();
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>SKIP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 25,
                top: 25,
                zIndex: 0,
                color: "#00000080",
              }}
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
              onPress={() => {
                console.log("EMAIL AND PASSWORD ARE", this.state.email, this.state.password)
                console.log("addbarbers- this.props is", this.props);
                // this.onRegister(false);
                this.continueToNext();
                console.log("pressed CONTINUE!");
              //   this.setState({ loading: true });
              //   setTimeout(() => {
              //    this.setState({ loading: false });
              //    const {navigation} = this.props;
              //    var shop = {...this.state.barberShop};
              //    shop.services = this.state.services; 
              //    this.setState({barberShop: shop})
              //    console.log("and this.state.barbershop.services looks like", this.state.barberShop.services)
              //    navigation.navigate('AddBarbers', {barberShop: this.state.barberShop, email: this.state.email, password: this.state.password });
              //  }, 300);
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                CONTINUE
              </Text>
            </TouchableOpacity>
          </Block>
        </View>
        </Block>
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  child: {
    width: "100%",
  },
  addBarbers: {
    marginTop: height*0.05, 
  },
  title: {
    paddingBottom: argonTheme.SIZES.BASE,
    paddingHorizontal: 15,
    marginTop: 22,
    color: argonTheme.COLORS.HEADER,
  },
  bottom: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    justifyContent: "flex-end",
    width: width,
    height: height / 9,
    backgroundColor: argonTheme.COLORS.HEADER,
  },
  
  centeredView: {
    padding: theme.SIZES.BASE,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
});

export default AddBarbers;

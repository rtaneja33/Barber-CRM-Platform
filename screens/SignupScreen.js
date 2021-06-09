import React, { useState } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { firebase } from '../src/firebase/config';
import BarberShop from "../models/BarberShop";

const { width, height } = Dimensions.get("screen");
class SignupScreen extends React.Component {

    constructor(props) {
      super(props);
      console.log("signupscreen props are ", props);
    }
    state = {
        email: ""
    }
    
    signupPressed = () => {
        const {navigation} = this.props;
        navigation.navigate('CreateBarbershop', {email: this.state.email, password: this.state.password });
        // firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((response) => {
        //         const uid = response.user.uid
        //         BarberShop.createNew(uid).then( (barberShop) => {
        //             barberShop.aboutDescription = "yo";
        //             barberShop.address = "1919191";
        //             barberShop.update();
                
        //             const { navigation } = this.props;
        //             // navigation.navigate("App");
        //         }).catch((error) => {alert(error)});
        //     })
        //     .catch((error) => {
        //         alert(error)
        // });
    }
    signupCustomerPressed = () => {
        const {navigation} = this.props;
        navigation.navigate('CreateCustomer2', {email: this.state.email, password: this.state.password });
    }
    
    signinPressed = () => {

        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((response) => {
             const uid = response.user.uid
                const barberShopsRef = firebase.firestore().collection('BarberShops')
                barberShopsRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist!")
                            return;
                        }
                        const { navigation } = this.props;
                        // navigation.navigate('App')
                    })
                    .catch(error => {
                        alert(error)
                    });
        })
        .catch(error => {
            alert(error)
        })
    }
    
    render() {
        return (
          <Block flex middle>
            
            <ImageBackground
              source={Images.RegisterBackground}
              style={{ width, height, zIndex: 1 }}
            >
              <Block flex middle>
                <Block style={{ marginBottom: 15 }} middle>
                 <Text color="#8898AA" size={50}>
                   Cliply
                 </Text>
               </Block>
                
                <Block style={styles.registerContainer}>
                  <Block flex>
                     <Block flex={0.1} middle>
                      <Text color="#8898AA" size={20}>
                        Sign up as a Barber!
                      </Text>
                    </Block>
                    <Block flex center>
                      <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="padding"
                        enabled
                      >
                        <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                          <Input
                            borderless
                            placeholder="Email Address"
                            onChangeText={(text) => { this.setState({ email: text})}}
                            iconContent={
                              <Icon
                                size={16}
                                color={argonTheme.COLORS.ICON}
                                name="ic_mail_24px"
                                family="ArgonExtra"
                                style={styles.inputIcons}
                              />
                            }
                          />
                        </Block>
                        <Block width={width * 0.8}>
                          <Input
                            password
                            borderless
                            placeholder="Password"
                            onChangeText={(text) => { this.setState({ password: text})}}
                            iconContent={
                              <Icon
                                size={16}
                                color={argonTheme.COLORS.ICON}
                                name="padlock-unlocked"
                                family="ArgonExtra"
                                style={styles.inputIcons}
                              />
                            }
                          />
                        </Block>
                        <Block row width={width * 0.75}>
                          <Checkbox
                            checkboxStyle={{
                              borderWidth: 3
                            }}
                            color={argonTheme.COLORS.PRIMARY}
                            label="I agree with the"
                          />
                          <Button
                            style={{ width: 100 }}
                            color="transparent"
                            textStyle={{
                              color: argonTheme.COLORS.PRIMARY,
                              fontSize: 14
                            }}
                          >
                            Privacy Policy
                          </Button>
                        </Block>
                        <Block middle>
                            <Button onPress = {this.signupPressed} color="primary" style={styles.createButton}>
                              <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                SIGN UP AS BARBER
                              </Text>
                            </Button>
                            <Button onPress = {this.signupCustomerPressed} color="primary" style={styles.createButton}>
                              <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                SIGN UP AS CUSTOMER
                              </Text>
                            </Button>
                            <Button onPress = {this.signinPressed} color="secondary" style={styles.createButton}>
                              <Text bold size={14} color={argonTheme.COLORS.BLACK}>
                                SIGN IN
                              </Text>
                            </Button>
                        </Block>
                      </KeyboardAvoidingView>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </ImageBackground>
          </Block>
        );
      }
    }


const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  inputIcons: {
    marginRight: 12
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  }
});

export default SignupScreen;

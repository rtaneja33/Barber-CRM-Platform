import React, { useState } from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { firebase } from '../src/firebase/config'
import { ImagePicker } from "react-native-image-picker";

const { width, height } = Dimensions.get("screen");

class AddAppointment extends React.Component {
    state = {
    pickedImageFrontURI: null,
    pickedImageSideURI: null,
    pickedImageRearURI: null,
    userPhoneNumber: ""
    }
    
    reset = () => {
      this.setState({
          pickedImageFront: null,
          userPhoneNumber: ""
      });
    }
    
    openCamera = (title) => {
        const { navigation } = this.props;
        navigation.navigate('CustomCamera', {title: title, parent: this})
    }
    
    renderImageOrTakePicture = (picType) => {
        if (picType == "Front") {
            if (this.state.pickedImageFrontURI == null) {
                return (
                        <View style={{alignItems: "center"}}>
                            <Icon size={25} color={'white'} name={"plus"} family="AntDesign" />
                        </View>
                )
            } else {
                return ( <Image style={styles.image} source={{uri: this.state.pickedImageFrontURI}} /> )
            }
        }
        if (picType == "Side") {
            if (this.state.pickedImageSideURI == null) {
                return (
                        <View style={{alignItems: "center"}}>
                            <Icon size={25} color={'white'} name={"plus"} family="AntDesign" />
                        </View>
                )
            } else {
                return ( <Image style={styles.image} source={{uri: this.state.pickedImageSideURI}} /> )
            }
        }
        if (picType == "Rear") {
            if (this.state.pickedImageRearURI == null) {
                return (
                        <View style={{alignItems: "center"}}>
                            <Icon size={25} color={'white'} name={"plus"} family="AntDesign" />
                        </View>
                )
            } else {
                return ( <Image style={styles.image} source={{uri: this.state.pickedImageRearURI}} /> )
            }
        }
    }
    
    render() {
        const { navigation } = this.props;
        
        return (
        <View style={styles.screen}>
            <View style={styles.box}>
                <View style={styles.boxtitle}>
                    <Text style={styles.titletext}> Add Appointment </Text>
                </View>
                
                <View style={styles.subbox}>
                    <Text style={styles.text}> Front View </Text>
                    
                    <TouchableOpacity style={styles.takePictureView} onPress={() => { this.openCamera("Front View") }}>
                        {this.renderImageOrTakePicture("Front")}
                    </TouchableOpacity>
                </View>
                
                
                <View style={styles.subbox}>
                    <Text style={styles.text}> Side View </Text>
                    
                    <TouchableOpacity style={styles.takePictureView} onPress={() => { this.openCamera("Side View") }}>
                        {this.renderImageOrTakePicture("Side")}
                    </TouchableOpacity>
                </View>
                
                <View style={styles.subbox}>
                    <Text style={styles.text}> Rear View </Text>
                    
                    <TouchableOpacity style={styles.takePictureView} onPress={() => { this.openCamera("Rear View") }}>
                        {this.renderImageOrTakePicture("Rear")}
                    </TouchableOpacity>
                </View>
                
                <View style={styles.finalsubbox}>
                    
                    
                    <TouchableOpacity style={styles.buttoncancel} onPress={() => { navigation.goBack(null); }}>
                    <Text> Cancel </Text>
                    </TouchableOpacity>
                
                <TouchableOpacity style={styles.buttoncontinue} onPress={() => { navigation.navigate('SavePreferences', {pickedImageFrontURI: this.state.pickedImageFrontURI, pickedImageSideURI: this.state.pickedImageSideURI, pickedImageRearURI: this.state.pickedImageRearURI, phoneNumber: this.props.route.params.phoneNumber}); }}>
                    <Text> Continue </Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>
        );
    }
}



const styles = StyleSheet.create({
screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CDECFF',
},
    
box: {
    width: '90%',
    height: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: "white",
    shadowOffset: {
        width: 0,
        height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    backgroundColor: '#ffffff',
},
    
subbox: {
    flex: 2,
    width: '95%'
},
    
finalsubbox: {
    flex: 2,
    width: '95%',
    flexDirection: "row"
},
    
boxtitle: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
},
    
text: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'stretch'
},
    
titletext: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center'
},
    
takePictureView: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: 'center',
    borderRadius: 0,
    borderWidth: 3,
    borderColor: "skyblue",
    width: "50%"
},
    
buttoncontinue: {
    alignItems: "center",
    backgroundColor: "skyblue",
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    width: '50%'
},
    
buttoncancel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "skyblue",
    borderWidth: 2,
    borderRadius: 5,
    padding: 10
},
    
image: {
    flex: 1
    //resizeMode: 'contain',
}
});

export default AddAppointment;

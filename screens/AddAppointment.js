import React, { useState } from 'react';
import {
  StyleSheet,
  ImageBackground,
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
    pickedImageFront: null,
    pickedImageSide: null,
    pickedImageRear: null,
    userPhoneNumber: ""
    }
    
    reset = () => {
      this.setState({
      pickedImageFront: null,
      userPhoneNumber: ""
      });
    }
    
    pickImageHandler = () => {
          ImagePicker.showImagePicker({title: "Pick an Image",
          maxWidth: 800, maxHeight: 600}, res => {
             if (res.didCancel) {
                console.log("User cancelled!");
             } else if (res.error) {
                console.log("Error", res.error);
             } else {
                this.setState({
                   pickedImage: { uri: res.uri }
                });
             }
          });
       }

    onSubmit = async () => {
      try {
        this.uploadPhoto(post)
        reset()
      } catch (e) {
        console.error(e)
      }
    }
    
    uploadPhoto = async () => {
        const id = uuid.v4()
        const uploadData = {
            id: id,
            postPhotoFront: this.state.pickedImageFront,
            postPhotoSide: this.state.pickedImageSide,
            postPhotoRear: this.state.pickedImageRear,
            userPhoneNumber: this.state.userPhoneNumber
        }
        
        return firebase.firestore().collection('Appointments').doc(id).set(uploadData)
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
                <Text style={styles.text}> Front Profile </Text>
                <TouchableOpacity style={styles.buttoncontinue}>
                <Text> Take picture </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttoncontinue} onPress={ this.pickImageHandler }>
                <Text> Add picture </Text>
                </TouchableOpacity>
                </View>
                
                
                
                
                <View style={styles.subbox}>
                <Text style={styles.text}> Side Profile </Text>
                </View>
                
                <View style={styles.subbox}>
                <Text style={styles.text}> Rear Profile </Text>
                </View>
                
                <View style={styles.finalsubbox}>
                    <TouchableOpacity style={styles.buttoncontinue} onPress={() => { navigation.navigate('SavePreferences'); }}>
                    <Text> Continue </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.buttoncancel} onPress={() => { navigation.goBack(null); }}>
                    <Text> Cancel </Text>
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
    
buttoncontinue: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "skyblue",
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10
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
});

export default AddAppointment;

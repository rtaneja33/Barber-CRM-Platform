import React, { useState } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  View,
  TouchableOpacity
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { firebase } from '../src/firebase/config'
import { Camera } from 'expo-camera';
import Appointment from "../models/Appointment"
import AppointmentPhoto from "../models/AppointmentPhoto"

const { width, height } = Dimensions.get("screen")

class SavePreferences extends React.Component {
    state = {
    serviceName: "",
    notes: ""
    }
    
    saveAppointment = () => {
        const { navigation, route } = this.props;
        
        let frontImage = route.params.pickedImageFront
        let sideImage = route.params.pickedImageSide
        let readImage = route.params.pickedImageRear
        let phoneNumber = route.params.phoneNumber

        Appointment.createNew().then( (appointment) => {
            appointment.barberUID = firebase.auth().currentUser.uid
            appointment.customerPhoneNumber = phoneNumber
            
            if (frontImage != null) {
                AppointmentPhoto.createNew().then( (photo) => {
                    photo.setAndUpdateImage(frontImage)
                    photo.appointmentUID = appointment.uid
                    photo.barberUID = appointment.barberUID
                    photo.update()
                    
                    appointment.appointmentFrontPhotoUID = photo.uid
                    appointment.update()
                })
            }
            if (sideImage != null) {
                AppointmentPhoto.createNew().then( (photo) => {
                    photo.setAndUpdateImage(sideImage)
                    photo.appointmentUID = appointment.uid
                    photo.barberUID = appointment.barberUID
                    photo.update()
                    
                    appointment.appointmentSidePhotoUID = photo.uid
                    appointment.update()
                })
            }
            if (readImage != null) {
                AppointmentPhoto.createNew().then( (photo) => {
                    photo.setAndUpdateImage(readImage)
                    photo.appointmentUID = appointment.uid
                    photo.barberUID = appointment.barberUID
                    photo.update()
                    
                    appointment.appointmentRearPhotoUID = photo.uid
                    appointment.update()
                })
            }
            
            appointment.serviceProvided = this.state.serviceName
            appointment.notes = this.state.notes
            appointment.update()
        })
        
        navigation.pop(2)
    }
    
    render() {
        const { navigation } = this.props;

        return (
        <View style={styles.screen}>
            <View style={styles.box}>
                <View style={styles.boxtitle}>
                    <Text style={styles.titletext}> Save Preferences? </Text>
                </View>
                <View style={styles.subbox}>
                    <Text style={styles.text}> Service </Text>
                </View>
                
                <Block width={width * 0.8} style={{flex: 4}} >
                    <Input placeholder="Service Name" onChangeText={(text) => { this.setState({ serviceName: text})}} />
                </Block>
                
                <View style={styles.subbox}>
                    <Text style={styles.text}> Notes for Appointment </Text>
                </View>
                
                <Block width={width * 0.8} style={{flex: 4}} >
                    <Input placeholder="Notes" onChangeText={(text) => { this.setState({ notes: text})}} />
                </Block>
                
                <View style={styles.finalsubbox}>
                </View>
                
                <View style={styles.subbox}>
                    <TouchableOpacity style={styles.buttoncancel} onPress={() => { navigation.goBack(null);}}>
                        <Text> Back </Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity style={styles.buttoncontinue} onPress={() => { this.saveAppointment() }}>
                        <Text> Save to Profile </Text>
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
    flex:3,
    width: '95%',
    flexDirection:"row"
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
    fontWeight: 'bold'
},
    
titletext: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center'
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
});

export default SavePreferences;

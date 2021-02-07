import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  View,
  TouchableOpacity
} from "react-native";
import { Button, Icon, Input } from "../components";
import CustomForm from "../components/CustomForm";
import Appointment from "../models/Appointment"
import AppointmentPhoto from "../models/AppointmentPhoto"
const { width, height } = Dimensions.get("screen");
import Spinner from "react-native-loading-spinner-overlay";
import { firebase } from "../src/firebase/config";
import BarberShops from "../models/BarberShop";
import { Block, Text, theme } from "galio-framework";
import { HeaderHeight } from "../constants/utils";
import { argonTheme } from '../constants';
import {TextInput, DefaultTheme} from 'react-native-paper';

const SaveNotes = ({navigation, route}) => {
    // state = {
    // serviceName: "",
    // notes: ""
    // }
    // const inputTheme = {
    //     ...DefaultTheme,
    //     colors: {
    //         ...DefaultTheme.colors,
    //         primary: argonTheme.COLORS.HEADER,
    //         accent: 'blue'
    //     },
    //     backgroundColor: 'blue'
    // }
    const [spinner, setSpinner] = React.useState(true);
    const [text,setText] = React.useState('')
    useEffect(() => {
        // console.log("appointment is", appointment);
        setSpinner(false);
      }, []);

    const saveAppointmentDumb = () => {
        console.log("save apt");
        console.log("received apt,", apt);
    }

    const saveAppointment = () => {
        // const { navigation, route } = this.props;
        setSpinner(true);
        const {apt} = route.params;
        console.log("route.params are", route.params)
        console.log("apt is", apt)
        let frontImageURI = apt.appointmentFrontPhotoUID
        let sideImageURI = apt.appointmentSidePhotoUID
        let readImageURI = apt.appointmentRearPhotoUID
        
        Appointment.createNew().then( (appointment) => {
            appointment.barberUID = apt.barberUID
            appointment.serviceProvided = apt.serviceProvided
            appointment.customerPhoneNumber = apt.customerPhoneNumber;
            appointment.appointmentFrontPhotoUID = null;
            appointment.appointmentRearPhotoUID = null;
            appointment.appointmentSidePhotoUID = null;
            if (frontImageURI != null) {
                AppointmentPhoto.createNew().then( (photo) => {
                    photo.setAndUpdateImageURI(frontImageURI)
                    photo.appointmentUID = appointment.uid
                    photo.barberUID = appointment.barberUID
                    photo.update()
                    
                    appointment.appointmentFrontPhotoUID = photo.uid
                })
            }
            if (sideImageURI != null) {
                AppointmentPhoto.createNew().then( (photo) => {
                    photo.setAndUpdateImageURI(sideImageURI)
                    photo.appointmentUID = appointment.uid
                    photo.barberUID = appointment.barberUID
                    photo.update()
                    
                    appointment.appointmentSidePhotoUID = photo.uid
                })
            }
            if (readImageURI != null) {
                AppointmentPhoto.createNew().then( (photo) => {
                    photo.setAndUpdateImageURI(readImageURI)
                    photo.appointmentUID = appointment.uid
                    photo.barberUID = appointment.barberUID
                    photo.update()
                    
                    appointment.appointmentRearPhotoUID = photo.uid
                })
            }
            
           // appointment.serviceProvided = this.state.serviceName
            appointment.notes = text // notes
            appointment.update().then(success => {
                console.log("success??", success)
                setSpinner(false);
                navigation.pop(3);
            }).catch((err)=> {
                alert("An error occurred. ")
                console.log("error saving appointment", err);
            })
        })
        
        //navigation.pop(3);
    }
    
    return (
        <Block flex style={styles.centeredView}>
        <Spinner
            visible={spinner}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyles}
        />
            <View style={styles.box}>
                <View style={styles.boxtitle}>
                    <Text style={styles.titletext}> Save Notes? </Text>
                </View>
                <View style={styles.subbox2}> 
                <TextInput
                        blurOnSubmit={true}
                        label = "Appointment Notes"
                        placeholder = "Add Appointment Notes?"
                        mode='outlined'
                        clearButtonMode='always'
                        maxLength = {100}
                        multiline
                        value={text}
                        theme={{ colors: { primary: argonTheme.COLORS.BARBERBLUE,underlineColor:'transparent',}}}
                        onChangeText={text=>setText(text)}
                    />
                </View>
            </View>
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
                navigation.goBack(null);
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>BACK</Text>
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
                saveAppointment()
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                SAVE
              </Text>
            </TouchableOpacity>
          </Block>
        </View>
          </Block>
        );
}

const styles = StyleSheet.create({
screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CDECFF',
},
subbox2: {
    flex:6,
    width: '100%',
    paddingHorizontal: 20,
    alignContent: 'center',
}
    ,
box: {
    height: '95%',
    width: '95%',
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
    flex:1,
    width: '95%',
    //flexDirection:"row"
},
finalsubbox: {
    flex: 2,
    width: '95%',
    //flexDirection: "row"
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
centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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

export default SaveNotes;


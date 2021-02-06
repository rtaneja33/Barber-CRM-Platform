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
import Appointment from "../models/Appointment"
import AppointmentPhoto from "../models/AppointmentPhoto"
import { SectionGrid } from 'react-native-super-grid';
const { width, height } = Dimensions.get("screen");
import Spinner from "react-native-loading-spinner-overlay";
import { firebase } from "../src/firebase/config";
import BarberShops from "../models/BarberShop";
import { Block, Text, theme } from "galio-framework";
import { HeaderHeight } from "../constants/utils";
import { argonTheme } from '../constants';
import CheckBox from '@react-native-community/checkbox';
import { SelectItem } from '@ui-kitten/components';
const SavePreferences = ({navigation, route}) => {
    // state = {
    // serviceName: "",
    // notes: ""
    // }
    const [shopInformation, setShopInformation] = useState({});
    const [spinner, setSpinner] = React.useState(true);
    const [sections, setSections] = React.useState([]);
    const [appointment, setAppointment] = React.useState({});
    useEffect(() => {
        console.log("making api call");
        setSpinner(true);
    
        BarberShops.loadFromID(firebase.auth().currentUser.uid).then((shopInfo) => {
          setShopInformation(shopInfo);
          createSections(shopInfo);
          //console.log("shop info is", shopInfo)
        //   loadServices(shopInfo.services);
          
        }).catch((err)=>{console.log("ERROR OCCURRED",err); setSpinner(false)});
      }, []);
    
    const selectItem = (item, sectionTitle, index) => {
        item.isSelect = !item.isSelect;
        // console.log("selectItem",item, "index is",index)
        // console.log("item section is", sectionTitle)
        // console.log("right now sections looks like", sections)
        var localSections = [...sections];
        // var localSections = sections
        console.log("localSections are", localSections)
        localSections.map((section) => {
            if(section.title === sectionTitle){
                section.data[index].isSelect = !section.data[index].isSelect;
            }
        })
        console.log("setting sections in selectItem...");
        setSections(localSections);
        //console.log("updated sections are now", sections);
    }
    const createSections = (shopInformation) => {
        if(!shopInformation || !shopInformation.services){
            return;
        }
        console.log("CALLING CREATE SECTIONS.....")
        var localSections = []
        //console.log("shopinformation is", shopInformation);
        shopInformation.services.map((servObj) => {
            console.log("mapping service Obj")
            var sectionData = []
            servObj.services.map((servItem) => {
                sectionData.push({itemName: servItem.serviceName, isSelect: false})
            })
            localSections.push({title: servObj.serviceType, data: sectionData })
        })
        console.log("setting sections in createSections...");
        setSections(localSections);
        setSpinner(false);
        //console.log("sections are", sections)
    }
    const renderServices = () => { 
        //console.log("IN RENDER SERVICES, shopInfo is", shopInformation)
        if(!shopInformation){
            console.log("No shp info exists");
            console.log(shopInformation)
            return (<></>)
        }
        else if (!shopInformation['services']){
            console.log("shop info exists, but there's no services");
            console.log(shopInformation)
            return (
                <Text>There was an error loading your services :/</Text>
            )
        }
        else if (shopInformation['services'].length <1){
            console.log("NO SERVICES LENGTH IS 0");
            console.log(shopInformation) 
            return (
                
                <Text>You have no services saved. Please add this in My Shop.</Text>
            )
        }
        else{
            // console.log("HERE! shopInfo is", shopInformation);
            console.log("NEW SECTIONS ARE", sections)
            return ( 
                <SectionGrid 
                itemDimension={130}
                sections={sections}
                renderItem = {({ item, section, index }) => (
                    <TouchableOpacity onPress={()=>{ console.log("tapped", item.itemName); selectItem(item, section, index); console.log(item.itemName, "selected?", item.isSelect)}}>
                    <View style={[item.isSelect ? styles.selected : styles.itemContainer,{ backgroundColor: argonTheme.COLORS.MUTED }]}>
                        <Icon
                            name= {item.isSelect ? "check-circle" : "radio-button-unchecked"}
                            family="MaterialIcons"
                            size={50}
                            color= "white"
                        />
                        <Text style={[styles.itemName, {marginTop: 5}]}>{item.itemName}</Text>
                    </View>
                    </TouchableOpacity>)
                  }
                renderSectionHeader={({ section }) => (
                    <View style={[styles.sectionContainer, { backgroundColor: argonTheme.COLORS.HEADER }]}>
                        <Text style={{ fontSize: 20, color:'white', fontWeight: 'bold' }}>{section.title}</Text>
                    </View>
                )}
                />
            )
        }

        
    }
    const saveServices = () => {
        let savedServices = {}
        sections.map((obj)=>{
           let serviceType = obj.title
           obj.data.map((service)=>{
               if(service.isSelect){
                savedServices[serviceType] ? 
                    savedServices[serviceType].push(service.itemName):
                    savedServices[serviceType] = [service.itemName]
               }
           })
        })
        return savedServices
    }

    const saveAppointmentSoFar = () => {
        // const { navigation, route } = this.props;
        
        let frontImageURI = route.params.pickedImageFrontURI
        let sideImageURI = route.params.pickedImageSideURI
        let rearImageURI = route.params.pickedImageRearURI
        let apt = new Appointment();
        apt.barberUID = firebase.auth().currentUser.uid;
        apt.serviceProvided = saveServices()
        apt.appointmentFrontPhotoUID = frontImageURI;
        apt.appointmentSidePhotoUID = sideImageURI;
        apt.appointmentRearPhotoUID = rearImageURI;
        
        setAppointment(apt);
        navigation.navigate('SaveNotes', {apt: apt});
        // navigation.pop(2)
    }
    
    return (
        <Block flex style={styles.centeredView}>
        <Spinner
            visible={spinner}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyles}
        />
        {/* <View style={styles.screen}>
            <Spinner
                visible={spinner}
                textContent={"Loading..."}
                textStyle={styles.spinnerTextStyles}
            /> */}
            <View style={styles.box}>
                <View style={styles.boxtitle}>
                    <Text style={styles.titletext}> Save Preferences? </Text>
                </View>
                <View style={styles.subbox2}> 
                {renderServices()}
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
                saveAppointmentSoFar()
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                CONTINUE
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
    width: '95%',
    flexDirection:"row",
}
    ,
box: {
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
sectionContainer: {
    flex:1,
    padding: 10,
},
itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
selected: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    height: 150,
    borderColor: argonTheme.COLORS.HEADER,
    borderWidth: 5,
},
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
subbox: {
    flex:1,
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

export default SavePreferences;

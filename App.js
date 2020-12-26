import React, { useEffect } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Platform, TextInput, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import logo from './assets/logo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import * as Sharing from 'expo-sharing';
import * as Contacts from 'expo-contacts';
import { Avatar } from 'react-native-elements';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import { render } from 'react-dom';
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import { Images, articles, argonTheme } from "./constants";


export default function App() {

  const [isLoading, setIsLoading] = React.useState(false);
  const [customers, updateCustomers] = React.useState([]);
  const [inMemoryContacts, setMemContacts] = React.useState([]);
  const loadContacts = async()=>{
    const { status, permissions } = await Permissions.askAsync(Permissions.CONTACTS);
    if(status !== 'granted')
    {
      setIsLoading(false);
      return
    }
    console.log("granted")
    const {data} = await Contacts.getContactsAsync({
      fields:[Contacts.Fields.PhoneNumbers,
      Contacts.Fields.Emails]
    });
    updateCustomers(data);
    setMemContacts(data);
    // console.log(customers);
    setIsLoading(false);
  } 
  
  useEffect(() => {
    setIsLoading(true);
    loadContacts();
  }, [])

  const renderItem = ({item}) =>(
    
    <View style={{minHeight:70, padding:5}}>
      <TouchableOpacity onPress={() => alert('Item pressed!')}>
        <View
          style={{
            flexDirection: 'row',
            padding: 16,
            alignItems: 'center'
          }}>
          <Avatar
            size="medium"
            rounded
            title="MT"
            overlayContainerStyle={{backgroundColor: '#78bcc4'}}
            onPress={() => console.log("Works!")}
            activeOpacity={0.4}
          />
          <View
            style={{
              flexDirection: 'column',
              padding: 16,
            }}>
            <Text style={{color: '#78bcc4', fontWeight: 'bold', fontSize: 26}}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={{color:'#f7444e', fontWeight:'bold'}}>
            {item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : ""}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const searchContacts = (value) =>{
    
    const filteredContacts = inMemoryContacts.filter(
      contact => {
        let contactLowercase = (contact.firstName + ' ' + contact.lastName).toLowerCase()
        let searchTermLowercase = value.toLowerCase()

        return contactLowercase.indexOf(searchTermLowercase) > -1;
      }
    )
    updateCustomers(filteredContacts)
  }

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '5%'
        }}
      />
    )
  }


  return (
    <NavigationContainer>
          <GalioProvider theme={argonTheme}>
            <Block flex>
              <Screens />
            </Block>
          </GalioProvider>
        </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginLeft: 10,
    color:'#78bcc4',
    fontSize:20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  button : {
    backgroundColor: 'blue',
    padding:20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20, 
    color: '#fff',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});

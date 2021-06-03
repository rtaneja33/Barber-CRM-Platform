import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { firebase } from './src/firebase/config';
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from 'react-native-safe-area-context';

enableScreens();
import Screens from "./navigation/Screens";
import { Images, articles, argonTheme } from "./constants";
import BarberShops from './models/BarberShop';

export const BarberContext = React.createContext({});

export default function App() {
  const [barberContext, setBarberContext] = useState({})
  const getLoggedInBarbershop = async () => {
      // get User data
    await BarberShops.loadFromID(firebase.auth().currentUser.uid).then( barber => {
      setBarberContext(barber);
    })
    console.log("barber context isss", barberContext)
  }
  function onAuthStateChanged(user) {
    if(user !== null){
      // getLoggedInBarbershop();
      console.log("app js firebase state changed! user is", user);
      BarberShops.loadFromID(user.uid).then( barberObj => {
          if (barberObj != null) {
              setBarberContext(barberObj)
          }
      })
    }
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    console.log("App js firebase user is", firebase.auth().currentUser)
    return subscriber; // unsubscribe on unmount
  }, []);

  return ( // signed in
    <BarberContext.Provider value={barberContext}>
      <SafeAreaProvider>
          <NavigationContainer>
                <GalioProvider theme={argonTheme}>
                  <Block flex>
                    <Screens />
                  </Block>
                </GalioProvider>
          </NavigationContainer>
          </SafeAreaProvider>
    </BarberContext.Provider>
   
  )
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

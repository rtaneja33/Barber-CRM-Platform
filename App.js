import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth'
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
enableScreens();
import Screens from "./navigation/Screens";
import { Images, articles, argonTheme } from "./constants";


export default function App() {
  // from https://rnfirebase.io/auth/usage
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if(initializing)
      setInitializing(false);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if(initializing){
    return null
  }
  if(user){
    return ( // signed in
      <NavigationContainer>
            <GalioProvider theme={argonTheme}>
              <Block flex>
                <Screens />
              </Block>
            </GalioProvider>
      </NavigationContainer>
    )
  }
  else {
    return ( // signed out
      <NavigationContainer>
            <GalioProvider theme={argonTheme}>
              <Block flex>
                <Screens />
              </Block>
            </GalioProvider>
      </NavigationContainer>
    )
  }
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

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

const { width, height } = Dimensions.get("screen")

class SavePreferences extends React.Component {
    
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
                
                
                
                <View style={styles.subbox}>
                </View>
                
                <View style={styles.subbox}>
                    <TouchableOpacity style={styles.buttoncontinue} onPress={() => { alert('idk');}}>
                    <Text> Save to Profile </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.buttoncancel} onPress={() => { navigation.goBack(null);}}>
                    <Text> Back </Text>
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
    width: '95%',
    flexDirection:"row"
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
    borderRadius: 5,
    padding: 10
},
    
buttoncancel: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "skyblue",
    borderWidth: 2,
    borderRadius: 5,
    padding: 10
},
});

export default SavePreferences;

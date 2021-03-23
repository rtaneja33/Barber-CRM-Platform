import React, {PureComponent} from 'react';
import { Camera } from 'expo-camera';
import { View, StyleSheet } from 'react-native';
import {Text} from 'galio-framework';


export default class CustomCamera extends PureComponent {  
  
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
    })();

  }

  render() {
    return (
            <Camera style={styles.camera} type={Camera.Constants.Type.back}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.text}> Take Picture </Text>
                    </View>
                  </Camera>
      );
  }}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      margin: 20,
    },
    button: {
      flex: 0.1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      color: 'white',
    },
  });
    
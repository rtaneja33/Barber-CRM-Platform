import React, {PureComponent} from 'react';
import { Camera } from 'expo-camera';

export default class Camera extends PureComponent {  constructor(props) {
  super(props);}
    render() {
      return (
              <Camera style={styles.camera} type={Camera.Constants.Type.back}>
                      <View style={styles.buttonContainer}>
                          <Text style={styles.text}> Take Picture </Text>
                        </TouchableOpacity>
                      </View>
                    </Camera>
        );
  }}

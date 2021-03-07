import React, {PureComponent} from 'react';
import { Icon } from "../../components";
import { argonTheme } from "../../constants";
import {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { Block, Text} from "galio-framework";
import { Button } from "../../components";
import { firebase } from "../../src/firebase/config";

import { Camera } from 'expo-camera';
import Appointment from "../../models/Appointment"

class SideCamera extends PureComponent {
    state = {
        image: "",
        flash: 'off'
    }
    
    constructor(props) {
        super(props);
    }
    
    takePicture = () => {
          if (this.camera) {
              const options = {quality: 1, base64: true, flashMode: this.state.flash};
              this.camera.takePictureAsync(options).then(photo => {
                  this.setState({
                      image: photo
                  })
              });
          }
    }
    
    retake = () => {
        this.setState({
            image: ""
        })
    }
    
    confirm = () => {
        const { route, navigation } = this.props;
        const { backHandler } = this.props.route.params;
        // this.setState({ pickedImageFront: this.state.image });
        console.log("in confirm, received apt", apt);
        let apt = route.params.apt
        apt.appointmentSidePhotoUID = this.state.image.uri;
        console.log("Side Camera: apt isssss", apt);
        navigation.navigate("RearCamera",{apt: apt, backHandler: backHandler});
    }
    
    toggleFlash = () => {
        if (this.state.flash == 'on') {
            this.setState({
                flash: 'off'
            })
        } else {
            this.setState({
                flash: 'on'
            })
        }
    }
    
    getFlashIcon = () => {
        if (this.state.flash == 'on') {
            return "flash-on"
        } else {
            return "flash-off"
        }
    }
    
    render() {
        const { route } = this.props;
        
        if (this.state.image == "") {
            return (
                    <Camera flashMode={this.state.flash} style={styles.screen} type={Camera.Constants.Type.back} ref={(ref) => { this.camera = ref }}>
                    <View style={styles.screen}>
                      <View style={{flex: 2, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                    
                        <View style={styles.icons}>
                            <TouchableOpacity style={styles.buttoncontinue} onPress={ this.toggleFlash } >
                                <Icon size={25} color={'white'} name={this.getFlashIcon()} family="MaterialIcons" />
                            </TouchableOpacity>

                        </View>
                        <View style={styles.boxtitle}>
                    <Text style={styles.titletext}> Side Camera </Text>
                        </View>
                    
                    </View>
                    <View style={{flex: 4}}/>
                    <View style={{flex: 2, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <View style={[styles.bottomView]}>
                            <TouchableOpacity
                                hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
                                onPressIn={this.handlePressIn}
                                onPressOut = {this.handlePressOut}
                                onPress={this.takePicture}
                            >
                                <View style={[styles.embeddedBottomView, {backgroundColor: this.state.pressedIn ? 'white' : 'white' }]}/>
                            </TouchableOpacity>
                    </View>
                        
                </View>
              </View>
                    </Camera>
            );
        } else {
            
            return (
                <View style={ styles.container }>
                    <ImageBackground source={{uri: this.state.image.uri}} style={styles.backgroundImage}>
                    <View style={styles.screen}>
                    <View style={{flex: 2, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}/>
                    <View style={{flex: 4}}/>
                    <View style={{flex: 2, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                    <View style={styles.bottomViewLeft}>
                    <Button style={{ backgroundColor: 'transparent' }} onPress={this.retake}>
                    <Block column center>
                        <Icon
                        name="undo"
                        family="EvilIcons"
                        size={30}
                        color={"white"}
                        style={{ marginTop: 2, marginRight: 5 }}
                        />
                        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Retake</Text>
                    </Block>
                    </Button>
                    </View>
                        <View style={styles.bottomViewRight}>
                        <Button style={{ backgroundColor: 'transparent' }} onPress={this.confirm}>
                        <Block column center>
                            <Icon
                            name="arrow-right"
                            family="EvilIcons"
                            size={30}
                            color={"white"}
                            style={{ marginTop: 2, marginRight: 5 }}
                            />
                            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Confirm</Text>
                        </Block>
                        </Button>
                    </View>
                      
                      </View>
                      </View>
                    </ImageBackground>
                </View>
            );
        }
        
    }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column'
  },
  titletext: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  boxtitle: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "30%",
    width: "100%"
  },
  icons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "70%",
    right: "10%",
  },
  bottomView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: "40%",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 15,
    bottom: "20%"
  },
  embeddedBottomView: {
    justifyContent: "center",
    alignItems: "center",
    width: 55,
    height: 55,
    borderRadius: 35,
    borderColor: '#FFF',
    zIndex: 10,
  },
  takePictureView: {
    backgroundColor: "#EE5407",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "50%",
    height: "15%",
    bottom: "50%",
  },
  bottomViewLeft: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "30%",
    height: "15%",
    bottom: "50%",
    left: "5%",
  },
  bottomViewRight: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "30%",
    height: "15%",
    bottom: "50%",
    left: "65%",
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    //resizeMode: 'contain',
  },
});

export default SideCamera;

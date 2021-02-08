import React, { PureComponent } from "react";
import { Icon } from "../../components";
import { argonTheme } from "../../constants";
import { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { firebase } from "../../src/firebase/config";
import { Block, Text} from "galio-framework";
import { Button } from "../../components";
import { Camera } from "expo-camera";
import Appointment from "../../models/Appointment";

class FrontCamera extends PureComponent {
  

  constructor(props) {
    super(props);
    this.state = {
        image: "",
        flash: "off",
        pressedIn: false,
      };
  }

  takePicture = () => {
    
    if (this.camera) {
      const options = { quality: 1, base64: true, flashMode: this.state.flash };
      this.camera.takePictureAsync(options).then((photo) => {
        this.setState({
          image: photo,
        });
      });
    }
  };

  retake = () => {
    this.setState({
      image: "",
    });
  };

  confirm = () => {
    const { route, navigation } = this.props;
    // this.setState({ pickedImageFront: this.state.image });
    let apt = new Appointment();
    apt.barberUID = firebase.auth().currentUser.uid;
    apt.appointmentFrontPhotoUID = this.state.image.uri;
    apt.customerPhoneNumber = route.params.phoneNumber;
    console.log("apt isssss", apt);
    navigation.navigate("SideCamera", { apt: apt });
  };

  toggleFlash = () => {
    if (this.state.flash == "on") {
      this.setState({
        flash: "off",
      });
    } else {
      this.setState({
        flash: "on",
      });
    }
  };

  getFlashIcon = () => {
    if (this.state.flash == "on") {
      return "flash-on";
    } else {
      return "flash-off";
    }
  };

//   buttonStyles = {
//     backgroundColor:  this.state.pressedIn ? 'red' : 'blue'
//   }

  handlePressIn = () => {
      console.log("pressed in!")
    //   this.setState({ pressedIn: true })
      this.setState({ pressedIn: true })
    //   console.log("set buttonSTyle", this.state.buttonStyle)
  }
  handlePressOut = () => {
      this.setState({pressedIn: false})
  }
  render() {
    const { route } = this.props;
    console.log("RERENDERING")
    if (this.state.image == "") {
      return (
        <Camera
          flashMode={this.state.flash}
          style={styles.screen}
          type={Camera.Constants.Type.back}
          ref={(ref) => {
            this.camera = ref;
          }}
        >
          <View style={styles.icons}>
            <TouchableOpacity
              style={styles.buttoncontinue}
              onPress={this.toggleFlash}
            >
              <Icon
                size={25}
                color={"white"}
                name={this.getFlashIcon()}
                family="MaterialIcons"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.boxtitle}>
            <Text style={styles.titletext}> Front Camera </Text>
          </View>
          
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
        </Camera>
      );
    } else {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={{ uri: this.state.image.uri }}
            style={styles.backgroundImage}
          >
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
          </ImageBackground>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CDECFF",
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
    top: "8%",
  },
  icons: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "25%",
    right: "10%",
  },
  bottomView: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 15,
    bottom: "10%"
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
    width: "40%",
    height: "15%",
    bottom: "5%",
  },
  bottomViewLeft: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "30%",
    height: "15%",
    bottom: "5%",
    left: "5%",
  },
  bottomViewRight: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "30%",
    height: "15%",
    bottom: "5%",
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

export default FrontCamera;

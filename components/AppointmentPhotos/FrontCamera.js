import React, { PureComponent } from "react";
import { Icon } from "../../components";
import { argonTheme } from "../../constants";
import { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import { firebase } from "../../src/firebase/config";

import { Camera } from "expo-camera";
import Appointment from "../../models/Appointment";

class FrontCamera extends PureComponent {
  state = {
    image: "",
    flash: "off",
  };

  constructor(props) {
    super(props);
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

  render() {
    const { route } = this.props;

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
          <View style={styles.bottomView}>
            <TouchableOpacity
              style={styles.buttoncontinue}
              onPress={this.takePicture}
            >
              <Text> Take picture </Text>
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
              <TouchableOpacity onPress={this.retake}>
                <Text> Retake </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomViewRight}>
              <TouchableOpacity onPress={this.confirm}>
                <Text> Confirm </Text>
              </TouchableOpacity>
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
    backgroundColor: "#EE5407",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "40%",
    height: "15%",
    bottom: "5%",
  },
  bottomViewLeft: {
    backgroundColor: "#EE5407",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "30%",
    height: "15%",
    bottom: "5%",
    left: "5%",
  },
  bottomViewRight: {
    backgroundColor: "#EE5407",
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

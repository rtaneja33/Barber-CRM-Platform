import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  View,
  FlatList,
} from "react-native";
import { Button as GaButton, Block, Text, theme } from "galio-framework";
import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import Icon from "../components/Icon";
import { HeaderHeight } from "../constants/utils";
import { TouchableHighlight } from "react-native-gesture-handler";
import { firebase } from "../src/firebase/config";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { FlatGrid } from "react-native-super-grid";
import AppointmentPhoto from "../models/AppointmentPhoto";
import Customer from "../models/Customer";
import { LinearGradient } from 'expo-linear-gradient';

const BASE_SIZE = theme.SIZES.BASE;
const { width, height } = Dimensions.get("screen");
import * as ImageManipulator from "expo-image-manipulator";
import ImageLoad from "react-native-image-placeholder";
const thumbMeasure = (width - 48 - 32) / 3;
const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.99);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.loadAppointments();
    this.state = {
      appointments: [],
      activeSlide: 0,
      name: this.props.route.params.fullName,
      phoneNumber: this.props.route.params.phoneNumber,
    };

    // if (this.props.route.params != null && this.props.route.params.fullName != null && this.props.route.params.phoneNumber != null) {
    //     this.setState({
    //         appointments: [],
    //         activeSlide: 0,
    //         name: this.props.route.params.fullName,
    //         phoneNumber: this.props.route.params.phoneNumber,
    //     });
    // } else {
    //     Customer.loadFromID(firebase.auth().currentUser.uid).then( customer => {
    //         console.log(customer);
    //         this.setState({
    //             appointments: [],
    //             activeSlide: 0,
    //             name: customer.name,
    //             phoneNumber: customer.phonenumber,
    //         });
    //         console.log("calling load appointments...")
    //     })
    // }
  }

  _renderItem({ item, index }) {
    return (
      <ImageLoad
        style={styles.image}
        loadingStyle={{ size: "small", color: argonTheme.COLORS.HEADER }}
        source={{ uri: item }}
      />
    );
  }
  //  componentWillMount() {
  //      if (this.props.route.params != null && this.props.route.params.fullName != null && this.props.route.params.phoneNumber != null) {
  //          this.setState({name: this.props.route.params.fullName, phoneNumber: this.props.route.params.phoneNumber});
  //      } else {
  //          Customer.loadFromID(firebase.auth().currentUser.uid).then( customer => {
  //              console.log(customer);
  //              this.setState({name: customer.name, phoneNumber: customer.phonenumber});
  //              this.loadAppointments()
  //          })
  //      }
  //   console.log(this.props.route)
  // }

  onBackHandler = () => {
    console.log("just had onBackHandler called from Profile");
    this.loadAppointments();
    this.forceUpdate();
  };

  get pagination() {
    const { activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={3}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  saveFrontPhotoUrl = async (data) => {
    if (data != null && data["appointmentFrontPhotoUID"] != "") {
      await AppointmentPhoto.loadFromID(data["appointmentFrontPhotoUID"]).then(
        (photo) => {
          const url = photo.photoURL;
          console.log("front photo url is", url);
          data["frontPhotoURL"] = url;
        }
      );
    }
  };

  saveSidePhotoUrl = async (data) => {
    if (data != null && data["appointmentSidePhotoUID"] != "") {
      await AppointmentPhoto.loadFromID(data["appointmentSidePhotoUID"]).then(
        (photo) => {
          const url = photo.photoURL;
          console.log("side photo url is", url);
          data["sidePhotoURL"] = url;
        }
      );
    }
  };

  saveRearPhotoUrl = async (data) => {
    if (data != null && data["appointmentRearPhotoUID"] != "") {
      await AppointmentPhoto.loadFromID(data["appointmentRearPhotoUID"]).then(
        (photo) => {
          const url = photo.photoURL;
          console.log("rear photo url is", url);
          data["rearPhotoURL"] = url;
        }
      );
    }
  };

  async loadAppointments() {
    //const { fullName, phoneNumber } = this.props.route.params;
    const { fullName, phoneNumber } = this.props.route.params;
    console.log(
      "load appoinmtnets recieved fullname and phone num of",
      fullName,
      phoneNumber
    );
    // fullName = this.state.name;
    // const phoneNumber = this.props.route.params.phoneNumber;
    var extractedNumber = phoneNumber.match(/\d/g);
    extractedNumber = extractedNumber.join("");
    const references = await firebase
      .firestore()
      .collection("Appointments")
      .where("customerPhoneNumber", "==", extractedNumber)
      .orderBy("timestamp", "desc")
      .get();
    var appointmentsToAdd = [];
    console.log("has this many appointments", references.size);
    references.forEach((document) => {
      let data = document.data();
      console.log(data);
      Promise.all([
        this.saveFrontPhotoUrl(data),
        this.saveSidePhotoUrl(data),
        this.saveRearPhotoUrl(data),
      ]).then((responses) => {
        console.log("pushing updated data....");
        appointmentsToAdd.push(data);
        this.setState({
          appointments: appointmentsToAdd,
        });
      });
    });
  }

  parsePreferences = (serviceReceived) => {
    console.log("service received", serviceReceived);
    if (serviceReceived.length < 1) {
      return null;
    }
    var preferences = [];
    for (const key in serviceReceived) {
      serviceReceived[key].map((arrayElem) => {
        preferences.push({ name: arrayElem });
      });
    }
    //console.log("returning...", preferences);
    return preferences;
  };
  
  renderAppointments = () => {
    const { navigation } = this.props;

    const renderItem = ({ item }) => {
      var pageLength = 0;
      if (item.frontPhotoURL != null && item.frontPhotoURL.length > 0) {
        pageLength += 1;
      }
      if (item.sidePhotoURL != null && item.sidePhotoURL.length > 0) {
        pageLength += 1;
      }
      if (item.rearPhotoURL != null && item.rearPhotoURL.length > 0) {
        pageLength += 1;
      }
      const options = { year: "numeric", month: "long", day: "numeric" };
      return (
        <View style={[styles.profileCard, { minHeight: 70 }]}>
          <Block row center shadow space="between" key="test">
            <Block flex>
              <Text
                style={{
                  color: argonTheme.COLORS.MUTED,
                  fontWeight: "bold",
                  textAlign: "right",
                  alignSelf: "stretch",
                }}
                size={BASE_SIZE * 0.8}
                muted
              >
                {item.timestamp.toDate().toLocaleDateString("en-US", options)} @{" "}
                {item.shopName}
              </Text>
              <View style={{ marginTop: 10 }}>
                <Carousel
                  data={[
                    item.frontPhotoURL,
                    item.sidePhotoURL,
                    item.rearPhotoURL,
                  ]}
                  renderItem={this._renderItem}
                  windowSize={1}
                  sliderWidth={SLIDER_WIDTH}
                  itemWidth={ITEM_WIDTH}
                  onSnapToItem={(index) =>
                    this.setState({ activeSlide: index })
                  }
                />
                <Pagination
                  dotsLength={pageLength}
                  activeDotIndex={this.state.activeSlide}
                  containerStyle={{ backgroundColor: "transparent" }}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: "rgba(0,0,0,.75)",
                  }}
                  inactiveDotStyle={
                    {
                      // Define styles for inactive dots here
                    }
                  }
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
              </View>
              {Object.keys(item.serviceProvided).length > 0 ? (
                <Block>
                  <Text
                    style={{
                      color: argonTheme.COLORS.HEADER,
                      fontWeight: "600",
                    }}
                    size={BASE_SIZE * 1.125}
                  >
                    Services Received:
                  </Text>
                  <FlatGrid
                    itemDimension={130}
                    data={this.parsePreferences(item.serviceProvided)}
                    style={styles.gridView}
                    // staticDimension={300}
                    // fixed
                    spacing={10}
                    renderItem={({ item }) => (
                      <View style={styles.itemContainer}>
                        <Text style={styles.itemName}>{item.name}</Text>
                      </View>
                    )}
                  />
                </Block>
              ) : (
                <></>
              )}
              {item.notes.length > 0 ? (
                <Block>
                  <Text
                    style={{
                      color: argonTheme.COLORS.HEADER,
                      fontWeight: "600",
                    }}
                    size={BASE_SIZE * 1.125}
                  >
                    Appointment Notes:
                  </Text>
                  <Text
                    style={{
                      color: "#808080",
                      paddingVertical: 6,
                      fontWeight: "bold",
                    }}
                    size={BASE_SIZE * 0.875}
                    muted
                  >
                    {" "}
                    {item.notes}
                  </Text>
                </Block>
              ) : (
                <></>
              )}
            </Block>
          </Block>
        </View>
      );
    };

    return (
      <View>
        <FlatList
          data={this.state.appointments}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  render() {
    console.log("before finding fullname");
    console.log(this.props);

    const fullName = this.state.name;
    const phoneNumber = this.state.phoneNumber;
    console.log("full name and phone are", fullName, phoneNumber);
    const { navigation } = this.props;
    console.log("PHONE NUMBER IS", phoneNumber);
    console.log("IN RENDER PROFILE, full name is", fullName);
    return (
      <Block flex style={styles.profile}>
        <Block flex>
            <LinearGradient
            // Background Linear Gradient
            colors={['rgba(255,255,255,1)','rgba(97,181,255,.6)']}
            //colors={['rgba(97,181,255,1)', 'rgba(82,95,127,1)']}
            style={styles.background}
          >
          {/* <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          > */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            style={{ width, marginTop: "20%", paddingTop: 50 }}
          >
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                <Image
                  source={{ uri: Images.ProfilePicture }}
                  style={styles.avatar}
                />
              </Block>
              <Block middle style={styles.nameInfo}>
                <Text bold size={28} color="#32325D">
                  {fullName}
                </Text>
                {/* <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      San Francisco, USA
                    </Text> */}
                <Text bold size={17} color="#525F7F" style={{ marginTop: 10 }}>
                  <Icon
                    size={15}
                    color={argonTheme.COLORS.ICON}
                    name="mobile1"
                    family="AntDesign"
                  />
                  {phoneNumber.length > 0 ? phoneNumber : "No phone provided."}
                </Text>
              </Block>
              <Block
                middle
                row
                space="evenly"
                style={{
                  marginTop: 20,
                  paddingBottom: 24,
                  marginHorizontal: 20,
                }}
              >
                <Button
                  style={{ ...styles.socialButtons, marginRight: 30 }}
                  onPress={() =>
                    navigation.navigate("FrontCamera", {
                      phoneNumber: phoneNumber,
                      backHandler: this.onBackHandler.bind(this),
                    })
                  }
                >
                  <Block column center>
                    <Icon
                      name="add-a-photo"
                      family="MaterialIcons"
                      size={30}
                      color={"white"}
                      style={{ marginTop: 2, marginRight: 5 }}
                    />
                    <Text style={styles.socialTextButtons}>ADD PHOTO</Text>
                  </Block>
                </Button>
                <Button
                  style={{
                    ...styles.socialButtons,
                    marginRight: 30,
                    backgroundColor: "#172B4D",
                  }}
                >
                  <Block column center>
                    <Icon
                      name="mode-edit"
                      family="MaterialIcons"
                      size={30}
                      color={"white"}
                      style={{ marginTop: 2, marginRight: 5 }}
                    />
                    <Text style={styles.socialTextButtons}>ADD NOTES</Text>
                  </Block>
                </Button>
              </Block>

              <Block flex>
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>
              </Block>
            </Block>
            <Block row space="between">
              <Text bold size={22} style={styles.title}>
                Appointments
              </Text>
            </Block>
            <Block flex={1}>{this.renderAppointments()}</Block>
          </ScrollView>
          </LinearGradient>
          {/* </ImageBackground> */}
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
  },
  albumThumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 2,
  },
  background: {
    flex: 1, 
  },
  info: {
    paddingHorizontal: 40,
    marginTop: 15,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -63,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 62,
    borderWidth: 3,
    borderColor: "white",
  },
  nameInfo: {
    marginTop: 15,
  },
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 1,
    marginTop: 22,
    color: "#172B4D",
  },
  group: {
    paddingTop: theme.SIZES.BASE,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  socialButtons: {
    width: width / 3,
    aspectRatio: 2,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  socialTextButtons: {
    marginTop: 5,
    color: "white",
    fontWeight: "800",
    fontSize: 14,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  profileCard: {
    // position: "relative",
    marginHorizontal: 3,
    padding: theme.SIZES.BASE,
    marginTop: 7,
    borderRadius: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    //ios
    shadowRadius: 8,
    shadowOpacity: 0.15,
    zIndex: 2,
    //android
    elevation: 3,
  },
  image: {
    width: width - theme.SIZES.BASE * 2 - 6,
    aspectRatio: 1,
    //resizeMode: 'contain',
  },
  gridView: {
    marginTop: 1,
    flex: 1,
  },
  itemContainer: {
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    paddingVertical: 7,
    backgroundColor: argonTheme.COLORS.BARBERBLUE,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    alignContent: "center",
  },
});

export default Profile;

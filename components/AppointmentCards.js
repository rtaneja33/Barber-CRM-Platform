// https://github.com/KPS250/React-Native-Accordion/tree/simple-accordian
import React from 'react';


const { width, height } = Dimensions.get("screen");
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
import { Images, argonTheme } from "../constants";
import Icon from "../components/Icon";
import { HeaderHeight } from "../constants/utils";
import { firebase } from "../src/firebase/config";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { FlatGrid } from "react-native-super-grid";
import AppointmentPhoto from "../models/AppointmentPhoto";
import AppointmentCard from "./AppointmentCard";
const BASE_SIZE = theme.SIZES.BASE;
import ImageLoad from "react-native-image-placeholder";
const thumbMeasure = (width - 48 - 32) / 3;
const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.99);

class AppointmentCards extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            activeSlide: 0,
            references: []
        }
        console.log("this.props.references is", this.props.references)
        this.onEndReachedCalledDuringMomentum = false
    }

    onMomentumScrollBegin = () => { this.onEndReachedCalledDuringMomentum = false; }

    updateItems = (incomingAppointments) => {
      this.setState({
        appointments: incomingAppointments
      })
    }

    componentDidMount(){
        console.log("in apt cards, references passed in were this long", this.state.references.length, "and were", this.state.references)
        //this.loadAppointments(this.state.references).then((response)=>{console.log(response); });
    }

    async loadAppointments(references) { //this.state.references
        //const { fullName, phoneNumber } = this.props.route.params;
        console.log("CALLED loadAppointments in appt cards")
        var appointmentsToAdd = [];
        // console.log("appointment cards - has this many appointments", references.size);
        references.forEach((data) => {
          console.log("IN LOAD APPOINTMENTS, document is", data)
          // console.log(data);
          Promise.all([
            this.saveFrontPhotoUrl(data),
            // this.saveSidePhotoUrl(data),
            // this.saveRearPhotoUrl(data),
          ]).then((responses) => {
            // console.log("UPDATING APPOINTMNET STATE....");
            appointmentsToAdd.push(data);
            this.setState({
              appointments: appointmentsToAdd,
            });
            // console.log("this.state.appointmentz", this.state.appointments)
          });
        });
      }
    


    saveFrontPhotoUrl = async (data) => {
        if (data != null && data["appointmentFrontPhotoUID"] != "") {
          // console.log("calling saveSideXUrl with uid of ", data["appointmentFrontPhotoUID"]);
          await AppointmentPhoto.loadFromID(data["appointmentFrontPhotoUID"]).then(
            (photo) => {
              //// console.log("photo returned in saveXXXPhotoURl", photo);

              const url = photo.photoURL;
              // console.log("front photo url is", url);
              data["frontPhotoURL"] = url;
            }
          );
        }
      };
    
      saveSidePhotoUrl = async (data) => {
        if (data != null && data["appointmentSidePhotoUID"] != "") {
          // console.log("calling saveSideXUrl with uid of ", data["appointmentSidePhotoUID"]);
          await AppointmentPhoto.loadFromID(data["appointmentSidePhotoUID"]).then(
            (photo) => {
           //   // console.log("photo returned in saveXXXPhotoURl", photo);

              const url = photo.photoURL;
              // console.log("side photo url is", url);
              data["sidePhotoURL"] = url;
            }
          );
        }
      };
    
      saveRearPhotoUrl = async (data) => {
        if (data != null && data["appointmentRearPhotoUID"] != "") {
          // console.log("calling saveSideXUrl with uid of ", data["appointmentRearPhotoUID"]);
          await AppointmentPhoto.loadFromID(data["appointmentRearPhotoUID"]).then(
            (photo) => {
          //    // console.log("photo returned in saveXXXPhotoURl", photo);
              const url = photo.photoURL;
              // console.log("rear photo url is", url);
              data["rearPhotoURL"] = url;
            }
          );
        }
      };
      parsePreferences = (serviceReceived) => {
        //// console.log("service received", serviceReceived);
        if (serviceReceived.length < 1) {
          return null;
        }
        var preferences = [];
        for (const key in serviceReceived) {
          serviceReceived[key].map((arrayElem) => {
            preferences.push({ name: arrayElem });
          });
        }
        //// console.log("returning...", preferences);
        return preferences;
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

    _renderItem({ item, index }) {
        return (
          <ImageLoad
            style={styles.image}
            loadingStyle={{ size: "small", color: argonTheme.COLORS.HEADER }}
            source={{ uri: item }}
          />
        );
        }

    renderItem = ({item}) => {
        console.log("rendering item........")
        return (
          <AppointmentCard 
            appointment={item} 
          />
        )
      };
    
      loadMoreProducts = () => {
        console.log("load more products called!")
      }

      onEndReached = () => {
        console.log('end reached');
        if (!this.onEndReachedCalledDuringMomentum) {
            console.log('loading more archived products');
            this.loadMoreProducts();                
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

      render () {
        return (
            <View>
              <FlatList
                data={this.state.appointments}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                // initialNumToRender={4}
                // windowSize={1}
                // onEndReachedThreshold={0}
                // onEndReached={(distance)=>{console.log("reached end!!", distance)}}
              />
            </View>
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

export default AppointmentCards;
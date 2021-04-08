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

const BASE_SIZE = theme.SIZES.BASE;
import ImageLoad from "react-native-image-placeholder";
const thumbMeasure = (width - 48 - 32) / 3;
const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.99);

class AppointmentCard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
            item: this.props.appointment
        }
    }
    parsePreferences = (serviceReceived) => {
        //// console.log("service received", serviceReceived);
        console.log("item in apt card is", this.state.item);

        if (serviceReceived.length < 1) {
          return null;
        }
        var preferences = [];
        for (const key in serviceReceived) {
          serviceReceived[key].map((arrayElem) => {
            preferences.push({ name: arrayElem });
          });
        }
        console.log("returning...", preferences);
        return preferences;
      };
      _renderItem({ item, index }) {
        return (
          <ImageLoad
            style={styles.image}
            loadingStyle={{ size: "small", color: argonTheme.COLORS.HEADER }}
            source={{ uri: item }}
          />
        );
    }
    saveSidePhotoUrl = async (index) => {
        var data = {...this.state.item}
        if (data != null && data["appointmentSidePhotoUID"] != "") {
          return new Promise(resolve => {
          // console.log("calling saveSideXUrl with uid of ", data["appointmentSidePhotoUID"]);
            AppointmentPhoto.loadFromID(data["appointmentSidePhotoUID"]).then(
            (photo) => {
           //   // console.log("photo returned in saveXXXPhotoURl", photo);
              if(photo.photoURL){
                const url = photo.photoURL;
                console.log("side photo url is", url);
                data["sidePhotoURL"] = url;
                console.log("RETURNING data : ", data)
                resolve(data)
              }
              else{
                  resolve(null)
              }
            }
          );
        });
      }
      return null
    };
    
      saveRearPhotoUrl = async (index) => {
        var data = {...this.state.item}
        if (data != null && data["appointmentRearPhotoUID"] != "") {
          return new Promise(resolve => {
          // console.log("calling saveSideXUrl with uid of ", data["appointmentSidePhotoUID"]);
            AppointmentPhoto.loadFromID(data["appointmentRearPhotoUID"]).then(
            (photo) => {
           //   // console.log("photo returned in saveXXXPhotoURl", photo);
              if(photo.photoURL){
                const url = photo.photoURL;
                data["rearPhotoURL"] = url;
                resolve(data)
              }
              else{
                  resolve(null)
              }
            }
          );
        });
      }
      return null
      };

    render() {
          const { navigation } = this.props;
          var pageLength = 0;

          if (this.state.item.appointmentFrontPhotoUID.length >0) {
            console.log("YES,", this.state.item.appointmentFrontPhotoUID)
            pageLength += 1;
          }
          if (this.state.item.appointmentSidePhotoUID.length >0) {
            pageLength += 1;
          }
          if (this.state.item.appointmentRearPhotoUID.length >0) {
            pageLength += 1;
          }
          console.log("page Length in apt card is", pageLength);
          const options = { year: "numeric", month: "long", day: "numeric" };
          let dateString = this.state.item.timestamp.toDate().toLocaleDateString("en-US", options) 
          if(!this.props.barberFacing){
            const dateDetail = " @ " + this.state.item.shopName;
            dateString += dateDetail
          }
          console.log("this.state.item.frontPhotoURL is", this.state.item.frontPhotoURL);
          return (
            <View style={[styles.profileCard, { minHeight: 70 }]}>
              <Block row center shadow space="between" key="test">
                <Block flex>
                  {
                    this.props.barberFacing ? 
                    <Text
                      style={{
                        color: argonTheme.COLORS.HEADER,
                        fontWeight: "bold",
                        textAlign: "left",
                        alignSelf: "stretch",
                        marginLeft: 5,
                      }}
                      size={BASE_SIZE*1.2}
                      muted
                    >
                      {this.state.item.customerFullName}
                    </Text> : 
                    <></>
                  }
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
                    { dateString }
                  </Text>
                  <View style={{ marginTop: 10 }}>
                    <Carousel
                      data={[
                        this.state.item.frontPhotoURL,
                        this.state.item.sidePhotoURL,
                        this.state.item.rearPhotoURL,
                      ]}
                      renderItem={this._renderItem}
                      windowSize={1}
                      sliderWidth={SLIDER_WIDTH}
                      itemWidth={ITEM_WIDTH}
                      onSnapToItem={async (index) =>
                        {
                            var newImageAppointment = null
                            console.log("SNAP TO ITEM", index)
                            if(index == 1){
                                await this.saveSidePhotoUrl(index).then((updatedApt) => {
                                    newImageAppointment = updatedApt
                                })
                            }
                            else if(index == 2){
                                await this.saveRearPhotoUrl(index).then((updatedApt) => {
                                    newImageAppointment = updatedApt
                                })
                            }

                            if(newImageAppointment){
                                console.log("UPDATED APT", newImageAppointment)
                                this.setState({
                                    item: newImageAppointment,
                                    activeSlide: index
                                })
                            }
                            else {
                                this.setState({
                                    activeSlide: index
                                })
                            }
                        }
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
                  {Object.keys(this.state.item.serviceProvided).length > 0 ? (
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
                        data={this.parsePreferences(this.state.item.serviceProvided)}
                        style={styles.gridView}
                        // staticDimension={300}
                        // fixed
                        spacing={10}
                        renderItem={({ item }) => {
                        return (
                          <View style={styles.itemContainer}>
                            <Text style={styles.itemName}>{item.name}</Text>
                          </View>
                        )}}
                      />
                    </Block>
                  ) : (
                    <></>
                  )}
                  {this.state.item.notes.length > 0 ? (
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
                        {this.state.item.notes}
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

  export default AppointmentCard;
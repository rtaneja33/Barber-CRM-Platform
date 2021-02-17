import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  View,
  FlatList
} from "react-native";
import { Button as GaButton, Block, Text, theme } from "galio-framework";
import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import Icon from "../components/Icon";
import { HeaderHeight } from "../constants/utils";
import { TouchableHighlight } from "react-native-gesture-handler";
import { firebase } from '../src/firebase/config'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AppointmentPhoto from "../models/AppointmentPhoto"
const BASE_SIZE = theme.SIZES.BASE;
const { width, height } = Dimensions.get("screen");
import * as ImageManipulator from 'expo-image-manipulator';
import ImageLoad from 'react-native-image-placeholder';
const thumbMeasure = (width - 48 - 32) / 3;
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.99);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);

class Profile extends React.Component {
    state = {
        appointments: [],
        activeSlide: 0,
    };
      _renderItem ({item, index}) {
        return <ImageLoad
            style={styles.image}
            loadingStyle={{ size: 'small', color: argonTheme.COLORS.HEADER }}
            source={{uri: item}}
        />
    }
    get pagination () {
      const { activeSlide } = this.state;
      return (
          <Pagination
            dotsLength={3}
            activeDotIndex={activeSlide}
            containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
            dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.92)'
            }}
            inactiveDotStyle={{
                // Define styles for inactive dots here
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
      );
  }

    componentWillMount() {
        this.loadAppointments()
    }

    saveFrontPhotoUrl = async (data) => {
      if (data["appointmentFrontPhotoUID"] != "") {
        await AppointmentPhoto.loadFromID(data["appointmentFrontPhotoUID"]).then(photo => {
           const url = photo.photoURL
           console.log("front photo url is", url);
           data["frontPhotoURL"] = url;
        });
    } 
    }

    saveSidePhotoUrl = async (data) => {
      if (data["appointmentSidePhotoUID"] != "") {
        await AppointmentPhoto.loadFromID(data["appointmentSidePhotoUID"]).then(photo => {
           const url = photo.photoURL
           console.log("side photo url is", url);
           data["sidePhotoURL"] = url;
        });
    } 
    }
    
    saveRearPhotoUrl = async (data) => {
      if (data["appointmentRearPhotoUID"] != "") {
        await AppointmentPhoto.loadFromID(data["appointmentRearPhotoUID"]).then(photo => {
           const url = photo.photoURL
           console.log("rear photo url is", url);
           data["rearPhotoURL"] = url;
        });
    } 
    }

    async loadAppointments() {
        const { fullName, phoneNumber } = this.props.route.params;
        
        const references = await firebase.firestore().collection('Appointments').where("customerPhoneNumber", '==', phoneNumber.replace(/\D/g,'')).get();
        
        
        references.forEach(document => {
            let data = document.data();
            
            var appointmentsToAdd = this.state.appointments
            Promise.all([ this.saveFrontPhotoUrl(data), this.saveSidePhotoUrl(data), this.saveRearPhotoUrl(data) ])
                .then((responses)=>{
                  console.log("pushing updated data....");
                  appointmentsToAdd.push(data);
                  this.setState({
                      appointments: appointmentsToAdd
                  })
                })
        });
    }
    
  renderAppointments = () => {
      const { navigation } = this.props;
          
      const renderItem = ({item}) => {
        var pageLength = 0;
        if(item.frontPhotoURL.length > 0){
          pageLength += 1
        }
        if(item.sidePhotoURL.length > 0){
          pageLength += 1
        }
        if(item.rearPhotoURL.length > 0){
          pageLength += 1
        }
        return (
        <View style={[styles.profileCard, {minHeight:70}]}>

          <Block row center shadow space="between" style={styles.card} key="test">
            <Block flex>
              <Text style={{ color: "#2f363c",fontSize: 20, fontWeight: '600' }} size={BASE_SIZE * 1.125}>{Object.keys(item.serviceProvided)[0]}</Text>
              <Text style={{ color: "#808080", paddingTop: 2 }} size={BASE_SIZE * 0.875} muted>{item.notes}</Text>
             <View>
                <Carousel
                  data={[item.frontPhotoURL, item.sidePhotoURL, item.rearPhotoURL]}
                  renderItem={this._renderItem}
                  windowSize={1}
                  sliderWidth={SLIDER_WIDTH}
                  itemWidth={ITEM_WIDTH}
                  onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                />
                <Pagination
                  dotsLength={pageLength}
                  activeDotIndex={this.state.activeSlide}
                  containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                  dotStyle={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginHorizontal: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.92)'
                  }}
                  inactiveDotStyle={{
                      // Define styles for inactive dots here
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
            </View>
                                   
            </Block>
          </Block>

        </View>
      )};
          
      return (
          <View>
              <FlatList
                data={this.state.appointments}
                renderItem={renderItem}
                keyExtractor={(item, index)=> index.toString()}
              />
          </View>
        );
    };

  render() {
    console.log("before finding fullname");
    console.log(this.props);
    const { fullName, phoneNumber } = this.props.route.params;
    const { navigation } = this.props;
    console.log("PHONE NUMBER IS", phoneNumber)
    console.log("IN RENDER PROFILE, full name is", fullName);
    return (
      
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '20%', paddingTop: 50 }}
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
                      { fullName }
                    </Text>
                    {/* <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      San Francisco, USA
                    </Text> */}
                    <Text
                        bold
                        size={17}
                        color="#525F7F"
                        style={{ marginTop: 10}}
                      >
                        <Icon
                          size={15}
                          color={argonTheme.COLORS.ICON}
                          name="mobile1"
                          family="AntDesign"
                        />
                        { ((phoneNumber.length > 0) ? phoneNumber : "No phone provided.")}
                      </Text>
                </Block>
                <Block style={styles.info}>
                  <Block row space="evenly">
                  {/* <Block middle>
                  <Icon
                    size={20}
                    color={argonTheme.COLORS.ICON}
                    name="mobile1"
                    family="AntDesign"
                  />
                  </Block> */}
                    {/* <Block middle>
                      <Text
                        bold
                        size={18}
                        color="#525F7F"
                        style={{ marginBottom: 4, marginLeft: 20}}
                      >
                        <Icon
                          size={20}
                          color={argonTheme.COLORS.ICON}
                          name="mobile1"
                          family="AntDesign"
                        />
                        { ((phoneNumber.length > 0) ? phoneNumber : "No phone provided.")}
                      </Text>
                      {/* <Text size={12} color={argonTheme.COLORS.TEXT}>MOBILE</Text> */}
                    {/* </Block>  */}
                  </Block>
                </Block>
                <Block center>
                      <Button 
                        style={styles.button}  onPress={() => navigation.navigate('FrontCamera', {phoneNumber: phoneNumber})}
                      >
                        Add Appointment Photos
                      </Button>
                </Block>
                <Block center>
                      <Button
                        color="default"
                        textStyle={{ color: "white", fontSize: 12, fontWeight: "700" }}
                        style={styles.button}
                      >
                        Add Preferences
                      </Button>
                </Block>
                <Block
                    middle
                    row
                    space="evenly"
                    style={{ marginTop: 20, paddingBottom: 24, marginHorizontal: 20 }}
                  >
                      <Button style={{ ...styles.socialButtons, marginRight: 30 }}>
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
                      <Button style={{ ...styles.socialButtons, marginRight: 30, backgroundColor: '#172B4D' }}>
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
            <Block flex={1}>
                  {this.renderAppointments()}
              </Block>

            </ScrollView>
          </ImageBackground>
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
    height: thumbMeasure
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 60,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40,
    marginTop: 15
  },
  avatarContainer: {
    position: "relative",
    marginTop: -63
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 62,
    borderWidth: 3,
    borderColor: "white"
  },
  nameInfo: {
    marginTop: 15
  },
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 1,
    marginTop: 22,
    color: argonTheme.COLORS.HEADER
  },
  group: {
    paddingTop: theme.SIZES.BASE
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  socialButtons: {
    width: 120,
    height: 65,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    marginTop: 5,
    color: "white",
    fontWeight: "800",
    fontSize: 14
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  },
  profileCard: {
    // position: "relative",
    marginHorizontal: 8,
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
    height: 300,
    //resizeMode: 'contain',
  }
});

export default Profile;

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

import AppointmentPhoto from "../models/AppointmentPhoto"

const BASE_SIZE = theme.SIZES.BASE;
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class Profile extends React.Component {
    state = {
        appointments: []
    };
    
    componentWillMount() {
        this.loadAppointments()
    }
    
    async loadAppointments() {
        const { fullName, phoneNumber } = this.props.route.params;
        
        const references = await firebase.firestore().collection('Appointments').where("customerPhoneNumber", '==', phoneNumber.replace(/\D/g,'')).get();
        
        
        references.forEach(document => {
            let data = document.data();
            
            var appointmentsToAdd = this.state.appointments
            
            if (data["appointmentFrontPhotoUID"] != "") {
                const photo = AppointmentPhoto.loadFromID(data["appointmentFrontPhotoUID"]).then(photo => {
                   const url = photo.photoURL
                    
                    data["frontPhotoURL"] = url;
                    appointmentsToAdd.push(data);
                    this.setState({
                        appointments: appointmentsToAdd
                    })
                });
            } else {
                appointmentsToAdd.push(data);
                this.setState({
                    appointments: appointmentsToAdd
                })
                console.log("HEY!")
                console.log(this.state.appointments)
            }
        });
        
        
    }
    
  renderAppointments = () => {
      const { navigation } = this.props;
          
      const renderItem = ({item}) => (
        <View style={{minHeight:70, padding:5}}>

          <Block row center shadow space="between" style={styles.card} key="test">
            <Block flex>
              <Text style={{ color: "#2f363c",fontSize: 20, fontWeight: '600' }} size={BASE_SIZE * 1.125}>{item.serviceProvided}</Text>
              <Text style={{ color: "#808080", paddingTop: 2 }} size={BASE_SIZE * 0.875} muted>{item.notes}</Text>
              {item.frontPhotoURL != null ? (
                 <Image style={styles.image} source={{uri: item.frontPhotoURL}} />
              ) :
              <View>
              <Text>No image yet</Text>
              </View>
            }
                                   
            </Block>
          </Block>

        </View>
      );
          
      return (
          <View>
              <Block row space="between">
                <Text bold size={18} style={styles.title}>
                  Appointments
                </Text>
              </Block>
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
              style={{ width, marginTop: '20%' }}
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
                        style={styles.button}  onPress={() => navigation.navigate('AddAppointment', {phoneNumber: phoneNumber})}
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

                        {/* <Button
                        small
                        style={{ backgroundColor: argonTheme.COLORS.INFO }}
                      >
                        ADD PHOTO
                      </Button>
                    <Button
                      small
                      style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                    >
                      MESSAGE
                    </Button> */}
                  </Block>
                  
                <Block flex>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  

                  {/* {this.renderAlbum()} */}


                  {/* <Block middle>
                    <Text
                      size={16}
                      color="#525F7F"
                      style={{ textAlign: "center" }}
                    >
                      An artist of considerable range, Jessica name taken by
                      Melbourne …
                    </Text>
                    <Button
                      color="transparent"
                      textStyle={{
                        color: "#233DD2",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    >
                      Show more
                    </Button>
                  </Block>
                  <Block
                    row
                    space="between"
                  >
                    <Text bold size={16} color="#525F7F" style={{marginTop: 12}}>
                      Album
                    </Text>
                    <Button
                      small
                      color="transparent"
                      textStyle={{ color: "#5E72E4", fontSize: 12, marginLeft: 24 }}
                    >
                      View all
                    </Button>
                  </Block>
                  <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                    <Block row space="between" style={{ flexWrap: "wrap" }}>
                      {Images.Viewed.map((img, imgIndex) => (
                        <Image
                          source={{ uri: img }}
                          key={`viewed-${img}`}
                          resizeMode="cover"
                          style={styles.thumb}
                        />
                      ))}
                    </Block>
                  </Block> */}
                </Block>
              </Block>
            <Block flex={1} style={styles.profileCard}>
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
    flex: 1
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
    paddingHorizontal: theme.SIZES.BASE * 2,
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
    flex: 1
    //resizeMode: 'contain',
  }
});

export default Profile;

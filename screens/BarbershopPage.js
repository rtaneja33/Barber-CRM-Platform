import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  BackHandler
} from "react-native";
import Modal from "react-native-modal";
import { validateContent } from '../constants/utils';
import CustomForm from "../components/CustomForm";
import { ListItem } from 'react-native-elements';
import Icon from "../components/Icon";
import { firebase } from "../src/firebase/config";
import { Accordian, renderSeparator } from "../components";
import BarberShops from "../models/BarberShop";
import { Block, Text, theme, Button as GaButton } from "galio-framework";
import Spinner from "react-native-loading-spinner-overlay";
import { Button } from "../components";
import {
  Images,
  argonTheme as nowTheme,
  Service,
  ServiceList,
  articles,
  argonTheme,
} from "../constants";
import { HeaderHeight } from "../constants/utils";
import { Avatar, Accessory } from "react-native-elements";
import BarberShop from "../models/BarberShop";
const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - nowTheme.SIZES.BASE * 2;

const BarbershopPage = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [barberModalVisible, setBarberModalVisible] = React.useState(false);
  const [spinner, setSpinner] = React.useState(true);
  const [isOwner, setIsOwner] = React.useState(false);
  const [shopInformation, setShopInformation] = useState({});
  const [clickedBarber, setClickedBarber] = useState(-1);
  useEffect(() => {
    setSpinner(true);
    if (route != null && route.params != null && route.params.shopID != null) {
      setIsOwner(false);
      BarberShops.loadFromID(route.params.shopID).then((shopInfo) => {
        setShopInformation(shopInfo);
        console.log("shop info is", shopInfo)
        loadServices(shopInfo.services);
        setSpinner(false);
      }).catch((err)=>{setSpinner(false)});
    } else {
      setIsOwner(true);

      BarberShops.loadFromID(firebase.auth().currentUser.uid).then((shopInfo) => {
        setShopInformation(shopInfo);
        console.log("shop info is", shopInfo)
        loadServices(shopInfo.services);
        setSpinner(false);
      }).catch((err)=>{setSpinner(false)});
    }
  }, [services]);

  const onBackHandler = (changeMade)=>{
    if(changeMade) { // change was made in editServices
      setSpinner(true);
      console.log("CHANGE MADE")
      BarberShops.loadFromID(firebase.auth().currentUser.uid).then((shopInfo) => {
        console.log("REFRESHED RO, SHOP INFO IS", shopInfo)
        setShopInformation(shopInfo);
        loadServices(shopInfo.services);
        setSpinner(false);
      }).catch((err) =>{setSpinner(false)});
    }
    else{
      console.log("change NOT made")
    }
  }
  
  // useEffect(()=> {
  //   Services.loadServices(firebase.auth().currentUser.uid)
  //   .then(data => {
  //     setServiceInformation(data)
  //     console.log(serviceInformation)
  //   }
  //   )
  // },[])

  const toFirestore=(services)=>{
    var firestoreServices = []
    services.map((serviceList)=>{
      var firestoreObj = { serviceType: serviceList.serviceType, services: []}
      serviceList.services.map((serviceObj) =>{
        firestoreObj.services.push({price: serviceObj.price, serviceName: serviceObj.serviceName})
      })
      firestoreServices.push(firestoreObj)
    })
    console.log("returning firestoreServices from toFirestore: ", firestoreServices)
    return firestoreServices
  }
  
  const getInitials = (name) => {
    if(!name || name.length < 0){
      return ["", ""]
    }
    var initials = []
    initials.push(name[0])
    var tempName = name
    console.log("getInitials name is", tempName)
    var name_pieces = tempName.split(" ")
    console.log("name pieces are", name_pieces);
    return [name_pieces[0][0], name_pieces[1][0]]
  }

  const saveUpdatedBarberInfo = (result, clickedBarber)=>{
    var shopInfo = Object.assign(new BarberShop(), {...shopInformation});
    var newBarbers = shopInfo.barberIDs
      .sort((a, b) => (a.firstName > b.firstName) ? 1 : -1)
    newBarbers[clickedBarber].barberLocation = result.barberLocation
    newBarbers[clickedBarber].barberName = result.barberName
    // var fullNameTuple = getInitials(result.barberName) use this to update avatar
    var splitName = result.barberName.split(" ")
    newBarbers[clickedBarber].firstName= splitName[0]
    newBarbers[clickedBarber].lastName= splitName[splitName.length-1]
    setSpinner(true)
    setShopInformation(shopInfo)
    console.log("shopInfo right before update is", shopInformation)
    shopInformation.update().then((result)=>{
      console.log("shop info UPDATED", shopInfo)
      setSpinner(false)
      setBarberModalVisible(!barberModalVisible)
    })
    

  }

  const loadServices = (servicesMap) => {
    var fromFirestore = []
    servicesMap.map((serviceList)=>{
      var customList = new ServiceList();
      customList.serviceType = serviceList.serviceType;
      var localServices = []
      serviceList.services.map((serv)=>{
        localServices.push(new Service(serv.serviceName, serv.price))
      })
      customList.services = localServices
      fromFirestore.push(customList);
      console.log("from Firestore obj in LOADSERVICES is", fromFirestore)
      console.log("IN LOAD SERVICES, the new services are", services)
    })
    setServices(fromFirestore);
    // var shopServices = [];
    // for (var serviceType in servicesMap) {
    //   var serviceList = new ServiceList(serviceType, []);
    //   servicesMap[serviceType].map((item) => {
    //     serviceList.services.push(new Service(item.serviceName, item.price));
    //   });
    //   shopServices.push(serviceList);
    // }
    // setServices(shopServices);
    // console.log("SERVICES ARE",services)
  };
  
  const [services, setServices] = React.useState([]);


  const renderAccordions = () => {
    const items = [];
    services.map((item) => {
      items.push(
        <Accordian serviceType={item.serviceType} services={item.services} />
      );
    });
    return items;
  };

 
  const renderBarberModal = (barberModalVisible) => {
    {
      // if (!barberField || Object.keys(barberField).length <= 0) {
      //   return <></>;
      // }
      // const categoryModal = Object.keys(barberField)[0];
      var modalTitle = "Edit Barber";
      var dropdownItems = [];
      console.log("renderBarberModalCalled", shopInformation)
      var clickedBarberObj = shopInformation && shopInformation.barberIDs ? shopInformation.barberIDs
      .sort((a, b) => (a.firstName > b.firstName) ? 1 : -1)[clickedBarber] : null
      // const categoryModal =
      //   Object.keys(barberField).length > 0 &&
      //   Object.keys(barberField)[0] === "barberType";
      return (
        <View
          style={styles.centeredView}
          //   renderToHardwareTextureAndroid
          //   shouldRasterizeIOS
        >
          <Modal
            animationType="fade"
            transparent={true}
            backdropOpacity={0.5}
            useNativeDriver={false}
            isVisible={barberModalVisible} 
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Spinner
                  // textContent={"Loading..."}
                  textStyle={styles.spinnerTextStyles}
                  visible={spinner}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 23,
                    top: 23,
                    zIndex: 0,
                    color: "#00000080",
                  }}
                  hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                  onPress={() => {
                    setBarberModalVisible(!barberModalVisible)
                    // setSpinner(false)
                  }}
                >
                  <Icon
                    name="close"
                    family="AntDesign"
                    size={25}
                    style={{
                      color: "#00000080",
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.modalText}>{modalTitle}</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.child}
                >
                  <View style={{ marginTop: 30 }}>
                    {
                      clickedBarberObj ? 
                      <CustomForm
                      action={(result) => {
                        console.log("result",result)
                        console.log("pressed barberModal submit")
                        saveUpdatedBarberInfo(result, clickedBarber)
                      }}
                      afterSubmit={() => console.log("afterSubmit!")}
                      buttonText="Save Changes"
                      closeModalText={
                        "Delete Barber"
                      }
                      dropdownItems={dropdownItems}
                      fields={{
                        barberName: {
                          label: "Barber Name*",
                          validators: [validateContent],
                          defaultValue: clickedBarberObj.barberName
                        },
                        barberLocation: {
                          label: "Location",
                          validators: [],
                          defaultValue: clickedBarberObj.barberLocation
                        },
                      }}
                      deleteButton={
                        console.log("wants to delete!")
                      }
                    ></CustomForm>
                      :
                      <></>
                    }
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  };

  const renderModal = () => {
    {
      // console.log(serviceField);
      return (
        <View
          style={styles.centeredView}
          // renderToHardwareTextureAndroid
          // shouldRasterizeIOS
        >
          <Spinner
            visible={spinner}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyles}
          />
          <Modal
            animationType="fade"
            transparent={true}
            backdropOpacity={0.5}
            useNativeDriver={false}
            isVisible={modalVisible} //this.state.modalVisible
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 23,
                    top: 23,
                    color: "#00000080",
                  }}
                  hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                  onPress={() => {
                    setModalVisible(!modalVisible)
                  }}
                >
                  <Icon
                    name="close"
                    family="AntDesign"
                    size={25}
                    style={{
                      color: "#00000080",
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.modalText}>Edit About</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.child}
                >
                  <View style={{ marginTop: 30 }}>
                    <CustomForm
                      action={(description) => {
                          setSpinner(true);
                          shopInformation.updateAboutDescription(description['About'])
                            .then((updated) => {
                              setModalVisible(!modalVisible)
                              setSpinner();
                            }).catch((err) => {
                              setSpinner(false);
                              console.log("An error occurred with updating about",err);
                            });
                      }}
                      afterSubmit={() => console.log("afterSubmit!")}
                      buttonText="Save Changes"
                      fields={{
                          About: {
                            label: 'About',
                            defaultValue: shopInformation.aboutDescription,
                            validators: [validateContent],
                            inputProps: {
                              multiline: true,
                              width: width*.8,
                            },
                          },
                      }}
                    ></CustomForm>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  };
  const categories = [
    {
      barberLocation: "Fairfax",
      barberName: "Vinny",
      firstName: "Vinny",
      lastName: "",
    },
    {
      barberLocation: "Fairfax",
      barberName: "Bob",
      firstName: "Bob",
      lastName: "Smith",
    },
    {
      barberLocation: "Fairfax",
      barberName: "Trieu",
      firstName: "Trieu",
      lastName: "Roberts",
    },
    {
      barberLocation: "Fairfax",
      barberName: "Cathy",
      firstName: "Cathy",
      lastName: "Lao",
    },
    {
      barberLocation: "Vienna",
      barberName: "Tim",
      firstName: "Tim",
      lastName: "",
    },

  ]
  // const categories = [
  //   //barbers
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fit=crop&w=840&q=80",
  //     price: "Trieu",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
  //     price: "Vinny",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
  //     price: "Cathy",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
  //     price: "John",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
  //     price: "Tim",
  //   },
  // ];

  return (
    <Block
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Block flex center>
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{
            paddingBottom: 10,
          }}
        >
          <View >
            {renderModal()}
          </View>
          <View >
            {renderBarberModal(barberModalVisible)}
          </View>
          <Block flex={1}>
            <ImageBackground
              source={Images.BarberBackground}
              style={styles.profileContainer}
              imageStyle={styles.profileBackground}
            >
              <Block flex>
                <View style={styles.overlay} />
                <Block
                  style={{
                    position: "absolute",
                    width: width,
                    zIndex: 5,
                    paddingHorizontal: 20,
                  }}
                >
                  <Block style={{ top: height * 0.05 }}>
                    <Block middle>
                      <Text
                        style={{
                          fontFamily: "montserrat-bold",
                          marginBottom: nowTheme.SIZES.BASE / 2,
                          fontWeight: "900",
                          fontSize: 26,
                        }}
                        color="#ffffff"
                      >
                       {shopInformation.shopName}
                      </Text>

                      <Text
                        size={16}
                        color="white"
                        style={{
                          marginTop: 2,
                          fontFamily: "montserrat-bold",
                          lineHeight: 20,
                          fontWeight: "bold",
                          fontSize: 18,
                          opacity: 0.9,
                        }}
                      >
                        {shopInformation.address}
                      </Text>
                    </Block>
                  </Block>
                </Block>

                <Block
                  middle
                  row
                  style={{
                    position: "absolute",
                    width: width,
                    top: height * 0.18 - 26,
                    zIndex: 99,
                  }}
                >
                  <Button
                    style={{
                      width: 114,
                      height: 44,
                      marginHorizontal: 5,
                      elevation: 0,
                    }}
                    textStyle={{ fontSize: 16, fontWeight: "bold" }}
                    round
                  >
                    Book
                  </Button>
                </Block>
              </Block>
            </ImageBackground>
          </Block>
          {/* <ScrollView showsVerticalScrollIndicator={true}> */}
          <Block
            flex
            style={[styles.profileCard, { marginTop: theme.SIZES.BASE * 2.5 }]}
          >
            <Block style={{ paddingBottom: 12 }}>
              {/* <Text
                  style={{
                    color: "#2c2c2c",
                    fontWeight: "bold",
                    fontSize: 19,
                    fontFamily: "montserrat-bold",
                    marginTop: 15,
                    marginBottom: 20,
                    zIndex: 2,
                  }}
                >
                  Description
                </Text> */}
              <Block row space="between">
                <Text bold size={18} style={styles.title}>
                  About
                </Text>
                <TouchableOpacity
                  small
                  color="transparent"
                  onPress={() => {
                    setModalVisible(true);
                  }}
                  style={{
                    shadow: 0,
                    paddingRight: 10,
                    marginTop: 22,
                  }}
                >
                  { isOwner &&
                  <Icon
                    name="edit"
                    family="FontAwesome5"
                    size={25}
                    color={nowTheme.COLORS.DEFAULT}
                  />
                  }
                </TouchableOpacity>
              </Block>
              <Text
                size={16}
                muted
                style={{
                  textAlign: "left",
                  fontFamily: "montserrat-regular",
                  zIndex: 2,
                  lineHeight: 25,
                  color: "#9A9A9A",
                  paddingHorizontal: 15,
                }}
              >
                {shopInformation.aboutDescription}
              </Text>
            </Block>
          </Block>
          <Block flex={3} style={styles.profileCard}>
            <Block row space="between">
              <Text bold size={18} style={styles.title}>
                Barbers
              </Text>
              {/* <TouchableOpacity
                small
                color="transparent"
                style={{
                  shadow: 0,
                  paddingRight: 10,
                  marginTop: 22,
                }}
              >
                { isOwner &&
                <Icon
                  name="edit"
                  family="FontAwesome5"
                  size={25}
                  onPress={() => {}}
                  color={nowTheme.COLORS.DEFAULT}
                />
                }
              </TouchableOpacity> */}
            </Block>
            {/* <Text bold size={18} style={styles.title}>
              Barbers
            </Text> */}
            <Block flex>
              <Block style={{ marginTop: nowTheme.SIZES.BASE / 2 }}>
                <ScrollView
                  horizontal={true}
                  nestedScrollEnabled={true}
                  // pagingEnabled={true}
                  scrollEventThrottle={16}
                  // snapToAlignment="center"
                  showsHorizontalScrollIndicator={true}
                  // snapToInterval={cardWidth + nowTheme.SIZES.BASE * 0.375}
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                  }}
                >
                  {shopInformation.barberIDs &&
                    shopInformation.barberIDs
                    .sort((a, b) => (a.firstName > b.firstName) ? 1 : -1)
                    .map((item, index) => (
                      <TouchableOpacity
                        style={{ zIndex: 3 }}
                        disabled={!isOwner}
                        // key={`product-${item.firstName}-${index}`}
                        key={`product-${index}`}
                        onPress={() => {
                          // console.log("this.state.barberShop is", shopInformation)
                          setClickedBarber(index)
                          setBarberModalVisible(true);
                        }}
                      >
                        <Block center style={styles.productItem}>
                        <Avatar
                          size={70}
                          // source={{
                          //   uri:
                          //     'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fit=crop&w=840&q=80',
                          // }}
                          rounded
                          title= {(item.firstName ? item.firstName[0]: "") + (item.lastName ? item.lastName[0]: "")}
                          overlayContainerStyle={{backgroundColor: argonTheme.COLORS.BARBERBLUE }}
                          activeOpacity={0.4}
                          showAccessory
                        >{
                          isOwner &&
                          <Avatar.Accessory size={20}/>
                        }
                        </Avatar>
                          
                          {/* <Image
                            resizeMode="cover"
                            style={styles.productImage}
                            source={{ uri: item.image }}
                          /> */}
                          <Block
                            center
                            // style={{ paddingHorizontal: theme.SIZES.BASE }}
                          >
                            <Text
                              center
                              size={16}
                              color={theme.COLORS.MUTED}
                              style={styles.productPrice}
                            >
                              {item.firstName}
                            </Text>
                            {/* <Text center size={34}>
                              {item.title}
                            </Text>
                            <Text
                              center
                              size={16}
                              color={theme.COLORS.MUTED}
                              style={styles.productDescription}
                            >
                              {item.description}
                            </Text> */}
                          </Block>
                        </Block>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </Block>
            </Block>
          </Block>
          {/* </ScrollView>
      </Block> */}
          <Block flex={1}>
            {/* <ScrollView showsVerticalScrollIndicator={true}> */}
            <Block flex style={styles.profileCard}>
              <Block row space="between">
                <Text bold size={18} style={styles.title}>
                  Portfolio (Coming soon) 
                </Text>
                <Button
                  small
                  color="transparent"
                  textStyle={{ color: nowTheme.COLORS.PRIMARY, fontSize: 14 }}
                >
                  View all
                </Button>
              </Block>

              <Block
                style={{
                  paddingBottom: -HeaderHeight * 2,
                  paddingHorizontal: 15,
                }}
              >
                <Block row space="between" style={{ flexWrap: "wrap" }}>
                  {Images.Viewed2.map((img, imgIndex) => (
                    <Image
                      source={img}
                      key={`viewed-${img}`}
                      resizeMode="cover"
                      style={styles.thumb}
                    />
                  ))}
                </Block>
              </Block>
            </Block>
            {/* </ScrollView> */}
          </Block>
          <Block flex={1}>
            {/* <ScrollView showsVerticalScrollIndicator={true}> */}
            <Block flex style={styles.profileCard}>
              <Block row space="between">
                <Text bold size={18} style={styles.title}>
                  Services
                </Text>
                <TouchableOpacity
                  small
                  color="transparent"
                  onPress={() => {
                    navigation.navigate('EditServices', {services: services, barberShop: shopInformation, onBackHandler: onBackHandler.bind(this) }); // move onBackHandler to options not params
                    // setModalVisible(true);
                  }}
                  style={{
                    shadow: 0,
                    paddingRight: 10,
                    marginTop: 22,
                  }}
                >
                  { isOwner &&
                  <Icon
                    name="edit"
                    family="FontAwesome5"
                    size={25}
                    color={nowTheme.COLORS.DEFAULT}
                  />
                  }
                </TouchableOpacity>
              </Block>

              <Block
                style={{
                  paddingBottom: -HeaderHeight * 2,
                }}
              >
                {/* <ExpandableListView
                  data={CONTENT} // required
                /> */}
                <View style={styles.accordion}>{renderAccordions()}</View>
              </Block>
            </Block>
            {/* </ScrollView> */}
          </Block>
        </ScrollView>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: "transparent",
    // marginVertical: nowTheme.SIZES.BASE / 2,
    marginVertical: 1,
    padding: nowTheme.SIZES.BASE + 10,
    backgroundColor: nowTheme.COLORS.WHITE,
    shadowOpacity: 0.4,
    backgroundColor: nowTheme.COLORS.HEADER,
  },
  profileContainer: {
    width,
    padding: 0,
    zIndex: 1,
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
  overlay: {
    backgroundColor: "black",
    width,
    height: height * 0.18,
    opacity: 0.45,
  },
  profileBackground: {
    width,
    height: height * 0.18,
    opacity: 0.4,
  },
  info: {
    marginTop: 30,
    paddingHorizontal: 10,
    height: height * 0.8,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  editIcon: {
    backgroundColor: '#ccc',
    position: 'absolute',
    right: 0,
    bottom: 0
   },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 50,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  social: {
    width: nowTheme.SIZES.BASE * 3,
    height: nowTheme.SIZES.BASE * 3,
    borderRadius: nowTheme.SIZES.BASE * 1.5,
    justifyContent: "center",
    zIndex: 99,
    marginHorizontal: 5,
  },
  title: {
    paddingBottom: nowTheme.SIZES.BASE,
    paddingHorizontal: 15,
    marginTop: 22,
    color: nowTheme.COLORS.HEADER,
  },
  group: {
    paddingTop: nowTheme.SIZES.BASE,
  },
  imageBlock: {
    overflow: "hidden",
    borderRadius: 4,
  },
  productItem: {
    width: cardWidth / 4,
    marginHorizontal: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 10,
    shadowOpacity: 0.2,
  },
  productImage: {
    width: cardWidth / 4,
    height: cardWidth / 4,
    borderRadius: 100,
  },
  productPrice: {
    paddingTop: nowTheme.SIZES.BASE,
    paddingBottom: nowTheme.SIZES.BASE / 2,
  },
  productDescription: {
    paddingTop: nowTheme.SIZES.BASE,
    // paddingBottom: nowTheme.SIZES.BASE * 2,
  },
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: nowTheme.COLORS.PRIMARY,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
  },
  spinnerTextStyles: {
    color: "#FFF",
  },
  parentHr: {
    height: 1,
    color: argonTheme.COLORS.WHITE,
    width: "100%",
  },
  child: {
    width: "100%",
  },
  subtitleView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingText: {
    color: nowTheme.COLORS.BLACK,
    fontWeight: "bold",
    fontSize: 18,
  },
  serviceFont: {
    fontWeight: "bold",
    fontSize: 18,
    color: nowTheme.COLORS.HEADER,
  },
});

export default BarbershopPage;

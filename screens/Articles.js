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
import { Accordian, renderSeparator } from "../components/";
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
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - nowTheme.SIZES.BASE * 2;

const Articles = ({navigation}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [spinner, setSpinner] = React.useState(true);
  const [shopInformation, setShopInformation] = useState({});
  useEffect(() => {
    console.log("making api call");
    setSpinner(true);

    BarberShops.loadFromID(firebase.auth().currentUser.uid).then((shopInfo) => {
      setShopInformation(shopInfo);
      console.log("shop info is", shopInfo)
      loadServices(shopInfo.services);
      setSpinner(false);
    }).catch((err)=>{setSpinner(false)});
  }, [services]);

  const onBackHandler = (changeMade)=>{
    if(changeMade) { // change was made in editServices
      setSpinner(true);
      BarberShops.loadFromID(firebase.auth().currentUser.uid).then((shopInfo) => {
        setShopInformation(shopInfo);
        loadServices(shopInfo.services);
        setSpinner(false);
      }).catch((err) =>{setSpinner(false)});
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
  const loadServices = (servicesMap) => {
    console.log("LOADING SERVICES in ARTICLES", servicesMap);
    var shopServices = [];
    for (var serviceType in servicesMap) {
      var serviceList = new ServiceList(serviceType, []);
      servicesMap[serviceType].map((item) => {
        serviceList.services.push(new Service(item.serviceName, item.price));
      });
      shopServices.push(serviceList);
    }
    setServices(shopServices);
    console.log("SERVICES ARE",services)
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

  const closeModal = () => {
    this.setState((prevState) => {
        return {
          ...prevState,
          modalVisible: !prevState.modalVisible,
        };
    });
  }
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
                          shopInformation.updateAboutDescription(description)
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
    //barbers
    {
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fit=crop&w=840&q=80",
      price: "Trieu",
    },
    {
      image:
        "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
      price: "Vinny",
    },
    {
      image:
        "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
      price: "Cathy",
    },
    {
      image:
        "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
      price: "John",
    },
    {
      image:
        "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
      price: "Tim",
    },
  ];

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
                  <Icon
                    name="edit"
                    family="FontAwesome5"
                    size={25}
                    color={nowTheme.COLORS.DEFAULT}
                  />
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
              <TouchableOpacity
                small
                color="transparent"
                style={{
                  shadow: 0,
                  paddingRight: 10,
                  marginTop: 22,
                }}
              >
                <Icon
                  name="edit"
                  family="FontAwesome5"
                  size={25}
                  onPress={() => {}}
                  color={nowTheme.COLORS.DEFAULT}
                />
              </TouchableOpacity>
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
                  {categories &&
                    categories.map((item, index) => (
                      <TouchableWithoutFeedback
                        style={{ zIndex: 3 }}
                        key={`product-${item.title}`}
                        onPress={() => alert("clicked Barber")}
                      >
                        <Block center style={styles.productItem}>
                          <Image
                            resizeMode="cover"
                            style={styles.productImage}
                            source={{ uri: item.image }}
                          />
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
                              {item.price}
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
                      </TouchableWithoutFeedback>
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
                  Portfolio
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
                  <Icon
                    name="edit"
                    family="FontAwesome5"
                    size={25}
                    color={nowTheme.COLORS.DEFAULT}
                  />
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

export default Articles;

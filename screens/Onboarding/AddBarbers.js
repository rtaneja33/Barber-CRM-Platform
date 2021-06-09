import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { firebase } from "../../src/firebase/config";
import { Avatar } from 'react-native-elements';
import { Block, Text, theme } from "galio-framework";
import { Images, argonTheme, tabs, barber } from "../../constants";
import Spinner from "react-native-loading-spinner-overlay";
import BarberShop from "../../models/BarberShop";
import { BackButton, Background } from '../../components'
import { Button } from "../../components/";
const { width, height } = Dimensions.get("screen");
import Icon from "../../components/Icon";
import Modal from "react-native-modal";
import { Accordian, renderSeparator } from "../../components/";
import { HeaderHeight } from "../../constants/utils";
import CustomForm from "../../components/CustomForm";
import { validateContent } from "../../constants/utils";

const BASE_SIZE = theme.SIZES.BASE;
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
// import firebase from "react-native-firebase";




class AddBarbers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      barbers: [],
      email: "",
      password: "",
      barberField: null,
      modalVisible: false,
      barberModified: null,
      barberShop: this.props.route.params.barberShop, // this should be passed in as a prop;
      changeMade: false,
    };
  }
  // componentDidUpdate(){
  //   console.log(this.state.barbers);
  // }
  renderAccordions = (barbers) => {
    console.log("accordian", barbers);
    const items = [];
    barbers.map((item) => {
      //need validation for this
      item.firstName = item.barberName.split(" ")[0];
      item.lastName = item.barberName.split(" ")[1];
      items.push(
        // make this into a component
        <View style={{minHeight:70, padding:5, }}>
     
        <TouchableOpacity onPress={() => {}}>
        <Block row center card shadow space="between" style={styles.card} key={item.firstName}>
          <Block style={styles.left}>
            <Avatar
              size="medium"
              rounded
              title= {(item.firstName ? item.firstName[0]: "") + (item.lastName ? item.lastName[0]: "")}
              overlayContainerStyle={{backgroundColor: argonTheme.COLORS.BARBERBLUE }}
              activeOpacity={0.4}
            />
          </Block>
          <Block flex>
            <Text style={{ color: "#2f363c",fontSize: 20, fontWeight: '600' }} size={BASE_SIZE * 1.125}>{item.firstName} {item.lastName}</Text>
            <Text style={{ color: "#808080", paddingTop: 2 }} size={BASE_SIZE * 0.875} muted>{(item.barberLocation && item.barberLocation.length > 0) ? item.barberLocation: "no location"}</Text>
          </Block>
          <View style={styles.right}>
            <Icon
                name="nav-right"
                family="ArgonExtra"
                size={BASE_SIZE}
                color={COLOR_GREY}
            />
          </View>
        </Block>
        </TouchableOpacity>
      </View>
      );
    });
    return items;
  };
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  setbarberField = (field) => {
    this.setState({ barberField: field });
  };

  setbarberModified = (oldKey) => {
    this.setState({ barberModified: oldKey });
  };

  closeModal = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        modalVisible: false,
      };
    });
  };

  deletebarberItem = () => {
    this.setState({ loading: true, changeMade: true });
    let barberLocation = { ...this.state.barberModified };
    var tempArr = this.state.barbers;
    tempArr.map((obj) => {
      if (obj.barberType === barberLocation.barberCategory) {
        obj.barbers.splice(barberLocation.barberIndex, 1);
      }
    });
    const timer = setTimeout(() => {
      this.setState({ loading: false });
      this.closeModal();
      showMessage({
        message: "barber Item has been deleted!",
        type: "danger",
        icon: "success",
      });
    }, 300);
  };

  submitbarberItem = (location, nameOfbarber) => {
    let newbarberObj = {
      barberLocation: location,
      barberName: nameOfbarber,
    };
    this.setState({ loading: true, changeMade: true });

    var tempArr = this.state.barbers.concat(newbarberObj);

    this.setState({barbers: tempArr});
    

    //this doesn't work
    const timer = setTimeout(() => {
      this.setState({ loading: false });
      this.closeModal();
      console.log("timer");
      showMessage({
        message: "barber has been updated!",
        type: "success",
        icon: "success",
      });
    }, 300);
  };

  toFirestore(services){
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

  continueToNext = (isSkipped) => {
    const {navigation} = this.props;
    console.log("before navigation to CreateAccount, we are passing barberShop: ", this.state.barberShop)
    var shop = {...this.state.barberShop};
    if(!shop.services){
      shop.services = []
    }
    if(!isSkipped)
      shop.barberIDs = this.state.barbers
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      navigation.navigate('CreateAccount', {barberShop: shop, isBarber: true});
    }, 200);
  }

  renderModal = (barberField = null) => {
    {
      if (!barberField || Object.keys(barberField).length <= 0) {
        return <></>;
      }
      const categoryModal = Object.keys(barberField)[0];
      var modalTitle = "";
      var dropdownItems = [];
      switch (categoryModal) {
        case "barberType":
          modalTitle = "Edit Category";
          break;
        case "barberName":
          modalTitle = "Edit Barber";
          break;
        case "addbarberName":
          //breaks here ! Emerson
          modalTitle = "Add Barber";
          break;
        default:
          this.submitbarberItem(result, nameOfbarber); //maybe to error handling here
          break;
      }
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
            isVisible={this.state.modalVisible} //this.state.modalVisible
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Spinner
                  // textContent={"Loading..."}
                  textStyle={styles.spinnerTextStyles}
                  visible={this.state.loading}
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
                    this.setState((prevState) => {
                      return {
                        ...prevState,
                        modalVisible: !prevState.modalVisible,
                      };
                    });
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
                    <CustomForm
                      action={(result, barberCategory) => {
                        console.log("result",result)
                        console.log("categoryModal",categoryModal)
                        switch (categoryModal) {
                          case "barberType":
                            this.submitbarberCategory(result["barberType"]);
                            break;
                          case "barberName":
                            this.submitbarberItem(
                              result["price"],
                              result["barberName"]
                            );
                            break;
                          case "addbarberName":
                            this.submitbarberItem(
                              result["addbarberLocation"],
                              result["addbarberName"]
                            ); //maybe to error handling here
                          default:
                            this.submitbarberItem(
                              result["addbarberLocation"],
                              result["addbarberName"]
                            ); //maybe to error handling here
                            break;
                        }
                      }}
                      afterSubmit={() => console.log("afterSubmit!")}
                      buttonText="Save Changes"
                      closeModalText={
                        categoryModal === "barberType"
                          ? "Delete Category"
                          : "Delete barber"
                      }
                      dropdownItems={dropdownItems}
                      fields={barberField}
                      deleteButton={
                        categoryModal === "barberType"
                          ? (result) => {
                              this.deletebarberCategory();
                            }
                          : categoryModal === "barberName"
                          ? (result) => {
                              this.deletebarberItem();
                            }
                          : undefined
                      }
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

  render() {
    return (
      <Background>
      <BackButton goBack={()=>{console.log("back button hit"); this.props.navigation.goBack();}} />
      <Block flex style={styles.centeredView}>
        <Spinner
          // textContent={"Loading..."}
          textStyle={styles.spinnerTextStyles}
          visible={this.state.loading}
        />
        <Block flex style={styles.addBarbers}>
          <Text bold size={28} style={styles.title}>
            Add Barbers
          </Text>
          <Block row style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Block>
            <Button
                color="primary"
                style={styles.button}
                onPress={() => {
                  this.setModalVisible(true);
                  // this.setbarberModified("Something");
                  this.setbarberField({
                    addbarberName: {
                      label: "barber Name*",
                      validators: [validateContent],
                    },
                    addbarberLocation: {
                      label: "Location",
                      validators: [],
                    },
                  });
                }}
              >
                <Block column center>
                  <Icon
                    name="grid"
                    family="entypo"
                    size={30}
                    color={"white"}
                    style={{ marginTop: 2, marginRight: 5 }}
                  />
                  <Text
                    style={{
                      marginTop: 5,
                      color: "white",
                      fontWeight: "800",
                      fontSize: 14,
                      textAlign: 'center'
                    }}
                  >Add Barber</Text>
                </Block>
              </Button>
            </Block>
            {/* <Block>
              <Button
                color="secondary"
                disabled={this.state.barbers.length < 1}
                style={
                  this.state.barbers.length < 1
                    ? styles.disabled
                    : styles.button
                }
                onPress={() => {
                  this.setModalVisible(true);
                  // this.setServiceModified("Something");
                  this.setServiceField({
                    addServiceName: {
                      label: "Service Name*",
                      validators: [validateContent],
                    },
                    addServicePrice: {
                      label: "Price",
                      validators: [],
                    },
                  });
                }}
              >
                <Block column center style={this.state.barbers.length < 1 ? {opacity:0.5} : {opacity: 1.0}}>
                  <Icon
                    name="edit"
                    family="FontAwesome5"
                    size={30}
                    color={this.state.barbers.length < 1 ? 'white' : argonTheme.COLORS.HEADER}
                    style={{ marginTop: 2, marginRight: 5 }}
                  />
                  <Text
                    style={{
                      marginTop: 5,
                      color: this.state.barbers.length < 1 ? 'white' : argonTheme.COLORS.HEADER,
                      fontWeight: "800",
                      fontSize: 14,
                    }}
                  >Add Service</Text>
                </Block>
              </Button>
            </Block> */}
          </Block>
          <ScrollView
            ref={(ref) => (this.scrollView = ref)}
            onContentSizeChange={() => {
              this.scrollView.scrollToEnd(true);
            }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
          >
            <Block>
              <Block
                style={{
                  paddingBottom: -HeaderHeight * 2,
                }}
              >
                <View style={styles.accordionCard}>
                  {this.renderAccordions(this.state.barbers)}
                </View>
              </Block>
            </Block>
            <View style={styles.modal}>
              {this.renderModal(this.state.barberField)}
            </View>
          </ScrollView>
        </Block>
        <View style={styles.bottom}>
          <Block flex row>
            <TouchableOpacity
              style={{
                position: "absolute",
                left: 25,
                top: 25,
                zIndex: 0,
                color: "#00000080",
              }}
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
              onPress={() => {
                this.continueToNext(true);
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>SKIP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 25,
                top: 25,
                zIndex: 0,
                color: "#00000080",
              }}
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
              onPress={() => {
                console.log("addbarbers- this.props is", this.props);
                // this.onRegister(false);
                this.continueToNext(false);
                console.log("pressed CONTINUE!");
              //   this.setState({ loading: true });
              //   setTimeout(() => {
              //    this.setState({ loading: false });
              //    const {navigation} = this.props;
              //    var shop = {...this.state.barberShop};
              //    shop.services = this.state.services; 
              //    this.setState({barberShop: shop})
              //    console.log("and this.state.barbershop.services looks like", this.state.barberShop.services)
              //    navigation.navigate('AddBarbers', {barberShop: this.state.barberShop, email: this.state.email, password: this.state.password });
              //  }, 300);
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                CONTINUE
              </Text>
            </TouchableOpacity>
          </Block>
        </View>
        <FlashMessage
          statusBarHeight={1}
          position="top"
          style={{ elevation: 10 }}
        />
      </Block>
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  child: {
    width: "100%",
  },
  addBarbers: {
    marginTop: height*0.05,
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    height: 65,
    width: width*0.88,
  },
  disabled: {
    marginBottom: theme.SIZES.BASE,
    backgroundColor: "#ccc",
    color: "red",
    height: 65,
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  accordionCard: {
    justifyContent: "flex-start",
    marginHorizontal: 8,
    padding: theme.SIZES.BASE,
    width: width,
    marginTop: 0,
    borderRadius: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
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
    // elevation: 1,
  },
  title: {
    paddingBottom: argonTheme.SIZES.BASE,
    paddingHorizontal: 15,
    marginTop: 22,
    color: argonTheme.COLORS.HEADER,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    // padding: theme.SIZES.BASE
  },
  // centeredView: {
  //   // position: "relative",
  //   padding: theme.SIZES.BASE,
  // },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingTop: 40,
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
  bottom: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    justifyContent: "flex-end",
    width: width,
    height: height / 9,
    backgroundColor: argonTheme.COLORS.HEADER,
  },
  rounded: {
    borderRadius: theme.SIZES.BASE * 0.1875,
  },
  gradient: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    position: 'absolute',
    overflow: 'hidden',
    borderBottomRightRadius: theme.SIZES.BASE * 0.5,
    borderBottomLeftRadius: theme.SIZES.BASE * 0.5,
  },
  card: {
    borderColor: 'transparent',
    // marginVertical: BASE_SIZE / 2,
    marginVertical: 1,
    padding: BASE_SIZE+10,
    backgroundColor: COLOR_WHITE,
    shadowOpacity: .9,
  },
  left: {
    marginRight: BASE_SIZE,
  },
  right: {
    width: BASE_SIZE * 2,
    backgroundColor: 'transparent',
    elevation: 10, justifyContent:'center', alignItems: 'center',
  },

});

export default AddBarbers;
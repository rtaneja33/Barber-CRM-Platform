import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import Icon from "../components/Icon";
import { validateContent } from "../constants/utils";
import Modal from "react-native-modal";
import { Accordian, renderSeparator } from "../components/";
import { Block, Text, theme, Button as GaButton } from "galio-framework";
import { HeaderHeight } from "../constants/utils";
import CustomForm from "../components/CustomForm";
const { width, height } = Dimensions.get("screen");
import { firebase } from "../src/firebase/config";
import BarberShop from "../models/BarberShop";
import Spinner from "react-native-loading-spinner-overlay";
import FlashMessage, {showMessage, hideMessage} from "react-native-flash-message";

import {
  Images,
  argonTheme as nowTheme,
  Service,
  ServiceList,
  articles,
  argonTheme,
} from "../constants";
import { ScrollView } from "react-native-gesture-handler";

class EditServices extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props.route.params.barberShop);
    this.state = {
      serviceField: null,
      modalVisible: false,
      serviceModified: null,
      loading: false,
      barberShop: this.props.route.params.barberShop,
      services: this.props.route.params.services,
      changeMade: false,
    };
  }

  componentWillUnmount(){
    if(this.props.route.params.onBackHandler){
        this.props.route.params.onBackHandler(this.state.changeMade)
    }
  }

  renderAccordions = (services) => {
    const items = [];
    services.map((item) => {
      items.push(
        <Accordian
          serviceType={item.serviceType}
          services={item.services}
          editable
          setServiceModified={this.setServiceModified}
          setServiceField={this.setServiceField}
          setModalVisible={this.setModalVisible}
        />
      );
    });
    return items;
  };
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  setServiceField = (field) => {
    this.setState({ serviceField: field });
  };

  setServiceModified = (oldKey) => {
    console.log("SET SERVICE MODIFIED, PASSED IN ", oldKey);
    this.setState({ serviceModified: oldKey });
  };

  closeModal = () => {
    this.setState((prevState) => {
        return {
          ...prevState,
          modalVisible: !prevState.modalVisible,
        };
    });
  }

  deleteServiceItem = () => {
    this.setState({ loading: true, changeMade: true });
    let serviceLocation = {...this.state.serviceModified};
    console.log("serviceLocation is",serviceLocation )
    this.state.barberShop
      .deleteServiceItem(serviceLocation.serviceCategory, serviceLocation.serviceIndex)
      .then((updated) => {
        if (updated) {
            var tempArr = this.state.services;
            tempArr.map((obj) => {
                if(obj.serviceType === serviceLocation.serviceCategory) {
                    obj.services.splice(serviceLocation.serviceIndex, 1)
                }
            })
        } else {
          throw new Error("COULD NOT DELETE CATEGORY");
        }
        const timer = setTimeout(() => {
            this.setState({loading: false})
            this.closeModal();
            showMessage({
                message: "Service Item has been deleted!",
                type: "danger",
                icon: "success"
            });
        }, 300);
      })
      .catch((err) => {
        this.setState({loading: false})
        console.log("An error occurred with deleting service item", err);
      });
  };

  submitServiceItem = (price, nameOfService) => {
    console.log("for service item, new price is", price, "and new service is", nameOfService);
    let serviceLocation = {...this.state.serviceModified};
    // let newServiceObj = new Service(nameOfService, price);
    let newServiceObj = {
        price: price,
        serviceName: nameOfService,
    }
    this.setState({ loading: true,changeMade: true });
    this.state.barberShop
      .updateServiceItem(serviceLocation.serviceCategory, serviceLocation.serviceIndex, newServiceObj)
      .then((updated) => {
        if (updated) {
          var tempArr = this.state.services;
          tempArr.map((obj) => {
              if(obj.serviceType === serviceLocation.serviceCategory) {
                  obj.services[serviceLocation.serviceIndex] = newServiceObj
              }
          })
        } else {
          throw new Error("COULD NOT UPDATE");
        }
        const timer = setTimeout(() => {
            this.setState({loading: false})
            this.closeModal();
            showMessage({
                message: "Service has been updated!",
                type: "success",
                icon: "success"
            });
        }, 300);
      })
      .catch((err) => {
        this.setState({loading: false})
        console.log("An error occurred with updating",err);
      });
  }

  deleteServiceCategory = () => {
    this.setState({ loading: true, changeMade: true });
    var oldCategory = this.state.serviceModified;
    this.state.barberShop
      .deleteServiceCategory(oldCategory)
      .then((updated) => {
        if (updated) {
            this.setState((prevState) => ({
                services: prevState.services.filter((obj)=>{
                    return obj.serviceType !== oldCategory
                })
            }));
        } else {
          throw new Error("COULD NOT DELETE CATEGORY");
        }
        const timer = setTimeout(() => {
            this.setState({loading: false})
            this.closeModal();
            showMessage({
                message: "Service Category has been deleted!",
                type: "danger",
                icon: "success"
            });
        }, 300);
      })
      .catch((err) => {
        this.setState({loading: false})
        console.log("edit services", err);
        console.log("An error occurred with deleting");
      });
  };

  submitServiceCategory = (result) => {
    this.setState({ loading: true, changeMade: true });
    this.state.barberShop
      .updateServiceCategory(this.state.serviceModified, result)
      .then((updated) => {
        if (updated) {
          var oldCategory = this.state.serviceModified;
          this.setState((prevState) => ({
            services: prevState.services.map((obj) =>
              obj.serviceType === oldCategory
                ? Object.assign(obj, {
                    serviceType: result,
                  })
                : obj
            ),
            serviceModified: result,
          }));
        } else {
          throw new Error("COULD NOT UPDATE");
        }
        const timer = setTimeout(() => {
            this.setState({loading: false})
            this.closeModal();
            showMessage({
                message: "Service Category has been updated!",
                type: "success",
                icon: "success"
            });
        }, 300);
      })
      .catch((err) => {
        this.setState({loading: false})
        console.log("edit services", err);
        console.log("An error occurred with updating");
      });
  };

  renderModal = (serviceField = null) => {
    {
      console.log(serviceField);
      console.log("this.state.loading in rendermodal is", this.state.loading);
      console.log("IN RENDER MODAL, serviceField is", serviceField);
      if (!serviceField) return <></>; 
      console.log("IN RENDER MODAL, serviceField is", serviceField);
      const categoryModal =
        Object.keys(serviceField).length > 0 &&
        Object.keys(serviceField)[0] === "serviceType";
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
                <Text style={styles.modalText}>Edit Services</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.child}
                >
                  <View style={{ marginTop: 30 }}>
                    <CustomForm
                      action={(result, nameOfService) => {
                          console.log("service item in editservices", result, nameOfService)
                          categoryModal ?
                            this.submitServiceCategory(result) :
                            this.submitServiceItem(result, nameOfService);
                      }}
                      afterSubmit={() => console.log("afterSubmit!")}
                      buttonText="Save Changes"
                      closeModalText={
                        categoryModal ? "Delete Category" : "Delete Service"
                      }
                      fields={serviceField}
                      deleteButton={(result)=>{
                        console.log("result in delete is", result);
                        categoryModal ? 
                            this.deleteServiceCategory():
                            this.deleteServiceItem()
                      }
                      }
                      // fields={{
                      //   email: {
                      //     label: 'Email',
                      //     validators: [validateContent],
                      //     inputProps: {
                      //       keyboardType: 'email-address',
                      //     },
                      //   },
                      //   password: {
                      //     label: 'Password',
                      //     inputProps: {
                      //       secureTextEntry: true,
                      //     },
                      //   },
                      // }}
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
    const { navigation } = this.props;
    console.log("in render, loading is", this.state.loading)
    return (
      <ScrollView flex={1}>
        <View style={styles.modal}>
          {this.renderModal(this.state.serviceField)}
        </View>
        <Block flex style={styles.profileCard}>
          <Block row space="between">
            <Text bold size={18} style={styles.title}>
              Services
            </Text>
          </Block>
          <Block
            style={{
              paddingBottom: -HeaderHeight * 2,
            }}
          >
            <View style={styles.accordion}>
              {this.renderAccordions(this.state.services)}
            </View>
          </Block>
        </Block>
      <FlashMessage statusBarHeight={1} position="top" style={{elevation:10}} /> 
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    paddingBottom: nowTheme.SIZES.BASE,
    paddingHorizontal: 15,
    marginTop: 22,
    color: nowTheme.COLORS.HEADER,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
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
  child: {
    width: "100%",
  },
});

export default EditServices;

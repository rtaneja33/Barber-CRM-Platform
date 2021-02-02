import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  View,
  TouchableOpacity,
  ScrollView,
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
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import { Button } from "../components/";

import {
  Images,
  argonTheme as nowTheme,
  Service,
  ServiceList,
  articles,
  argonTheme,
} from "../constants";

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

  addServiceCategory = (result) => {
    this.setState({ loading: true, changeMade: true });
    var newServiceCategory = new ServiceList();
    newServiceCategory.serviceType = result;
    newServiceCategory.services = [];
    console.log("newservcat", newServiceCategory)
    const newCat = Object.assign({}, newServiceCategory)
    console.log("NEWCAT ISSS", newCat)
    this.state.barberShop
      .addServiceCategory(newCat)
      .then((updated) => {
        if (updated) {
          var updatedServices = this.state.services.concat(newServiceCategory);
          this.setState({ services: updatedServices });
          setTimeout(() => {
            this.setState({ loading: false });
            this.closeModal();
            showMessage({
              message: "Service Category has been added!",
              type: "success",
              icon: "success",
            });
          }, 300);
        } else {
          setTimeout(() => {
            this.setState({ loading: false });
            this.closeModal();
            showMessage({
              message: "An error occured. Please try again later.",
              type: "danger",
              icon: "danger",
            });
          }, 300);
          //throw new Error("COULD NOT UPDATE");
          console.log("error occured with adding service category");
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log("edit services", err);
        console.log("An error occurred with updating");
      });
  };

  addServiceName = (price, nameOfService, serviceCategory) => {
    if (
      !price ||
      !nameOfService ||
      !serviceCategory ||
      price.length < 1 ||
      nameOfService.length < 1 ||
      serviceCategory.length < 1
    ) {
      const timer = setTimeout(() => {
        this.setState({ loading: false });
        this.closeModal();
        showMessage({
          message: "An error occurred. Please try again.",
          type: "danger",
          icon: "danger",
        });
      }, 300);
      return;
    }

    let newServiceObj = {
      price: price,
      serviceName: nameOfService,
    };
    this.setState({ loading: true, changeMade: true });
    this.state.barberShop
      .addServiceItem(
        serviceCategory, 
        newServiceObj
      )
      .then((updated) => {
        if (updated) {
          let newServiceObj = new Service(nameOfService, price);
          this.setState({ loading: true, changeMade: true });
          var tempArr = this.state.services;
          tempArr.map((obj) => {
            if (obj.serviceType === serviceCategory) {
              console.log("pushing new service obj, obj.serviceType");
              obj.services.push(newServiceObj);
            }
          });
          const timer = setTimeout(() => {
            this.setState({ loading: false });
            this.closeModal();
            showMessage({
              message: "Service Name has been added!",
              type: "success",
              icon: "success",
            });
          }, 300);
        } else {
          const timer = setTimeout(() => {
            this.setState({ loading: false });
            this.closeModal();
            showMessage({
              message: "An error occurred. Please try again!",
              type: "danger",
              icon: "danger",
            });
          }, 300);
          throw new Error("COULD NOT ADD ITEM");
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log("An error occurred with adding", err);
      });
  };

  componentWillUnmount() {
    if (this.props.route.params.onBackHandler) {
      this.props.route.params.onBackHandler(this.state.changeMade);
    }
  }

  renderAccordions = (services) => {
    const items = [];
    console.log("in render accordions, services passed in is", services)
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
        modalVisible: false,
      };
    });
  };

  deleteServiceItem = () => {
    this.setState({ loading: true, changeMade: true });
    let serviceLocation = { ...this.state.serviceModified };
    console.log("serviceLocation is", serviceLocation);
    this.state.barberShop
      .deleteServiceItem(
        serviceLocation.serviceCategory,
        serviceLocation.serviceIndex
      )
      .then((updated) => {
        if (updated) {
          var tempArr = this.state.services;
          tempArr.map((obj) => {
            if (obj.serviceType === serviceLocation.serviceCategory) {
              obj.services.splice(serviceLocation.serviceIndex, 1);
            }
          });
        } else {
          throw new Error("COULD NOT DELETE CATEGORY");
        }
        const timer = setTimeout(() => {
          this.setState({ loading: false });
          this.closeModal();
          showMessage({
            message: "Service Item has been deleted!",
            type: "danger",
            icon: "success",
          });
        }, 300);
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log("An error occurred with deleting service item", err);
      });
  };

  updateServiceItem = (price, nameOfService) => {
    console.log(
      "for service item, new price is",
      price,
      "and new service is",
      nameOfService
    );
    let serviceLocation = { ...this.state.serviceModified };
    // let newServiceObj = new Service(nameOfService, price);
    let newServiceObj = {
      price: price,
      serviceName: nameOfService,
    };
    this.setState({ loading: true, changeMade: true });
    console.log("this.state.barberShop is", this.state.barberShop)
    this.state.barberShop
      .updateServiceItem(
        serviceLocation.serviceCategory,
        serviceLocation.serviceIndex,
        newServiceObj
      )
      .then((updated) => {
        if (updated) {
          var tempArr = this.state.services;
          tempArr.map((obj) => {
            if (obj.serviceType === serviceLocation.serviceCategory) {
              obj.services[serviceLocation.serviceIndex] = newServiceObj;
            }
          });
        } else {
          throw new Error("COULD NOT UPDATE");
        }
        const timer = setTimeout(() => {
          this.setState({ loading: false });
          this.closeModal();
          showMessage({
            message: "Service has been updated!",
            type: "success",
            icon: "success",
          });
        }, 300);
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log("An error occurred with updating", err);
      });
  };

  deleteServiceCategory = () => {
    this.setState({ loading: true, changeMade: true });
    var oldCategory = this.state.serviceModified;
    this.state.barberShop
      .deleteServiceCategory(oldCategory)
      .then((updated) => {
        if (updated) {
          this.setState((prevState) => ({
            services: prevState.services.filter((obj) => {
              return obj.serviceType !== oldCategory;
            }),
          }));
        } else {
          throw new Error("COULD NOT DELETE CATEGORY");
        }
        const timer = setTimeout(() => {
          this.setState({ loading: false });
          this.closeModal();
          showMessage({
            message: "Service Category has been deleted!",
            type: "danger",
            icon: "success",
          });
        }, 300);
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log("edit services", err);
        console.log("An error occurred with deleting");
      });
  };

  updateServiceCategory = (result) => {
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
          this.setState({ loading: false });
          this.closeModal();
          showMessage({
            message: "Service Category has been updated!",
            type: "success",
            icon: "success",
          });
        }, 300);
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log("edit services", err);
        console.log("An error occurred with updating");
      });
  };

  renderModal = (serviceField = null) => {
    {
      if (!serviceField || Object.keys(serviceField).length <= 0) {
        return <></>;
      }
      const categoryModal = Object.keys(serviceField)[0];
      var modalTitle = "";
      var dropdownItems = [];
      switch (categoryModal) {
        case "serviceType":
          modalTitle = "Edit Category";
          break;
        case "addServiceType":
          modalTitle = "Add Category";
          break;
        case "serviceName":
          modalTitle = "Edit Service";
          break;
        case "addServiceName":
          modalTitle = "Add Service";
          this.state.services.map((category) => {
            console.log(
              "ADD CATEGORY, serviceField keys are",
              category.serviceType
            );
            dropdownItems.push({
              label: category.serviceType,
              value: category.serviceType,
            });
          });
          break;
        default:
          modalTitle = "NO IDEA";
          //this.updateServiceItem(result, nameOfService); //maybe to error handling here
          break;
      }
      // const categoryModal =
      //   Object.keys(serviceField).length > 0 &&
      //   Object.keys(serviceField)[0] === "serviceType";
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
                      action={(result, serviceCategory) => {
                        switch (categoryModal) {
                          case "serviceType":
                            this.updateServiceCategory(result["serviceType"]);
                            break;
                          case "addServiceType":
                            this.addServiceCategory(result["addServiceType"]);
                            break;
                          case "serviceName":
                            console.log("this.state currently is", this.state)
                            console.log("result of action is", result)
                            this.updateServiceItem(
                              result["price"],
                              result["serviceName"]
                            );
                            break;
                          case "addServiceName":
                            this.addServiceName(
                              result["addServicePrice"],
                              result["addServiceName"],
                              serviceCategory
                            );
                          default:
                            this.updateServiceItem(
                              result["price"],
                              result["serviceName"]
                            ); //maybe to error handling here
                            break;
                        }
                      }}
                      afterSubmit={() => console.log("afterSubmit!")}
                      buttonText="Save Changes"
                      closeModalText={
                        categoryModal === "serviceType"
                          ? "Delete Category"
                          : "Delete Service"
                      }
                      dropdownItems={dropdownItems}
                      fields={serviceField}
                      deleteButton={
                        categoryModal === "serviceType"
                          ? (result) => {
                              this.deleteServiceCategory();
                            }
                          : categoryModal === "serviceName"
                          ? (result) => {
                              this.deleteServiceItem();
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
      <Block flex>
      <Block flex style={styles.centeredView}>
        <Spinner
          // textContent={"Loading..."}
          textStyle={styles.spinnerTextStyles}
          visible={this.state.loading}
        />
        <Block row style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Block>
            <Button
              color="default"
              style={styles.button}
              onPress={() => {
                this.setModalVisible(true);
                // this.setServiceModified("Something");
                this.setServiceField({
                  addServiceType: {
                    label: "Service Category*",
                    validators: [validateContent],
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
                    textAlign: "center",
                  }}
                >
                  Add Category
                </Text>
              </Block>
            </Button>
          </Block>
          <Block>
            <Button
              color="secondary"
              disabled={this.state.services.length < 1}
              style={
                this.state.services.length < 1 ? styles.disabled : styles.button
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
              <Block
                column
                center
                style={
                  this.state.services.length < 1
                    ? { opacity: 0.5 }
                    : { opacity: 1.0 }
                }
              >
                <Icon
                  name="edit"
                  family="FontAwesome5"
                  size={30}
                  color={
                    this.state.services.length < 1
                      ? "white"
                      : argonTheme.COLORS.HEADER
                  }
                  style={{ marginTop: 2, marginRight: 5 }}
                />
                <Text
                  style={{
                    marginTop: 5,
                    color:
                      this.state.services.length < 1
                        ? "white"
                        : argonTheme.COLORS.HEADER,
                    fontWeight: "800",
                    fontSize: 14,
                  }}
                >
                  Add Service
                </Text>
              </Block>
            </Button>
          </Block>
        </Block>
        <ScrollView
          ref={(ref) => (this.scrollView = ref)}
          onContentSizeChange={() => {
            this.scrollView.scrollToEnd(true);
          }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1, width: width }}
        >
          {/* <Block flex style={styles.profileCard}>
          <Block row space="between">
            <Text bold size={18} style={styles.title}>
              Services
            </Text>
          </Block> */}
          <Block flex style={styles.accordionCard}>
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
          {/* </Block> */}
          <View style={styles.modal}>
            {this.renderModal(this.state.serviceField)}
          </View>
        </ScrollView>
      </Block>
      <FlashMessage
            statusBarHeight={1}
            position="top"
            style={{ elevation: 10 }}
            hideOnPress

          />
      </Block>
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
  button: {
    marginBottom: theme.SIZES.BASE,
    height: 65,
  },
  disabled: {
    marginBottom: theme.SIZES.BASE,
    backgroundColor: "#ccc",
    color: "red",
    height: 65,
  },
  accordionCard: {
    justifyContent: "flex-start",
    marginHorizontal: 8,
    padding: theme.SIZES.BASE,
    marginTop: 0,
    borderRadius: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
});

export default EditServices;

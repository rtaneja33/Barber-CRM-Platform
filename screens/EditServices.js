import React, { useState } from 'react';
import {
    StyleSheet,
    Dimensions,
    ImageBackground,
    View,
    TouchableOpacity,
    TouchableHighlight,
  } from "react-native";
import Icon from "../components/Icon";
import { validateContent } from '../constants/utils';
import Modal from "react-native-modal";
import { Accordian, renderSeparator } from "../components/";
import { Block, Text, theme, Button as GaButton } from "galio-framework";
import { HeaderHeight } from "../constants/utils";
import CustomForm from "../components/CustomForm";
const { width, height } = Dimensions.get("screen");
import { firebase } from '../src/firebase/config'
import BarberShop from "../models/BarberShop";
import Spinner from "react-native-loading-spinner-overlay";

import {
    Images,
    argonTheme as nowTheme,
    Service,
    ServiceList,
    articles,
    argonTheme,
  } from "../constants";
import { ScrollView } from 'react-native-gesture-handler';

class EditServices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceField: null,
            modalVisible: false,
            serviceModified: null,
            loading: false,
            barberShop: this.props.route.params.barberShop,
            services: this.props.route.params.services
        }
    }
    renderAccordions = (services) => {
        const items = [];
        services.map((item) => {
          items.push(
            <Accordian serviceType={item.serviceType} services={item.services} editable setServiceModified={this.setServiceModified} setServiceField={this.setServiceField} setModalVisible={this.setModalVisible} />
          );
        });
        return items;
    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    setServiceField = (field) => {
        this.setState({ serviceField: field });
    }

    setServiceModified = (oldKey) => {
        this.setState({ serviceModified: oldKey });
    }

    renderModal = (serviceField= null) => {
        {   
        // console.log(serviceField);
        if(!serviceField) 
            return (<></>)
        const categoryModal = (Object.keys(serviceField).length > 0 && Object.keys(serviceField)[0] === "serviceType");
        return(
        <View
            style={styles.centeredView}
            renderToHardwareTextureAndroid
            shouldRasterizeIOS
        >
            <Modal
            animationType="fade"
            transparent={true}
            backdropOpacity={0.5}
            useNativeDriver={false}
            isVisible={this.state.modalVisible}//this.state.modalVisible
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
            }}
            >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <TouchableOpacity
                style={{
                    position: 'absolute',
                    right: 23,
                    top: 23,
                    color: '#00000080',
                }}
                hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                onPress={() => {this.setState((prevState) => { return { ...prevState, modalVisible: !prevState.modalVisible} });}}
                >
                    <Icon 
                        name="close" 
                        family="AntDesign"
                        size={25}
                        style={{
                            color: '#00000080'
                        }}
                    /> 
                </TouchableOpacity>
                <Text style={styles.modalText}>Edit Services</Text>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.child}>
                <View style = {{ marginTop: 30}}>
                <CustomForm
                    action = {
                        (result)=> {
                            // this.setState({ loading: true })
                            
                            // var barberShop = this.state.barberShop
                            var shallowShop = new BarberShop()
                            console.log("barbershop, look at services",this.state.barberShop)
                            shallowShop.services = {...this.state.barberShop.services}
                            shallowShop.uid = this.state.barberShop.uid
                            shallowShop.updateServiceCategory(this.state.serviceModified, result)
                            console.log("shallowshop services are", shallowShop.services);
                            console.log("this state. services are ", this.state.services);
                            console.log("BEFORE this.state is ", this.state);
                            var oldCategory = this.state.serviceModified;
                            this.setState(prevState => ({
                                services: prevState.services.map(
                                obj => (obj.serviceType === oldCategory ? Object.assign(obj, { serviceType: result }) : obj)
                              )
                            }));
                        }
                    }
                    afterSubmit = {() => console.log("afterSubmit!")}
                    buttonText = "Save Changes"
                    closeModalText = {
                        categoryModal ? 
                            "Delete Category" : 
                            "Delete Service"
                    }
                    fields = {serviceField}
                    closeModal = {() => {this.setState((prevState) => { return { ...prevState, modalVisible: !prevState.modalVisible} });}}
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
                >
                </CustomForm>
                </View>
                </ScrollView>
                </View>
            </View>
            </Modal>
        </View>
        )
        }
      };

    render() {
        const { navigation } = this.props;
        return (
            <ScrollView flex={1}>
                <View style={styles.modal}>{this.renderModal(this.state.serviceField)}</View>
                <Spinner
                    visible={this.state.loading}
                    textContent={"Loading..."}
                    textStyle={styles.spinnerTextStyles}
                />
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
                    <View style={styles.accordion}>{this.renderAccordions(this.state.services)}</View>
                </Block>
                </Block>
          </ScrollView>
        );
    }
}



const styles = StyleSheet.create({
screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

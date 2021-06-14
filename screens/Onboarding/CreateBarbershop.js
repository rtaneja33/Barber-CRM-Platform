import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import { firebase } from "../../src/firebase/config";
import { Block, Button as GaButton, theme, Text } from "galio-framework";
import { argonTheme, tabs } from "../../constants";
import OnboardingForm from "../../components/OnboardingForm";
import { validateContent } from "../../constants/utils";
const { width, height } = Dimensions.get("screen");
import Spinner from "react-native-loading-spinner-overlay";
import BarberShop from "../../models/BarberShop";
import { BackButton, Logo, HeaderSpecial, Background, ButtonSpecial } from '../../components'
import TextInput from '../../components/TextInput'
import { nameValidator } from '../helpers/nameValidator'
import { addressValidator } from '../helpers/addressValidator'
class CreateBarbershop extends React.Component {
  constructor(props) {
    super(props);
    console.log("PROPS ARE", props);
    this.state = {
      loading: false,
      fullname: "",
      phone: "",
      shopName: {value: "", error:""},
      address: {value: "", error:""},
      barberShop: null,
    };
  }

   onCreateShopPressed = async () => {
    console.log("on create shop pressed", this.state.shopName, this.state.address)
    const nameError = nameValidator(this.state.shopName.value);
    // var barberShop = new BarberShop();
    // barberShop.shopName = this.state.shopName.value.trim();
    // barberShop.address = this.state.address.value.trim();
    this.setState({loading:true})
    console.log("About to validate address of: ", this.state.address.value)
    addressValidator(this.state.address.value).then((addressError) => {
      console.log("return from async address validator is", addressError);
      // console.log("returnVal is ", addressError)
      this.setState({loading: false})
      if(nameError || addressError){
        this.setState({shopName: { ...this.state.shopName, error: nameError }, address: { ...this.state.address, error: addressError }})
        return
      }
      else{
        const {navigation} = this.props;
        var barberShop = new BarberShop();
        barberShop.shopName = this.state.shopName.value.trim();
        barberShop.address = this.state.address.value.trim();
        navigation.navigate('AddServices', {barberShop: barberShop});
      }
      
    })
  }

  //   const timer = setTimeout(() => {
  //     this.setState({loading: false})
  // },);

  render() {
    return (
      
      <Background>
      <BackButton goBack={this.props.navigation.goBack} />
      
      
      {/* <HeaderSpecial>Welcome back.</HeaderSpecial> */}
      {/* <Block>  */}
        <Spinner
          // textContent={"Loading..."}
          textStyle={styles.spinnerTextStyles}
          visible={this.state.loading}
        />
        {/* <Block > */}
          {/* <ScrollView
            showsVerticalScrollIndicator={false}
            centerContent
            contentContainerStyle = {{backgroundColor: 'blue'}}
          > */}
            {/* <View> */}
            <Text bold size={36} style={styles.title}>
            Create My Shop
           </Text>
            <TextInput
              label="Shop Name*"
              returnKeyType="next"
              value={this.state.shopName.value}
              onChangeText={(text) => this.setState({shopName: { value: text, error: '' }})}
              error={!!this.state.shopName.error}
              errorText={this.state.shopName.error}
              autoCapitalize="sentences"
              autoCompleteType="name"
              textContentType="organizationName"
            />
            <TextInput
              label="Address*"
              returnKeyType="done"
              value={this.state.address.value}
              onChangeText={(text) => this.setState({address: { value: text, error: '' }})}
              error={!!this.state.address.error}
              errorText={this.state.address.error}
              textContentType="fullStreetAddress"
              autoCompleteType="street-address"
            />
            <ButtonSpecial disabled = {this.state.shopName.value.length <1 || this.state.address.value.length <1}
             mode="contained" 
             style={
              (this.state.shopName.value.length >0)
              ? {backgroundColor: argonTheme.COLORS.BARBERBLUE, marginTop: 30}
              : {backgroundColor: argonTheme.COLORS.MUTED, marginTop: 30}
            } 
             onPress={this.onCreateShopPressed}> 
              Continue
            </ButtonSpecial>
      </Background>
    );
  }
}

const styles = StyleSheet.create({
  child: {
    width: "100%",
  },
  centeredView: {
    // // position: "relative",
    // padding: theme.SIZES.BASE,
    flexDirection: 'row',
  
  },
  title: {
    paddingBottom: argonTheme.SIZES.BASE,
    // paddingHorizontal: 15,
    color: argonTheme.COLORS.HEADER,
    
  },
  
});

export default CreateBarbershop;

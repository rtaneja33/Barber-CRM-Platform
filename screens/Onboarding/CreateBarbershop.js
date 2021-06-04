import React from "react";
import {
  StyleSheet,
  TextInput,
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
import { BackButton, Logo, HeaderSpecial, Background } from '../../components'



class CreateBarbershop extends React.Component {
  constructor(props) {
    super(props);
    console.log("PROPS ARE", props);
    this.state = {
      loading: false,
      fullname: "",
      phone: "",
      barberShop: null,
    };
  }

  //   const timer = setTimeout(() => {
  //     this.setState({loading: false})
  // },);

  render() {
    return (
      <Background>
      <BackButton goBack={this.props.navigation.goBack} />
      
      {/* <HeaderSpecial>Welcome back.</HeaderSpecial> */}
      <Block>
        <Spinner
          // textContent={"Loading..."}
          textStyle={styles.spinnerTextStyles}
          visible={this.state.loading}
        />
        <Text bold size={36} style={styles.title}>
            Create My Shop
          </Text>
        <Block style={styles.centeredView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={styles.child}
          >
            {/* <View> */}
            <OnboardingForm
              action={(address, email, name) => {
                 this.setState({ loading: true });
                 setTimeout(() => {
                  this.setState({ loading: false });
                  const {navigation} = this.props;
                  var barberShop = new BarberShop();
                  barberShop.email = email;
                  barberShop.shopName = name;
                  barberShop.address = address;
                  navigation.navigate('AddServices', {barberShop: barberShop});
                }, 300);
              }}
              afterSubmit={() => console.log("afterSubmit!")}
              buttonText="Continue"
              fields={{
                shopName: {
                  label: "Shop Name*",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                  },
                },
                shopEmail: {
                  label: "Shop Email*",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                  },
                },
                shopAddress: {
                  label: "Shop Address*",
                  validators: [validateContent],
                  inputProps: {
                    backgroundColor: "transparent",
                  },
                },
              }}
            ></OnboardingForm>
            {/* </View> */}
          </ScrollView>
        </Block>
      </Block>
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

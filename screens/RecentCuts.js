import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity, View, RefreshControl } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components
import { argonTheme, tabs } from "../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../components/";
import { firebase } from "../src/firebase/config"
const { width, height } = Dimensions.get("screen");
import { useContext } from 'react';
// import { BarberContext } from '../App';
import { AppointmentCards } from "../components";


class RecentCuts extends React.Component {

    // static contextType = BarberContext;

    constructor(props) {
        super(props);
        // this.loadAppointments();
        this.state = {
            references: null,
            refreshing: false,
            // barberShop: null,
        };
       // this.getReferences();
    }

    componentDidMount() {
        this.getInitialReferences()
    }
    getInitialReferences = async () => {
      const shopID = firebase.auth().currentUser.uid
      this.setState({refreshing: true})
      // console.log("get references shop id is", shopID);
      const references = await firebase
        .firestore()
        .collection("Appointments")
        .where("barberUID", "==", shopID )
        .orderBy("timestamp", "desc")
        .limit(5)
        .get();
      this.setState({
        references: references,
        refreshing: false,
      })
    }

    getReferencesOnRefresh = async () => {
        const shopID = firebase.auth().currentUser.uid
        this.setState({refreshing: true})
        // console.log("get references shop id is", shopID);
        const references = await firebase
          .firestore()
          .collection("Appointments")
          .where("barberUID", "==", shopID )
          .orderBy("timestamp", "desc")
          .limit(5)
          .get();
        
        if(references.size > this.state.references.length){
          this.setState({
            references: references,
            refreshing: false,
          })
        }
        else {
          this.setState({
            refreshing: false,
          })
        }
        
    }

  render() {
    return (
      <Block flex center>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 30, width }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.getReferencesOnRefresh}
            />
          }
        >
            <Block>
              {
                this.state.references ?
                (
                    this.state.references.size > 0 ? 
                    <AppointmentCards 
                        references={this.state.references}
                        barberFacing
                        /> : 
                    <Text center style={{marginTop: height*0.1, fontSize: 15, color: argonTheme.COLORS.HEADER, fontWeight: '500' }}>No appointments have been saved yet.</Text>
                     
                )
                : <></>
              }
              {/* <BarberContext.Consumer>
                {value => <Text>{value.address}</Text>}
                </BarberContext.Consumer> */}
            </Block>
          {/* {this.renderButtons()}
          {this.renderText()}
          {this.renderInputs()}
          {this.renderSocial()}
          {this.renderSwitches()}
          {this.renderNavigation()}
          {this.renderTableCell()} */}
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    marginTop: 44,
    color: argonTheme.COLORS.HEADER
  },
  group: {
    paddingTop: theme.SIZES.BASE * 2
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10
  },
  input: {
    borderBottomWidth: 1
  },
  inputDefault: {
    borderBottomColor: argonTheme.COLORS.PLACEHOLDER
  },
  inputTheme: {
    borderBottomColor: argonTheme.COLORS.PRIMARY
  },
  inputInfo: {
    borderBottomColor: argonTheme.COLORS.INFO
  },
  inputSuccess: {
    borderBottomColor: argonTheme.COLORS.SUCCESS
  },
  inputWarning: {
    borderBottomColor: argonTheme.COLORS.WARNING
  },
  inputDanger: {
    borderBottomColor: argonTheme.COLORS.ERROR
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center"
  },
});

export default RecentCuts;
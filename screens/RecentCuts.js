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
            references: [],
            refreshing: false,
            loadingExtraData: false,
            page: 1,
            lastTimeStamp: null
            // barberShop: null,
        };
       // this.getReferences();
    }

    componentDidMount() {
        this.getInitialReferences()
    }
    getInitialReferences = async () => {
      console.log("in get initial references")
      const shopID = firebase.auth().currentUser.uid
      this.setState({refreshing: true})
      // console.log("get references shop id is", shopID);
      let query = await firebase
        .firestore()
        .collection("Appointments")
        .where("barberUID", "==", shopID )
        .orderBy("timestamp", "desc");
      var docs = []
      query.limit(3).get().then(querySnapshot => {
        const references = querySnapshot
        querySnapshot.forEach((document) => {
          docs.push(document)
          let data = document.data();
          var options = { timeZone: 'UTC', timeZoneName: 'short' };
          let dateString = data.timestamp.toDate().toLocaleDateString("en-US", options) 
          let timeString = data.timestamp.toDate().toLocaleTimeString("en-US") 
          console.log("IN INITIAL REFERENCE, TIMESTAMP FOR ITEM IS", dateString,timeString, "NOTES ARE", data.notes);
        })
        console.log("in initial ref, references.docs is this long", docs.length)
        this.setState({
          references: docs,
          refreshing: false,
          lastTimeStamp: querySnapshot && querySnapshot.docs && querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length-1].data().timestamp : null
        })
      })
    }
    getReferencesOnRefresh = async () => {
      const shopID = firebase.auth().currentUser.uid
      this.setState({refreshing: true})
      console.log("REFRESHING....")
      // console.log("get references shop id is", shopID);
      let query = await firebase
        .firestore()
        .collection("Appointments")
        .where("barberUID", "==", shopID )
        .orderBy("timestamp", "desc");

      query.startAfter(this.state.lastTimeStamp).limit(6).get().then(querySnapshot => {
        const references = querySnapshot
        var newRef = [...this.state.references]
        querySnapshot.forEach((document) => {
          newRef.push(document)
          let data = document.data();
          var options = { timeZone: 'UTC', timeZoneName: 'short' };
          let dateString = data.timestamp.toDate().toLocaleDateString("en-US", options) 
          let timeString = data.timestamp.toDate().toLocaleTimeString("en-US") 
          console.log("IN REFRESHED REFERENCE, TIMESTAMP FOR ITEM IS", dateString,timeString, "NOTES ARE", data.notes);
        })
        this.setState({
          references: newRef,
          refreshing: false,
        })
        console.log("this.state.references is now this long", this.state.references.length)
      })
    }

    getReferencesOnRefresh2 = async () => {
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

    isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
      const paddingToBottom = 20;
      return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
    }

  render() {
    if(this.state.references)
      console.log("this.state.references.length is in render: ", this.state.references.length)
    return (
      <Block flex center>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 30, width }}
          scrollEventThrottle={50}
          onScroll={({nativeEvent}) => {
            if (this.isCloseToBottom(nativeEvent) && !this.state.refreshing) {
              console.log("AT BOTTOM! LOAD MORE");
              this.getReferencesOnRefresh();
            }
          }}
          
        >
            <Block>
              {
                this.state.references ?
                (
                    this.state.references.length > 0 ? 
                    <AppointmentCards 
                        references={this.state.references}
                        key={this.state.references.length}
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
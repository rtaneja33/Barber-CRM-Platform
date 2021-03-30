import React from "react";
import { ScrollView, StyleSheet, Dimensions, TouchableOpacity, FlatList } from "react-native";
// Galio components
import { Block, Text, Button as GaButton, theme } from "galio-framework";
// Argon themed components
import { argonTheme, tabs } from "../constants/";
import { Button, Select, Icon, Input, Header, Switch } from "../components/";
import { firebase } from "../src/firebase/config"
const { width } = Dimensions.get("screen");
import { useContext } from 'react';
// import { BarberContext } from '../App';
import { AppointmentCards } from "../components";
import * as Location from 'expo-location';

var distanceRadius = 0.2;

class Explore extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            locationEnabled: false,
            barbers: []
        };
        this.getLocation();
    }
    
    async getLocation() {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            this.setState({
                locationEnabled: false
            })
            return;
        } else {
            this.setState({
                locationEnabled: true
            })

            let location = await Location.getCurrentPositionAsync({});
            
            let currentLatitude = Number(location.coords.latitude);
            let currentLongitude = Number(location.coords.longitude);
            
            await this.loadNearbyBarbers(currentLongitude, currentLatitude);
        }
    }
    
    async loadNearbyBarbers(currentLongitude, currentLatitude) {
        var barbers = []

        const closestBarbersSnapshot = await firebase.firestore().collection("BarberShops").where('lat', '>', currentLatitude - distanceRadius).where('lat', '<', currentLatitude + distanceRadius).get();
        if (closestBarbersSnapshot.empty) {
            console.log('No nearby barbers :(');
        } else { // compare longitude
            closestBarbersSnapshot.forEach(doc => {
                let barberLong = doc.data()["long"]
                if (barberLong > currentLongitude - distanceRadius && barberLong < currentLongitude + distanceRadius) {
                    var barberData = doc.data();
                    barberData["id"] = doc.id;
                    barbers.push(barberData);
                }
            });
        }
        this.setState({
            barbers: barbers
        });
    }

    componentDidMount() {
        
    }

    render() {

        if (this.state.barbers.length > 0) {
            console.log("barbers")
            console.log(this.state.barbers)
             return (
                <Block flex center>
                    <FlatList
                    data={this.state.barbers}
                     renderItem={({barber}) => <Text style={styles.item}>{console.log(barber)}</Text>}
                    />
                </Block>
            );
        } else {
            return (
                    <Block flex center>
                    </Block>
                );
        }
    }
}

const styles = StyleSheet.create({
});

export default Explore;

import React from "react";
import { View, Avatar, ScrollView, StyleSheet, Dimensions, TouchableOpacity, FlatList } from "react-native";
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
import Spinner from "react-native-loading-spinner-overlay";
import * as Location from 'expo-location';

const BASE_SIZE = theme.SIZES.BASE;
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

var distanceRadius = 0.2;

class Explore extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            locationEnabled: false,
            barbers: [],
            spinner: false
        };
        this.getLocation();
    }
    
    renderBarberShopItem = ({item}) =>
    (
     <View style={styles.barberShopListItem}>
        <TouchableOpacity onPress={() => {this.props.navigation.navigate('BarbershopPage', {shopID: item.id})}}>
            <Block style={{backgroundColor: "#8fcadd", padding: 15, flexDirection: 'row', borderRadius: 10}}>
            <Block style={{width: '90%'}}>
                <Text style={{ color: "#2f363c", fontWeight: '600' }} size={BASE_SIZE * 1.5}>{item.shopName}</Text>
                <Text style={{ color: "#808080", paddingTop: 5 }} size={BASE_SIZE * 1.2}>{item.aboutDescription}</Text>
            </Block>
            <Block style={{justifyContent: 'space-around'}}>
            <Icon
                name="nav-right"
                family="ArgonExtra"
                size={BASE_SIZE}
                color={COLOR_GREY}
            />
            </Block>
            </Block>
        </TouchableOpacity>
     </View>
    );
    
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

        this.setState({spinner: true});
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
            barbers: barbers,
            spinner: false
        });
    }

    componentDidMount() {
        
    }

    render() {

        if (this.state.barbers.length > 0) {
             return (
                <Block style={{flex: 1, marginTop: 10}}>
                    <FlatList
                    numColumns={1}
                    data={this.state.barbers}
                    renderItem={this.renderBarberShopItem}
                    />
                </Block>
            );
        } else {
            if (this.state.locationEnabled) {
                return (
                    <Block flex center style={{justifyContent: 'center'}}>
                        <Spinner
                            visible={this.state.spinner}
                            textContent={"Loading..."}
                            textStyle={styles.spinnerTextStyles}
                        />
                        {!this.state.spinner &&
                            <Block style={{width: "70%"}}>
                                <Text style={{ textAlign: 'center', color: "#2f363c", fontWeight: '600' }} size={BASE_SIZE * 1.75}>
                                    There are currently no barber shops nearby. Check again soon
                                </Text>
                            </Block>
                        }
                    </Block>
                );
            } else {
                return (
                    <Block flex center style={{justifyContent: 'center'}}>
                        <Block style={{width: "70%"}}>
                        <Text style={{ textAlign: 'center', color: "#2f363c", fontWeight: '600' }} size={BASE_SIZE * 1.75}>
                            Please enable location to see nearby barber shops
                        </Text>
                        </Block>
                    </Block>
                );
            }
        }
    }
}

const styles = StyleSheet.create({
barberShopListItem: {
    flex: 1,
    padding: 7
},
spinnerTextStyles: {
color: "#FFF",
}
});

export default Explore;

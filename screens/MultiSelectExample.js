import React from "react";
import{StyleSheet,View,ActivityIndicator,FlatList,Text,TouchableOpacity,Image} from "react-native";
import { Icon } from "react-native-elements";
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';
import CustomerPreview from '../models/CustomerPreview'
// import Customer from "../models/Customer";
import BarberShops from '../models/BarberShop';
import { firebase } from '../src/firebase/config';


export default class MultiSelectExample extends React.Component { 
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      dataSource: [],
      selected: [],
     };
  }
  componentDidMount() {this.fetchData();}
  
  fetchData = async () => {this.setState({loading: true});
    console.log("fetching data...")
    this.setState({loading:true})
    const { status, canAskAgain } = await Permissions.getAsync(Permissions.CONTACTS);
    switch (status){
        case 'denied':
            console.log("denied");
            if(!canAskAgain){
                alert("Please check settings and allow import contacts")
                this.setState({loading:false})
                return
            }
        
        case 'undetermined':
            const response = await Permissions.askAsync(Permissions.CONTACTS);
            if(response.status !== 'granted')
            {
                this.setState({loading:false});
                alert("Please check settings and allow import contacts")
                return
            }
            // else permission was given this time, drop down to granted case below
        case 'granted':
            Contacts.getContactsAsync({
                fields:[Contacts.Fields.PhoneNumbers,
                Contacts.Fields.Emails],
                }).then(responseJson => {
                    responseJson = responseJson.data.map(item => {
                    item.isSelect = false;
                    item.selectedClass = styles.list;
                    
                    return item;
                    });
                    responseJson.sort((a, b) => a.firstName > b.firstName ? 1 : -1)  
                    this.setState({
                    loading: false,
                    dataSource: responseJson,
                    });
                }).catch(error => {this.setState({loading: false});
                });
            break
        default:
            alert("error occurred with status?", status)
            this.setState({loading:false});
           
    }
    // console.log("checkling status...");
    // console.log("status is", status,"canaskagain is", canAskAgain)
    
    //     // load from phone storage / backend

    //     // load in contacts here

    //     const {data} = await Contacts.getContactsAsync({
    //       fields:[Contacts.Fields.PhoneNumbers,
    //       Contacts.Fields.Emails]
    //     });
    //     updateCustomers(data);
    //     setMemContacts(data);
    //   // console.log(customers);

    //     this.setState({loading:false});
    //     break
    
  };

FlatListItemSeparator = () => <View style={styles.line} />;

selectItem = data => {
  data.item.isSelect = !data.item.isSelect;
  data.item.selectedClass = data.item.isSelect ? styles.selected : styles.list;

  const index = this.state.dataSource.findIndex(
    item => data.item.id === item.id
  );

  this.state.dataSource[index] = data.item;
  var newCustomerPreview = new CustomerPreview();
  newCustomerPreview.name = data.item.name;
  newCustomerPreview.phonenumber = data.item.phoneNumbers && data.item.phoneNumbers[0] ? data.item.phoneNumbers[0].digits : "";
  this.setState({
    dataSource: this.state.dataSource,
    selected: [...this.state.selected, newCustomerPreview ]
  });
};

goToStore = () => {
    this.setState({loading: true})
    var barberRef =  BarberShops.loadFromID(firebase.auth().currentUser.uid);
    barberRef.addCustomerPreviews(this.state.selected);
    barberRef.update().then((response)=>{
        this.setState({loading: false})
        console.log("response is", response);

    });
}

renderItem = data =>
  <TouchableOpacity
    style={[styles.list, data.item.selectedClass]}      
    onPress={() => this.selectItem(data)}
  >
  <Text color = "white">{data.item.name}</Text>
  <Image
    source={{ uri: data.item.thumbnailUrl }}
    style={{ width: 40, height: 40, margin: 6 }}
  />
  <Text style={styles.lightText}> Hello WORLD </Text>
</TouchableOpacity>

render() {
  const itemNumber = this.state.dataSource.filter(item => item.isSelect).length;
  if (this.state.loading) {return (
    <View style={styles.loader}>
     <ActivityIndicator size="large" color="purple" />
    </View>
  );
}

 return (
   <View style={styles.container}>
    {/* <TouchableOpacity
        style={{
        position: "absolute",
        right: 23,
        top: 23,
        zIndex: 0,
        color: "#00000080",
        }}
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        onPress={() => {
        // setBarberModalVisible(!barberModalVisible)
        console.log("this.props is", this.props)
        // setSpinner(false)
        }}
    >
        <Text style={{color: 'white'}}>Import</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={{
        position: "absolute",
        left: 23,
        top: 23,
        zIndex: 0,
        color: "#00000080",
        }}
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        onPress={() => {
        console.log("hit close button...")
        this.props.hideImport()
        // setBarberModalVisible(!barberModalVisible)
        // setSpinner(false)
        }}
    >
        <Icon
        name="close"
        family="AntDesign"
        size={25}
        color="white"
        style={{
            color: "white",
        }}
        />
    </TouchableOpacity> */}
   {/* <Text style={styles.title}>Import Contacts</Text> */}
   <FlatList
     data={this.state.dataSource}
    ItemSeparatorComponent={this.FlatListItemSeparator}
    renderItem={item => this.renderItem(item)}
    keyExtractor={item => item.id.toString()}
    extraData={this.state}
   />

  <View style={styles.numberBox}>
    <Text style={styles.number}>{itemNumber}</Text>
  </View>
  
  <TouchableOpacity style={styles.icon}>
    <View>
      <Icon
        raised
        name="shopping-cart"
        type="font-awesome"
        color="#e3e3e3" 
        size={30} 
        onPress={() => this.goToStore()}
        containerStyle={{ backgroundColor: "#FA7B5F" }}
      />
    </View>
 </TouchableOpacity>
</View>
);}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#192338",
    paddingVertical: 10,
    position: "relative"
   },
  title: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10
  },
  loader: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  list: {
    paddingVertical: 5,
    margin: 3,
    flexDirection: "row",
    backgroundColor: "#192338",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: -1
  },
  lightText: {
    color: "#f7f7f7",
    width: 200,
    paddingLeft: 15,
    fontSize: 12
   },
  line: {
    height: 0.5,
    width: "100%",
    backgroundColor:"rgba(255,255,255,0.5)"
  },
  icon: {
    position: "absolute",  
    bottom: 20,
    width: "100%", 
    left: 290, 
    zIndex: 1
  },
  numberBox: {
    position: "absolute",
    bottom: 75,
    width: 30,
    height: 30,
    borderRadius: 15,  
    left: 330,
    zIndex: 3,
    backgroundColor: "#e3e3e3",
    justifyContent: "center",
    alignItems: "center"
  },
  number: {fontSize: 14,color: "#000"},
  selected: {backgroundColor: "#FA7B5F"},
  });
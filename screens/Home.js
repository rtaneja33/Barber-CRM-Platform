import { Image, Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Platform, TextInput, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';

import React, { useEffect } from 'react';
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';
import { Avatar } from 'react-native-elements';
import Modal from 'react-native-modal';
import { Block, theme } from 'galio-framework';
import { articles, Images, argonTheme } from "../constants/";
const { width } = Dimensions.get('screen');
const BASE_SIZE = theme.SIZES.BASE;
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';
import Icon from "../components/Icon";
import { selectContactPhone } from 'react-native-select-contact';
import Popover from 'react-native-popover-view';
import MultiSelectExample from './MultiSelectExample';

export default function Home({ navigation, route }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [customers, updateCustomers] = React.useState([]);
  const [inMemoryContacts, setMemContacts] = React.useState([]);
  const [showImport, setShowImport] = React.useState(false);
  const changeShowImport = () => {
    navigation.navigate("ImportContacts")
  }

  const hideImport = () => {
    setShowImport(false)
  }

  const loadContacts = async()=>{
    const { status, canAskAgain } = await Permissions.getAsync(Permissions.CONTACTS);
    // if (status === 'granted') {
    //   return
    // }
    console.log("checkling status...");
    console.log("status is", status,"canaskagain is", canAskAgain)
    switch (status){
      case 'granted':
        // load from phone storage / backend
        const {data} = await Contacts.getContactsAsync({
          fields:[Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails]
        });
        updateCustomers(data);
        setMemContacts(data);
      // console.log(customers);
        setIsLoading(false);
        break
      case 'denied':
        console.log("denied");
        setIsLoading(false);
        if(!canAskAgain)
          alert("Please check settings and allow import contacts")
          break
      case 'undetermined':
        console.log("denied");
        // ask 
        const response = await Permissions.askAsync(Permissions.CONTACTS);
        if(response.status !== 'granted')
        {
          setIsLoading(false);
          return
        }
        else{
          console.log("denied after asking!")
          // import contacts selectively, then save this to backend
          // means it is first time
        }
        break
      default:
        setIsLoading(false);
        break

    }


  //   const { status, permissions } = await Permissions.askAsync(Permissions.CONTACTS);
  //   if(status !== 'granted')
  //   {
  //     setIsLoading(false);
  //     return
  //   }
  //   console.log("granted")
  //   const {data} = await Contacts.getContactsAsync({
  //     fields:[Contacts.Fields.PhoneNumbers,
  //     Contacts.Fields.Emails]
  //   });
  //   updateCustomers(data);
  //   setMemContacts(data);
  //  // console.log(customers);
  //   setIsLoading(false);
  } 
  
  useEffect(() => {
    setIsLoading(true);
    loadContacts();
    const { status, permissions } = Permissions.askAsync(Permissions.CONTACTS).then((response)=>{
      console.log("now permissions ARE", response.permissions, "status is", response.status);

    });
    //console.log("called loadContacts in useEffect");
    //console.log("inMemContacts have length of", inMemoryContacts.length);
    // navigation.setOptions({
    //   searchFunc: searchContacts,
    // });
  }, []);


  const renderItem = ({item}) => 
    (
    <View style={{minHeight:70, padding:5}}>
     
      <TouchableOpacity onPress={() => {navigation.navigate('Customers', { params: { fullName: item.firstName + " " + item.lastName, firstName: item.firstName, lastName: item.lastName, phoneNumber:(item.phoneNumbers && item.phoneNumbers.length > 0) ? item.phoneNumbers[0].number : ""}, screen: 'UserProfile'}); console.log("passing param", item.firstName)}}>
      <Block row center card shadow space="between" style={styles.card} key={item.firstName}>
        <Block style={styles.left}>
          <Avatar
            size="medium"
            rounded
            title= {(item.firstName ? item.firstName[0]: "") + (item.lastName ? item.lastName[0]: "")}
            overlayContainerStyle={{backgroundColor: argonTheme.COLORS.BARBERBLUE }}
            activeOpacity={0.4}
          />
        </Block>
        <Block flex>
          <Text style={{ color: "#2f363c",fontSize: 20, fontWeight: '600' }} size={BASE_SIZE * 1.125}>{item.firstName} {item.lastName}</Text>
          <Text style={{ color: "#808080", paddingTop: 2 }} size={BASE_SIZE * 0.875} muted>{(item.phoneNumbers && item.phoneNumbers.length > 0) ? item.phoneNumbers[0].number : ""}</Text>
        </Block>
        <View style={styles.right}>
          <Icon
              name="nav-right"
              family="ArgonExtra"
              size={BASE_SIZE}
              color={COLOR_GREY}
          />
        </View>
      </Block>
      </TouchableOpacity>
    </View>
  );

  const searchContacts = (value) =>{
    const filteredContacts = customers.filter(
      contact => {
        let contactLowercase = (contact.firstName + ' ' + contact.lastName).toLowerCase()
        let searchTermLowercase = value.toLowerCase()

        return contactLowercase.indexOf(searchTermLowercase) > -1;
      }
    )
    updateCustomers(filteredContacts)
  }

  

  useEffect(() => {
    navigation.setOptions({
      searchFunc: searchContacts.bind(this),
      showImport: changeShowImport.bind(this)
      
    });
  }, [isLoading])

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '5%'
        }}
      />
    )
  }
  

  return (
    <View
    
    style={{
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: '#f7f8f3'
    }}>
          
      <View style={{flex:1, backgroundColor: '#f7f8f3'}}>
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
        setShowImport(true)
        // setSpinner(false)
        }}
    >
        <Text style={{color: 'red'}}>Import</Text>
    </TouchableOpacity>
        {isLoading? (
          <View style={{...StyleSheet.absoluteFill,
            alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size ="large" color="#bad555"/>
          </View>
        ) : 
          null
        }
        {/* <Popover isVisible={showImport} onRequestClose={() => setShowImport(false)}> */}
        {/* <Text>This popover will stay centered on the screen, even when the device is rotated!</Text> */}
        {/* <MultiSelectExample hideImport={()=>{hideImport()}}></MultiSelectExample> */}
        {/* </Popover> */}

        
        {/* <Popover
          from={(
            <TouchableOpacity>
              <Text>Press here to open popover!</Text>
            </TouchableOpacity>
          )}>
          <Text>This is the contents of the popover</Text>
        </Popover> */}
        <FlatList
          data={customers}
          renderItem={renderItem}
          keyExtractor={(item, index)=> index.toString()}
          ListEmptyComponent={()=>(
            <View style={{
              flex:1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 50
            }}>
            <Text style={{ color:'#bad555' }}>No Customers Found</Text>
            </View>
          )}
        />

      </View>
          
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginLeft: 10,
    color:'#78bcc4',
    fontSize:20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  button : {
    backgroundColor: 'blue',
    padding:20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20, 
    color: '#fff',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  },
  // card: {
  //   backgroundColor: theme.COLORS.WHITE,
  //   width: width - theme.SIZES.BASE * 2,
  //   marginVertical: 0,
  //   elevation: theme.SIZES.BASE / 2,
  // },
  full: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  noRadius: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  rounded: {
    borderRadius: theme.SIZES.BASE * 0.1875,
  },
  gradient: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    position: 'absolute',
    overflow: 'hidden',
    borderBottomRightRadius: theme.SIZES.BASE * 0.5,
    borderBottomLeftRadius: theme.SIZES.BASE * 0.5,
  },
  card: {
    borderColor: 'transparent',
    // marginVertical: BASE_SIZE / 2,
    marginVertical: 1,
    padding: BASE_SIZE+10,
    backgroundColor: COLOR_WHITE,
    shadowOpacity: .9,
  },
  left: {
    marginRight: BASE_SIZE,
  },
  right: {
    width: BASE_SIZE * 2,
    backgroundColor: 'transparent',
    elevation: 10, justifyContent:'center', alignItems: 'center',
  },
});

import React, { useEffect } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Platform, TextInput, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import logo from './assets/logo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import * as Sharing from 'expo-sharing';
import * as Contacts from 'expo-contacts';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import { render } from 'react-dom';
import { Avatar } from 'react-native-elements';

export default function App() {

  const [isLoading, setIsLoading] = React.useState(false);
  const [customers, updateCustomers] = React.useState([]);
  const [inMemoryContacts, setMemContacts] = React.useState([]);
  console.log("hello world");
  loadContacts = async()=>{
    console.log("in load contacts");
    const { status, permissions } = await Permissions.askAsync(Permissions.CONTACTS);
    if(status !== 'granted')
    {
      return
    }
    console.log("granted")
    const {data} = await Contacts.getContactsAsync({
      fields:[Contacts.Fields.PhoneNumbers,
      Contacts.Fields.Emails]
    });
    updateCustomers(data);
    setMemContacts(data);
    console.log(customers);
    setIsLoading(false);
  } 
  
  useEffect(() => {
    setIsLoading(true);
    loadContacts();
  }, [])

  renderItem = ({item}) =>(
    
    <View style={{minHeight:70, padding:5}}>
      <TouchableOpacity onPress={() => alert('Item pressed!')}>
        <View
          style={{
            flexDirection: 'row',
            padding: 16,
            alignItems: 'center'
          }}>
          <Avatar rounded title="MD"/>
          <Text
            category='s1'
            style={{
              color: '#000'
            }}>{item.firstName} {item.lastName}</Text>
        </View>
      </TouchableOpacity>
      <Text style={{color: '#78bcc4', fontWeight: 'bold', fontSize: 26}}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={{color:'#f7444e', fontWeight:'bold'}}>
        {item.phoneNumbers[0].digits}
      </Text>
    </View>
  );

  const searchContacts = (value) =>{
    
    const filteredContacts = inMemoryContacts.filter(
      contact => {
        let contactLowercase = (contact.firstName + ' ' + contact.lastName).toLowerCase()
        let searchTermLowercase = value.toLowerCase()

        return contactLowercase.indexOf(searchTermLowercase) > -1;
      }
    )
    updateCustomers(filteredContacts)
  }

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
      paddingVertical: 20,
      marginTop: 40,
      backgroundColor: '#f7f8f3'
    }}>
      {/* <SafeAreaView style={{backgroundColor: '#f7f8f3' }} />
      <TextInput
        placeholder="Search"
        placeholderTextColor="#dddddd"
        style={{
          backgroundColor: '#f7f8f3', 
          height: 50,
          fontSize:36,
          padding: 10,
          color: '#78bcc4',
          borderBottomWidth:0.5,
          borderBottomColor: '#7d90a0'
      }}
        onChangeText={(value)=> searchContacts(value)}
      /> */}
      <View style={{flex:1, backgroundColor: '#f7f8f3'}}>
        {isLoading? (
          <View style={{...StyleSheet.absoluteFill,
            alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size ="large" color="#bad555"/>
          </View>
        ) : 
          null
        }
        <FlatList
          data={customers}
          renderItem={renderItem}
          keyExtractor={(item, index)=> index.toString()}
          ItemSeparatorComponent={renderSeparator}
          ListHeaderComponent={
          <View
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: '#CED0CE',
              justifyContent: 'center',
              marginBottom: 20
            }}>
            <TextInput
              onChangeText={(value)=> searchContacts(value)}
              placeholder='Search'
              textStyle={{ color: '#78bcc4' }}
              style={{
                marginLeft: 10,
                color:'#78bcc4',
                fontSize:20,
                fontWeight: 'bold',
              }}
            />
          </View>
           }
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
  }
});

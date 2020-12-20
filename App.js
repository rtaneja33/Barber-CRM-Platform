import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Platform, TextInput, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import logo from './assets/logo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import * as Sharing from 'expo-sharing';
import * as Contacts from 'expo-contacts';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import { render } from 'react-dom';
export default function App() {

  const [isLoading, setIsLoading] = React.useState(false);
  const [customers, updateCustomers] = React.useState([]);
  const [didMount, setDidMount] = React.useState(false);
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
    console.log(customers);
    setIsLoading(false);
  } 
  
  useEffect(() => {
    setDidMount(true);
    setIsLoading(true);
    loadContacts();
  }, [])

  renderItem = ({item}) =>(
    <View style={{minHeight:70, padding:5}}>
      <Text>
        {item.firstName}{item.lastName}
      </Text>
      <Text>
        {item.phoneNumbers[0].digits}
      </Text>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: '#2f353c' }} />
      <TextInput
        placeholder="Search"
        placeholderTextColor="#dddddd"
        style={{
          backgroundColor: '#2f363c', 
          height: 50,
          fontSize:36,
          padding: 10,
          color: 'white',
          borderBottomWidth:0.5,
          borderBottomColor: '#7d90a0'
      }}
      />
      <View style={{flex:1, backgroundColor: '#2f363c'}}>
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
          ListEmptyComponent={()=>(
            <View style={{
              flex:1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 50
            }}>
            <Text style={{color:'#bad555' }}>No Customers Found</Text>
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

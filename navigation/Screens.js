import React, { useState, useContext } from 'react';
import { Easing, Animated, Dimensions, TextInput, Button } from "react-native";

import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Block } from "galio-framework";
import { firebase } from '../src/firebase/config'
// screens
import Home from "../screens/Home";
import SignupScreen from "../screens/SignupScreen";
import AddAppointment from "../screens/AddAppointment";
import SavePreferences from "../screens/SavePreferences";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import Elements from "../screens/Elements";
import BarbershopPage from "../screens/BarbershopPage";
import LoginScreen from "../screens/LoginScreen";
import CustomerLogin from "../screens/CustomerLogin";
import EditServices from "../screens/EditServices";
import CreateBarbershop from "../screens/Onboarding/CreateBarbershop";
import CreateCustomer2 from "../screens/Onboarding/CreateCustomer2";
import AddServices from "../screens/Onboarding/AddServices";
import CustomCamera from "../components/CustomCamera";
import Customer from "../models/Customer";
import BarberShop from "../models/BarberShop";
import CustomerPhone from "../screens/Onboarding/CustomerPhone";
// drawer
import CustomDrawerContent from "./Menu";

// header for screens
import { Icon, Header } from "../components";
import { argonTheme, tabs } from "../constants";
import { useEffect } from "react";
import AddBarbers from '../screens/Onboarding/AddBarbers';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import SaveNotes from '../screens/SaveNotes';
import FrontCamera from '../components/AppointmentPhotos/FrontCamera';
import SideCamera from '../components/AppointmentPhotos/SideCamera';
import RearCamera from '../components/AppointmentPhotos/RearCamera';
import RecentCuts from "../screens/RecentCuts";
import Explore from "../screens/Explore";
import StartScreen from '../screens/StartScreen';
import CreateAccount from '../screens/Onboarding/CreateAccount';
import CustomerVerifyPhone from '../screens/Onboarding/CustomerVerifyPhone';
import CustomerLoginVerify from '../screens/CustomerLoginVerify';
import MultiSelectExample from '../screens/MultiSelectExample';
const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function RecentCutsStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Recent Cuts"
        component={RecentCuts}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Recent Cuts" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}

function ExploreStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Explore"
        component={Explore}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Explore" navigation={navigation} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="BarbershopPage"
        component={BarbershopPage}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              transparent
              navigation={navigation}
              scene={scene}
              back
            />
          ),

          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}

function BarbershopPageStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="BarbershopPage"
        component={BarbershopPage}
        options={{
          header: ({ navigation, scene }) => (
            <Header 
              title="My Shop" 
              navigation={navigation} 
              scene={scene} 
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
            <Stack.Screen
              name="EditServices"
              component={EditServices}
              options={{
                header: ({ navigation, scene }) => (
                  <Header
                    title="Edit Services"
                    back
                    navigation={navigation}
                    scene={scene}
                  />
                ),
              }}
          />
    </Stack.Navigator>
  );
}

// function CreateShopStack(props){
//   return (
//     <Stack.Navigator mode="card" headerMode="screen">
      
//     </Stack.Navigator>
//   )
// }
function CustomerStackScreen() {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="MyCustomers"
        component={Home}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              title="My Customers"
              searchFunc={scene.descriptor.options.searchFunc}
              search
              showImport={scene.descriptor.options.showImport}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen 
        name="ImportContacts" 
        component={MultiSelectExample}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              title="Import Contacts"
              back
              navigation={navigation}
              scene={scene}
            />
          ),
        }}  
      />
    </Stack.Navigator>
  )
}

function HomeStack(props) {
  // const { fullName } = props.route.params.params;
  // console.log("full name is", fullName);
  // console.log("in profile stack");

  // navigation.setOptions({tabBarVisible: false});
  return (
    <Stack.Navigator mode="card" headerMode="screen" >
      <Stack.Screen
        name = "My Customers"
        component={CustomerStackScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={Profile}
        // initialParams = {{
        //   ...{fullName}
        // }}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              iconColor = {argonTheme.COLORS.HEADER}
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
          <Stack.Screen
            name="AddAppointment"
            component={AddAppointment}
              options={{
                header: ({ navigation, scene }) => (
                  <Header
                    title=""
                    back
                    white
                    transparent
                    navigation={navigation}
                    scene={scene}
                  />
                ),
                headerTransparent: true
              }}
          />
          <Stack.Screen
            name="SavePreferences"
            component={SavePreferences}
              options={{
                header: ({ navigation, scene }) => (
                  <Header
                    title=""
                    back
                    white
                    transparent
                    navigation={navigation}
                    scene={scene}
                  />
                ),
                headerTransparent: true
              }}
          />
          <Stack.Screen
            name="SaveNotes"
            component={SaveNotes}
            options={{
              header: ({ navigation, scene }) => (
                <Header
                  title=""
                  back
                  white
                  transparent
                  navigation={navigation}
                  scene={scene}
                />
              ),
              headerTransparent: true
            }}
          />
          <Stack.Screen
            name="FrontCamera"
            component={FrontCamera}
              options={{
                header: ({ navigation, scene }) => (
                  <Header
                    title=""
                    back
                    white
                    transparent
                    navigation={navigation}
                    scene={scene}
                  />
                ),
                headerTransparent: true
              }}
          />
          <Stack.Screen
            name="SideCamera"
            component={SideCamera}
              options={{
                header: ({ navigation, scene }) => (
                  <Header
                    title=""
                    back
                    white
                    transparent
                    navigation={navigation}
                    scene={scene}
                  />
                ),
                headerTransparent: true
              }}
          />
          <Stack.Screen
            name="RearCamera"
            component={RearCamera}
              options={{
                header: ({ navigation, scene }) => (
                  <Header
                    title=""
                    back
                    white
                    transparent
                    navigation={navigation}
                    scene={scene}
                  />
                ),
                headerTransparent: true
              }}
          />

    </Stack.Navigator>
  );
}

export default function AppStack(props) { // if this causes an error, try expo start -c to clean cache -> rebuild (requires new version for tab nav.)
  
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isBarber, setIsBarber] = useState(false);
  const [mounted, isMounted]= useState(true);
  // const getLoggedInBarbershop = async () => {
  //     // get User data
  //   await BarberShops.loadFromID(firebase.auth().currentUser.uid).then( barber => {
  //     setBarberContext(barber);
  //     console.log("barber is", barber);
  //   })
  // }
  // const val = useContext(BarberContext);

  function onAuthStateChanged(user) {


      setUser(user);
      console.log("user is", user);
      if(user == null)
        setInitializing(false);
      else {
        Customer.loadFromID(user.uid).then( customer => {
          if (customer != null) {
              changeTypeOfAccount(false);
              if(initializing)
                setInitializing(false);
          }
        })
        // getLoggedInBarbershop();
        BarberShop.loadFromID(user.uid).then( barber => {
            if (barber != null) {
                changeTypeOfAccount(true);
                if(initializing)
                  setInitializing(false);

            }
        })
      }
  }
    
  function changeTypeOfAccount(isBarber) {
      setIsBarber(isBarber);
  }
  function getTabBarVisibility(route){
    const routeName = getFocusedRouteNameFromRoute(route)
    console.log("NEW ROUTE NAME IS", routeName);
    if(routeName === 'My Customers' || !routeName){
      console.log("tab bar will be visible!");
      return true;
    }
    console.log("tab bar will be hidden!");
    return false;
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [user]);

  if(initializing){
    return null
  }
  if(user && isBarber){
    console.log("IN BARBER SIDE");        

    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={RecentCutsStack} options ={{
          tabBarLabel: "Recent Cuts",
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
            name="cut"
            family="Ionicon"
            size= {size}
            color={focused ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}
          />
          ),
        }} />
        <Tab.Screen name="Customers" component={HomeStack} options ={({route})=> ({
          tabBarLabel: "Customers",
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
            name="people"
            family="IonIcon"
            size= {size}
            color={focused ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}
          />
          ), })}/>
        <Tab.Screen name="BarbershopPage" component={BarbershopPageStack} options ={{
          tabBarLabel: "My Shop",
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
            name="store"
            family="MaterialIcons"
            size= {size}
            color={focused ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}
          />
          ), }}/>
      </Tab.Navigator>
    )
  } else if (user && !isBarber) {
    console.log("IN CUSTOMER SIDE");  
      return (      
      <Tab.Navigator>
          <Tab.Screen name="Explore" component={ExploreStack} options ={{
            tabBarLabel: "Explore",
            tabBarIcon: ({ focused, color, size }) => (
              <Icon
              name="cut"
              family="Ionicon"
              size= {size}
              color={focused ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}
            />
            ),
          }} />
        <Tab.Screen name="Profile" component={Profile} options ={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
            name="store"
            family="MaterialIcons"
            size= {size}
            color={focused ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}
          />
          ), }}/>
      </Tab.Navigator>
              )
  } else {
    return (
      <Stack.Navigator mode="card" headerMode="screen" screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen
          name="SignUp"
          component={SignUpStack}
        />
      </Stack.Navigator>
    )
  }

  function SignUpStack(props){
    return (
      <Stack.Navigator mode="card" headerMode="screen">
        <Stack.Screen
          name="StartScreen"
          component={StartScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={LoginScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="CustomerLogin"
          component={CustomerLogin}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="CustomerLoginVerify"
          component={CustomerLoginVerify}
          options={{
            headerShown: false
          }}
        />
            <Stack.Screen
              name="CreateCustomer2"
              component={CreateCustomer2}
              options={{
                headerShown: false
              }}
            />
             <Stack.Screen
              name="CustomerPhone"
              component={CustomerPhone}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="CustomerVerifyPhone"
              component={CustomerVerifyPhone}
              options={{
                headerShown: false
              }}
            />
        <Stack.Screen
          name="CreateBarbershop"
          component={CreateBarbershop}
          options={{
            headerShown: false,
            // header: ({ navigation, scene }) => (
            //   <Header
            //     title=""
            //     back
            //     black
            //     transparent
            //     navigation={navigation}
            //     scene={scene}
            //   />
            // ),
          }}
        />
        <Stack.Screen
          name="AddServices"
          component={AddServices}
          options={{
            headerShown: false,
          }}
          // options={{
          //   header: ({ navigation, scene }) => (
          //     <Header
          //       transparent
          //       navigation={navigation}
          //       scene={scene}
          //     />
          //   ),
          // }}
        />

         <Stack.Screen
          name="AddBarbers"
          component={AddBarbers}
          options={{
            headerShown: false,
          }}
          // options={{
          //   header: ({ navigation, scene }) => (
          //     <Header
          //       title=""
          //       back
          //       black
          //       transparent
          //       navigation={navigation}
          //       scene={scene}
          //     />
          //   ),
          // }}
        />
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccount}
          options={{
            headerShown: false,
          }}
        />
        
      </Stack.Navigator>
    )
  }
  // return (
  //     <Tab.Navigator>
  //       <Tab.Screen name="Home" component={ElementsStack} options ={{
  //         tabBarLabel: "Recent Cuts",
  //         tabBarIcon: ({ focused, color, size }) => (
  //           <Icon
  //           name="cut"
  //           family="Ionicon"
  //           size= {size}
  //           color={focused ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}
  //         />
  //         ),
  //       }} />
  //       <Tab.Screen name="Customers" component={HomeStack} options ={{
  //         tabBarLabel: "Customers",
  //         tabBarIcon: ({ focused, color, size }) => (
  //           <Icon
  //           name="people"
  //           family="IonIcon"
  //           size= {size}
  //           color={focused ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}
  //         />
  //         ), }}/>
  //       <Tab.Screen name="Articles" component={ArticlesStack} options ={{
  //         tabBarLabel: "My Shop",
  //         tabBarIcon: ({ focused, color, size }) => (
  //           <Icon
  //           name="store"
  //           family="MaterialIcons"
  //           size= {size}
  //           color={focused ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}
  //         />
  //         ), }}/>
  //     </Tab.Navigator>
    // <Tab.Navigator
    //   style={{ flex: 1 }}
    //   drawerContent={props => <CustomDrawerContent {...props} />}
    //   drawerStyle={{
    //     backgroundColor: "white",
    //     width: width * 0.8
    //   }}
    //   drawerContentOptions={{
    //     activeTintcolor: "white",
    //     inactiveTintColor: "#000",
    //     activeBackgroundColor: "transparent",
    //     itemStyle: {
    //       width: width * 0.75,
    //       backgroundColor: "transparent",
    //       paddingVertical: 16,
    //       paddingHorizonal: 12,
    //       justifyContent: "center",
    //       alignContent: "center",
    //       alignItems: "center",
    //       overflow: "hidden"
    //     },
    //     labelStyle: {
    //       fontSize: 18,
    //       marginLeft: 12,
    //       fontWeight: "normal"
    //     }
    //   }}
    //   initialRouteName="Home"
    // >
    //   <Tab.Screen name="Home" component={HomeStack} />
    //   <Tab.Screen name="Profile" component={ProfileStack} />
    //   <Tab.Screen name="Account" component={Register} />
    //   <Tab.Screen name="Elements" component={ElementsStack} />
    //   <Tab.Screen name="Articles" component={ArticlesStack} />
    // </Tab.Navigator>

}


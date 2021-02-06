import React, { useState } from 'react';
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
import Articles from "../screens/Articles";
import EditServices from "../screens/EditServices";
import CreateBarbershop from "../screens/Onboarding/CreateBarbershop";
import AddServices from "../screens/Onboarding/AddServices";
import CustomCamera from "../components/CustomCamera";

// drawer
import CustomDrawerContent from "./Menu";

// header for screens
import { Icon, Header } from "../components";
import { argonTheme, tabs } from "../constants";
import { useEffect } from "react";
import AddBarbers from '../screens/Onboarding/AddBarbers';
import { FalsyText } from '@ui-kitten/components/devsupport';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ElementsStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Elements"
        component={Elements}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Elements" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
            <Stack.Screen
        name="Pro"
        component={Pro}
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

function ArticlesStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Articles"
        component={Articles}
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

function CreateShopStack(props){
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      
    </Stack.Navigator>
  )
}

function HomeStack(props) {
  // const { fullName } = props.route.params.params;
  // console.log("full name is", fullName);
  // console.log("in profile stack");

  // navigation.setOptions({tabBarVisible: false});
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="My Customers"
        component={Home}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              title="My Customers"
              searchFunc={scene.descriptor.options.searchFunc}
              search
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Pro"
        component={SignupScreen}
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
            name="CustomCamera"
            component={CustomCamera}
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



// export default function OnboardingStack(props) {
//   const [isLoading, setLoading] = React.useState(false);
//   const [user, setUser] = useState(null);
//   if(isLoading){
//     return(
//       <></>
//     )
//   }
  
//   // https://www.freecodecamp.org/news/react-native-firebase-tutorial/
//   useEffect(() => {
//     const usersRef = firebase.firestore().collection('users');
//     firebase.auth().onAuthStateChanged(user => {
//       if (user) {
//         usersRef
//           .doc(user.uid)
//           .get()
//           .then((document) => {
//             const userData = document.data()
//             setLoading(false)
//             setUser(userData)
//           })
//           .catch((error) => {
//             setLoading(false)
//           });
//       } else {
//         setLoading(false)
//       }
//     });
//   }, []);

//   return (
//     <Stack.Navigator mode="card" headerMode="none">
//       { user ? (
//         <Stack.Screen name="App" component={AppStack} />
//       ) : (
//         <>
//           <Stack.Screen
//             name="SignupScreen"
//             component={SignupScreen}
//             option={{
//               headerTransparent: true
//             }}
//           />
//            <Stack.Screen name="App" component={AppStack} />
//         </>
//       )}
//     </Stack.Navigator>
//   );
// }
// function SignedOut(props) {
//   return (
//     <Stack.Navigator mode="card" headerMode="screen">
//       <Stack.Screen
//         name="SignUp"
//         component={SignupScreen}
//         options={{
//           headerTransparent: true
//         }}
//       />
//       <Stack.Screen name="App" component={AppStack} />
//     </Stack.Navigator>
//   )
// }

export default function AppStack(props) { // if this causes an error, try expo start -c to clean cache -> rebuild (requires new version for tab nav.)
  
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if(initializing)
      setInitializing(false);
  }
  function getTabBarVisibility(route){
    const routeName = getFocusedRouteNameFromRoute(route)
    if(routeName === 'My Customers'){
      return true;
    }
    return false;
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if(initializing){
    return null
  }
  if(user){
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={ElementsStack} options ={{
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
        <Tab.Screen name="Articles" component={ArticlesStack} options ={{
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
  }
  else {
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
          name="SignUp"
          component={SignupScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="CreateBarbershop"
          component={CreateBarbershop}
          options={{
            header: ({ navigation, scene }) => (
              <Header
                title=""
                back
                black
                transparent
                navigation={navigation}
                scene={scene}
              />
            ),
          }}
        />
        <Stack.Screen
          name="AddServices"
          component={AddServices}
          options={{
            header: ({ navigation, scene }) => (
              <Header
                title=""
                back
                black
                transparent
                navigation={navigation}
                scene={scene}
              />
            ),
          }}
        />
         <Stack.Screen
          name="AddBarbers"
          component={AddBarbers}
          options={{
            header: ({ navigation, scene }) => (
              <Header
                title=""
                back
                black
                transparent
                navigation={navigation}
                scene={scene}
              />
            ),
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


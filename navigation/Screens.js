import React from "react";
import { Easing, Animated, Dimensions, TextInput } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Block } from "galio-framework";

// screens
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import Elements from "../screens/Elements";
import Articles from "../screens/Articles";
// drawer
import CustomDrawerContent from "./Menu";

// header for screens
import { Icon, Header } from "../components";
import { argonTheme, tabs } from "../constants";

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

function ProfileStack(props, route) {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="Profile"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true,
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

function HomeStack(props) {
  // const { fullName } = props.route.params.params;
  // console.log("full name is", fullName);
  // console.log("in profile stack");
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
        component={Onboarding}
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
    </Stack.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}

function AppStack(props) { // if this causes an error, try expo start -c to clean cache -> rebuild (requires new version for tab nav.)
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} options ={{
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
        {/* <Tab.Screen name="Profile" component={ProfileStack} options ={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
            name="shop"
            family="ArgonExtra"
            size={14}
            color={focused ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}
          />
          ), }}
          /> */}
        <Tab.Screen name="Account" component={Register} options ={{
          tabBarLabel: "Customers",
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
            name="people"
            family="IonIcon"
            size= {size}
            color={focused ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}
          />
          ), }}/>
        {/* <Tab.Screen name="Elements" component={ElementsStack} options ={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
            name="shop"
            family="ArgonExtra"
            size={14}
            color={focused ? argonTheme.COLORS.BARBERBLUE : argonTheme.COLORS.BARBERRED}
          />
          ), }}/> */}
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
  );
}


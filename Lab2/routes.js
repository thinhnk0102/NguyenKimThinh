// src/Buoi2/routes.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

// Import screens
import Contacts from "./Contacts";
import Profile from "./Profile";
import Favorites from "./Favorites";
import User from "./User";
import Options from "./Options";

// Import utilities
import colors from "../utils/colors";

// Import components from root components folder
import ContactListItem from "../components/ContactListItem";
import ContactThumbnail from "../components/ContactThumbnail";
import DetailListItem from "../components/DetailListItem";

// Icon helper function
const getTabBarIcon =
  (icon) =>
  ({ color }) =>
    <MaterialIcons name={icon} size={26} style={{ color }} />;

// Create stack navigators
const Stack = createNativeStackNavigator();

// Contacts Stack
const ContactsScreens = () => {
  return (
    <Stack.Navigator
      initialRouteName="Contacts"
      screenOptions={{
        headerTintColor: "white",
        headerStyle: { backgroundColor: colors.blue },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Contacts"
        component={Contacts}
        options={{ title: "Contacts" }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({ route }) => {
          const { contact } = route.params;
          const { name } = contact;
          return {
            title: name.split(" ")[0],
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: colors.blue,
            },
          };
        }}
      />
    </Stack.Navigator>
  );
};

// Favorites Stack
const FavoritesScreens = () => {
  return (
    <Stack.Navigator
      initialRouteName="Favorites"
      screenOptions={{
        headerTintColor: "white",
        headerStyle: { backgroundColor: colors.blue },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Favorites"
        component={Favorites}
        options={{ title: "Favorites" }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({ route }) => {
          const { contact } = route.params;
          const { name } = contact;
          return {
            title: name.split(" ")[0],
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: colors.blue,
            },
          };
        }}
      />
    </Stack.Navigator>
  );
};

// User Stack
const UserScreens = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="User"
      screenOptions={{
        headerTintColor: "white",
        headerStyle: { backgroundColor: colors.blue },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="User"
        component={User}
        options={{
          headerTitle: "Me",
          headerRight: () => (
            <MaterialIcons
              name="settings"
              size={24}
              style={{ color: "white", marginRight: 10 }}
              onPress={() => navigation.navigate("Options")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Options"
        component={Options}
        options={{ title: "Options" }}
      />
    </Stack.Navigator>
  );
};

// Tab Navigator
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="ContactsScreens"
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.blue },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.greyDark,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ContactsScreens"
        component={ContactsScreens}
        options={{
          tabBarIcon: getTabBarIcon("list"),
        }}
      />
      <Tab.Screen
        name="FavoritesScreens"
        component={FavoritesScreens}
        options={{
          tabBarIcon: getTabBarIcon("star"),
        }}
      />
      <Tab.Screen
        name="UserScreens"
        component={UserScreens}
        options={{
          tabBarIcon: getTabBarIcon("person"),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

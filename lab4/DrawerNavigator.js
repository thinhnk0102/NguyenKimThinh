import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import Home from "./Home";
import Detail from "./Detail";
import Profile from "./Profile";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>Admin</Text>
      </View>
      <DrawerItem
        label="Home"
        icon={({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate("Home")}
        activeBackgroundColor="transparent"  // Màu nền trong suốt khi mục được chọn
        activeTintColor="#000"  // Màu chữ đen khi mục được chọn
        labelStyle={styles.drawerItemLabel}
        style={props.state.index === 0 ? styles.activeItem : {}}
        inactiveBackgroundColor="transparent"  // Màu nền trong suốt khi mục không được chọn
        inactiveTintColor="#000"  // Màu chữ đen khi mục không được chọn
      />
      <DrawerItem
        label="Detail"
        icon={({ color, size }) => (
          <Ionicons name="information-circle" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate("Detail")}
        activeBackgroundColor="transparent"
        activeTintColor="#000"
        labelStyle={styles.drawerItemLabel}
        style={props.state.index === 1 ? styles.activeItem : {}}
        inactiveBackgroundColor="transparent"
        inactiveTintColor="#000"
      />
      <DrawerItem
        label="Profile"
        icon={({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate("Profile")}
        activeBackgroundColor="transparent"
        activeTintColor="#000"
        labelStyle={styles.drawerItemLabel}
        style={props.state.index === 2 ? styles.activeItem : {}}
        inactiveBackgroundColor="transparent"
        inactiveTintColor="#000"
      />
      <View style={styles.divider} />
      <DrawerItem
        label="Logout"
        icon={({ color, size }) => (
          <Ionicons name="log-out-outline" size={size} color={color} />
        )}
        labelStyle={styles.drawerItemLabel}
        inactiveTintColor="#000"  // Màu chữ đen cho mục "Logout"
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },  // Màu nền header trắng
        headerTintColor: "#000",  // Màu chữ header đen
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
      />
      <Drawer.Screen
        name="Detail"
        component={Detail}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 15,
    backgroundColor: "#fff",  // Nền trắng cho header
  },
  drawerHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",  // Màu chữ header đen
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  drawerItemLabel: {
    fontSize: 16,
    marginLeft: 8, 
    color: "#000",  // Màu chữ cho tất cả mục là đen
  },
  activeItem: {
    backgroundColor: "transparent",  // Màu nền trong suốt khi mục được chọn
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  }
});

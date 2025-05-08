import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, onValue } from "firebase/database";

const SpaServicesScreen = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const servicesRef = ref(db, "services");
    const unsubscribe = onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setServices(list);
      } else {
        setServices([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const renderService = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() =>
        navigation.navigate("ServiceDetail", { serviceId: item.id })
      }
    >
      <Text style={styles.serviceName} numberOfLines={1}>
        {item.serviceName}
      </Text>
      <Text style={styles.servicePrice}>{item.price?.toLocaleString()} đ</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nguyễn Kim Thịnh</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Icon name="account-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logolab3.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* <Text style={styles.logoText}>KAMI SPA</Text> */}
      </View>
      {/* Danh sách dịch vụ */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Danh sách dịch vụ</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddService")}
        >
          <Icon name="add-circle" size={32} color="#e57373" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderService}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      {/* Bottom Tab */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="home" size={28} color="#e57373" />
          <Text style={styles.tabLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="attach-money" size={28} color="#888" />
          <Text style={styles.tabLabel}>Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="people" size={28} color="#888" />
          <Text style={styles.tabLabel}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="settings" size={28} color="#888" />
          <Text style={styles.tabLabel}>Setting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e57373",
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  logo: {
    width: 200,
    height: 150,
    marginTop: 10,
    marginBottom: -10,
  },
  logoText: {
    fontSize: 22,
    color: "#e57373",
    fontWeight: "bold",
    marginTop: -10,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  addButton: {
    marginLeft: 8,
  },
  serviceItem: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#eee",
  },
  serviceName: {
    fontSize: 16,
    color: "#222",
    flex: 1,
    marginRight: 10,
  },
  servicePrice: {
    fontSize: 15,
    color: "#e57373",
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  tabLabelActive: {
    fontSize: 12,
    color: "#e57373",
    marginTop: 2,
    fontWeight: "bold",
  },
});

export default SpaServicesScreen;
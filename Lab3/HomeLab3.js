import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { ref, onValue, getDatabase } from "firebase/database";
import { auth } from "../firebaseConfig";

const SpaServicesScreen = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const db = getDatabase();

  // Lấy thông tin người dùng
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserInfo(data);
          setIsAdmin(data.role === 'admin');
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Lấy danh sách dịch vụ
  useEffect(() => {
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

  const handleServicePress = (item) => {
    if (!isAdmin) {
      // Nếu là customer, chỉ cho phép xem chi tiết
      navigation.navigate("ServiceDetail", { serviceId: item.id });
    } else {
      // Nếu là admin, hiển thị menu với các tùy chọn
      Alert.alert(
        "Tùy chọn",
        "Chọn hành động",
        [
          {
            text: "Xem chi tiết",
            onPress: () => navigation.navigate("ServiceDetail", { serviceId: item.id })
          },
          {
            text: "Chỉnh sửa",
            onPress: () => navigation.navigate("EditService", { serviceId: item.id })
          },
          {
            text: "Hủy",
            style: "cancel"
          }
        ]
      );
    }
  };

  const renderService = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => handleServicePress(item)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
      ) : (
        <View style={styles.serviceImagePlaceholder}>
          <Icon name="spa" size={40} color="#e57373" />
        </View>
      )}
      <View style={styles.serviceInfo}>
        <View style={styles.serviceTextContainer}>
          <Text style={styles.serviceName} numberOfLines={1}>
            {item.serviceName}
          </Text>
          <Text style={styles.servicePrice}>{item.price?.toLocaleString()} đ</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#e57373" />
      </View>
    </TouchableOpacity>
  );

  const renderPromoService = ({ item }) => (
    <TouchableOpacity
      style={styles.promoServiceItem}
      onPress={() => handleServicePress(item)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.promoServiceImage} />
      ) : (
        <View style={styles.promoServiceImagePlaceholder}>
          <Icon name="spa" size={40} color="#e57373" />
        </View>
      )}
      <View style={styles.promoServiceInfo}>
        <Text style={styles.promoServiceName} numberOfLines={1}>
          {item.serviceName}
        </Text>
        <View style={styles.promoPriceContainer}>
          <Text style={styles.promoOriginalPrice}>
            {item.price?.toLocaleString()} đ
          </Text>
          <Text style={styles.promoNewPrice}>
            {(item.price * 0.8)?.toLocaleString()} đ
          </Text>
        </View>
        <View style={styles.promoBadge}>
          <Text style={styles.promoBadgeText}>-20%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedService = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredServiceItem}
      onPress={() => handleServicePress(item)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.featuredServiceImage} />
      ) : (
        <View style={styles.featuredServiceImagePlaceholder}>
          <Icon name="spa" size={40} color="#e57373" />
        </View>
      )}
      <View style={styles.featuredServiceInfo}>
        <Text style={styles.featuredServiceName} numberOfLines={1}>
          {item.serviceName}
        </Text>
        <Text style={styles.featuredServicePrice}>
          {item.price?.toLocaleString()} đ
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#e57373" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>Xin chào,</Text>
          <Text style={styles.headerTitle}>{userInfo?.displayName || 'Chưa cập nhật'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={() => navigation.navigate("Profile")}
        >
          {userInfo?.avatarURL ? (
            <Image source={{ uri: userInfo.avatarURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="account-circle" size={32} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logolab3.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Promotional Services */}
        <View style={styles.promoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ưu đãi hôm nay</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={services.slice(0, 3)}
            keyExtractor={(item) => item.id}
            renderItem={renderPromoService}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promoList}
          />
        </View>

        {/* Featured Services */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={services.slice(0, 4)}
            keyExtractor={(item) => item.id}
            renderItem={renderFeaturedService}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* All Services */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tất cả dịch vụ</Text>
            {isAdmin && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AddService")}
              >
                <Icon name="add-circle" size={32} color="#e57373" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={renderService}
            scrollEnabled={false}
            contentContainerStyle={styles.serviceList}
          />
        </View>
      </ScrollView>

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
    </SafeAreaView>
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
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  avatarContainer: {
    marginLeft: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  logo: {
    width: 200,
    height: 120,
  },
  scrollView: {
    flex: 1,
  },
  promoSection: {
    backgroundColor: "#fff",
    paddingVertical: 15,
  },
  promoList: {
    paddingHorizontal: 15,
  },
  promoServiceItem: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promoServiceImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  promoServiceImagePlaceholder: {
    width: "100%",
    height: 160,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  promoServiceInfo: {
    padding: 12,
  },
  promoServiceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  promoPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  promoOriginalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  promoNewPrice: {
    fontSize: 16,
    color: "#e57373",
    fontWeight: "bold",
  },
  promoBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#e57373",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  promoBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  featuredSection: {
    backgroundColor: "#f8f8f8",
    paddingVertical: 15,
  },
  featuredList: {
    paddingHorizontal: 15,
  },
  featuredServiceItem: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredServiceImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  featuredServiceImagePlaceholder: {
    width: "100%",
    height: 140,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredServiceInfo: {
    padding: 12,
  },
  featuredServiceName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  featuredServicePrice: {
    fontSize: 15,
    color: "#e57373",
    fontWeight: "bold",
  },
  seeAllText: {
    color: "#e57373",
    fontSize: 14,
    fontWeight: "500",
  },
  servicesSection: {
    backgroundColor: "#f8f8f8",
    paddingTop: 15,
    paddingBottom: 80,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  serviceList: {
    padding: 15,
  },
  serviceItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  serviceImagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  serviceTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
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
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  tabLabelActive: {
    fontSize: 12,
    color: "#e57373",
    marginTop: 4,
    fontWeight: "bold",
  },
  addButton: {
    marginLeft: 10,
  },
});

export default SpaServicesScreen;
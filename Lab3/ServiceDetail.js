import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth } from "../firebaseConfig";

const ServiceDetail = ({ route }) => {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const serviceRef = ref(db, `services/${serviceId}`);
    const unsubscribe = onValue(serviceRef, (snapshot) => {
      setService(snapshot.val());
    });

    // Kiểm tra quyền admin
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      const unsubscribeUser = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setIsAdmin(userData.role === 'admin');
        }
      });
      return () => {
        unsubscribe();
        unsubscribeUser();
      };
    }

    return () => unsubscribe();
  }, [serviceId]);

  const handleMenu = () => {
    Alert.alert(
      "Tùy chọn",
      "",
      [
        {
          text: "Chỉnh sửa",
          onPress: () => navigation.navigate("EditService", { serviceId }),
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: handleDelete,
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]
    );
  };

  const handleDelete = async () => {
    Alert.alert(
      "Cảnh báo",
      "Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác",
      [
        {
          text: "HỦY",
          style: "cancel",
        },
        {
          text: "XÓA",
          style: "destructive",
          onPress: async () => {
            try {
              const db = getDatabase();
              const serviceRef = ref(db, `services/${serviceId}`);
              await remove(serviceRef);
              Alert.alert("Thành công", "Đã xóa dịch vụ!");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Lỗi", error.message);
            }
          },
        },
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => isAdmin ? (
        <TouchableOpacity onPress={handleMenu} style={{ marginRight: 15 }}>
          <Icon name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      ) : null,
      headerStyle: {
        backgroundColor: "#e57373",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation, service, isAdmin]);

  if (!service) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {service.imageUrl ? (
        <Image source={{ uri: service.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Icon name="spa" size={60} color="#e57373" />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{service.serviceName}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{service.price?.toLocaleString()} đ</Text>
        </View>

        {service.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{service.description}</Text>
          </View>
        )}

        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
            <View style={styles.infoRow}>
              <Icon name="person" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Người tạo:</Text>
              <Text style={styles.infoValue}>{service.creator || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="access-time" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Thời gian tạo:</Text>
              <Text style={styles.infoValue}>{service.time || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="update" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Cập nhật lần cuối:</Text>
              <Text style={styles.infoValue}>{service.finalUpdate || "N/A"}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  priceContainer: {
    backgroundColor: "#e57373",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    marginRight: 10,
    minWidth: 120,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
});

export default ServiceDetail; 
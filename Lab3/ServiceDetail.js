import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { getDatabase, ref, onValue, remove, push, set, get } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth, db } from "../firebaseConfig";
import DateTimePicker from '@react-native-community/datetimepicker';

const LOCATIONS = [
  { id: 'hanoi', name: 'Hà Nội' },
  { id: 'hcm', name: 'Thành phố Hồ Chí Minh' },
  { id: 'danang', name: 'Đà Nẵng' },
];

const ServiceDetail = ({ route }) => {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const serviceRef = ref(db, `services/${serviceId}`);
    const unsubscribe = onValue(serviceRef, (snapshot) => {
      setService(snapshot.val());
    });

    // Kiểm tra quyền người dùng
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      const unsubscribeUser = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setIsAdmin(userData.role === 'admin');
          setIsCustomer(userData.role === 'customer');
        }
      });
      return () => {
        unsubscribe();
        unsubscribeUser();
      };
    }

    return () => unsubscribe();
  }, [serviceId]);

  const handleRegisterService = async () => {
    if (!selectedLocation) {
      Alert.alert('Lỗi', 'Vui lòng chọn địa điểm');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập để đăng ký dịch vụ');
        return;
      }

      setLoading(true);

      // Lấy thông tin customer
      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (!userData) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
        return;
      }

      // Kiểm tra xem user đã đăng ký dịch vụ này chưa
      const registrationsRef = ref(db, 'service_registrations');
      const snapshot = await get(registrationsRef);
      const registrations = snapshot.val();

      if (registrations) {
        const existingRegistration = Object.values(registrations).find(
          reg => reg.userId === user.uid && reg.serviceId === serviceId
        );

        if (existingRegistration) {
          Alert.alert('Thông báo', 'Bạn đã đăng ký dịch vụ này rồi');
          return;
        }
      }

      // Tạo đăng ký mới với thông tin chi tiết
      const newRegistrationRef = push(ref(db, 'service_registrations'));
      const registrationData = {
        // Thông tin đăng ký
        registrationId: newRegistrationRef.key,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        // Thông tin dịch vụ
        serviceId: serviceId,
        serviceName: service.serviceName,
        servicePrice: service.price,
        serviceDescription: service.description,
        serviceImage: service.imageUrl,

        // Thông tin lịch hẹn
        appointmentDate: selectedDate.toISOString().split('T')[0],
        appointmentTime: selectedTime.toLocaleTimeString(),
        location: selectedLocation,
        locationName: LOCATIONS.find(loc => loc.id === selectedLocation)?.name,

        // Thông tin customer
        userId: user.uid,
        customerName: userData.displayName || user.email,
        customerEmail: user.email,
        customerPhone: userData.phone || 'Chưa cập nhật',
        customerAddress: userData.address || 'Chưa cập nhật',
      };

      await set(newRegistrationRef, registrationData);

      // Cập nhật thông tin đăng ký vào profile của customer
      const customerRegistrationsRef = ref(db, `users/${user.uid}/registrations`);
      const customerRegistrationRef = push(customerRegistrationsRef);
      await set(customerRegistrationRef, {
        registrationId: newRegistrationRef.key,
        serviceId: serviceId,
        serviceName: service.serviceName,
        status: 'pending',
        appointmentDate: selectedDate.toISOString().split('T')[0],
        appointmentTime: selectedTime.toLocaleTimeString(),
        location: selectedLocation,
        locationName: LOCATIONS.find(loc => loc.id === selectedLocation)?.name,
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        'Thành công',
        'Đăng ký dịch vụ thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowRegistrationModal(false);
              navigation.reset({
                index: 0,
                routes: [{ name: 'RegisteredServices' }],
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Lỗi', 'Không thể đăng ký dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

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

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
    }
  };

  const renderRegistrationModal = () => (
    <Modal
      visible={showRegistrationModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowRegistrationModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Đăng ký dịch vụ</Text>
            <TouchableOpacity onPress={() => setShowRegistrationModal(false)}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service?.serviceName}</Text>
              <Text style={styles.servicePrice}>{service?.price?.toLocaleString()} đ</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chọn địa điểm</Text>
              <View style={styles.locationContainer}>
                {LOCATIONS.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    style={[
                      styles.locationButton,
                      selectedLocation === location.id && styles.selectedLocation,
                    ]}
                    onPress={() => setSelectedLocation(location.id)}
                  >
                    <Text
                      style={[
                        styles.locationText,
                        selectedLocation === location.id && styles.selectedLocationText,
                      ]}
                    >
                      {location.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chọn ngày</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Icon name="calendar-today" size={20} color="#666" style={styles.buttonIcon} />
                <Text style={styles.dateTimeText}>
                  {selectedDate.toLocaleDateString('vi-VN')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chọn giờ</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Icon name="access-time" size={20} color="#666" style={styles.buttonIcon} />
                <Text style={styles.dateTimeText}>
                  {selectedTime.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegisterService}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Xác nhận đăng ký</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}
    </Modal>
  );

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

        {isCustomer && (
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => setShowRegistrationModal(true)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="add-circle" size={24} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.registerButtonText}>Đăng ký dịch vụ</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {renderRegistrationModal()}
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
  registerButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 15,
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  serviceInfo: {
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 16,
    color: '#e57373',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  locationButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  selectedLocation: {
    backgroundColor: '#e57373',
    borderColor: '#e57373',
  },
  locationText: {
    color: '#666',
  },
  selectedLocationText: {
    color: '#fff',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ServiceDetail; 
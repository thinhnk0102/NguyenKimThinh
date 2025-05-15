import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getDatabase, ref, remove } from 'firebase/database';
import { auth } from '../firebaseConfig';

const RegistrationDetail = ({ route, navigation }) => {
  const { registration } = route.params;
  const [loading, setLoading] = useState(false);

  const handleCancelRegistration = async () => {
    Alert.alert(
      'Xác nhận hủy',
      'Bạn có chắc chắn muốn hủy đăng ký dịch vụ này?',
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const db = getDatabase();
              const user = auth.currentUser;

              // Xóa đăng ký khỏi service_registrations
              const registrationRef = ref(db, `service_registrations/${registration.registrationId}`);
              await remove(registrationRef);

              // Xóa đăng ký khỏi profile của user
              const userRegistrationRef = ref(db, `users/${user.uid}/registrations/${registration.registrationId}`);
              await remove(userRegistrationRef);

              Alert.alert('Thành công', 'Đã hủy đăng ký dịch vụ');
              navigation.goBack();
            } catch (error) {
              console.error('Error canceling registration:', error);
              Alert.alert('Lỗi', 'Không thể hủy đăng ký. Vui lòng thử lại sau.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
      
    );
    
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'confirmed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: registration.serviceImage }}
          style={styles.image}
          defaultSource={require('../assets/default-service.png')}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{registration.serviceName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(registration.status) }]}>
              <Text style={styles.statusText}>{getStatusText(registration.status)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin lịch hẹn</Text>
            <View style={styles.infoRow}>
              <Icon name="event" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Ngày:</Text>
              <Text style={styles.infoValue}>{registration.appointmentDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="access-time" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Giờ:</Text>
              <Text style={styles.infoValue}>{registration.appointmentTime}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="location-on" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Địa điểm:</Text>
              <Text style={styles.infoValue}>{registration.locationName}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin dịch vụ</Text>
            <View style={styles.infoRow}>
              <Icon name="attach-money" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Giá:</Text>
              <Text style={styles.infoValue}>{registration.servicePrice?.toLocaleString()} đ</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="description" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Mô tả:</Text>
              <Text style={styles.infoValue}>{registration.serviceDescription}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin đăng ký</Text>
            <View style={styles.infoRow}>
              <Icon name="person" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Người đăng ký:</Text>
              <Text style={styles.infoValue}>{registration.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="email" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{registration.customerEmail}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              <Text style={styles.infoValue}>{registration.customerPhone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="home" size={20} color="#e57373" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Địa chỉ:</Text>
              <Text style={styles.infoValue}>{registration.customerAddress}</Text>
            </View>
          </View>

          {registration.status === 'pending' && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelRegistration}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon name="cancel" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.cancelButtonText}>Hủy đăng ký</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Tab */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('HomeLab3')}
        >
          <Icon name="home" size={28} color="#888" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('RegisteredServices')}
        >
          <Icon name="event-note" size={28} color="#e57373" />
          <Text style={styles.tabLabelActive}>Đăng ký</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('Profile')}
        >
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
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  tabLabelActive: {
    fontSize: 12,
    color: '#e57373',
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default RegistrationDetail; 
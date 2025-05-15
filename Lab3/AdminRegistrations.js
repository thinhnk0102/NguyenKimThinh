import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth, db } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';

const AdminRegistrations = ({ navigation }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const registrationsRef = ref(db, 'service_registrations');
    const unsubscribe = onValue(registrationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allRegistrations = Object.entries(data).map(([id, reg]) => ({
          registrationId: id,
          ...reg
        }));
        // Sắp xếp theo thời gian tạo mới nhất
        allRegistrations.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRegistrations(allRegistrations);
      } else {
        setRegistrations([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = (registrationId, newStatus) => {
    Alert.alert(
      'Xác nhận thay đổi trạng thái',
      'Bạn có chắc chắn muốn thay đổi trạng thái đăng ký này?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              const registrationRef = ref(db, `service_registrations/${registrationId}`);
              await update(registrationRef, { status: newStatus });
              Alert.alert('Thành công', 'Đã cập nhật trạng thái đăng ký');
            } catch (error) {
              console.error('Error updating status:', error);
              Alert.alert('Lỗi', 'Không thể cập nhật trạng thái. Vui lòng thử lại sau.');
            }
          }
        }
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

  const renderRegistrationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.registrationItem}
      onPress={() => navigation.navigate('RegistrationDetail', { registration: item })}
    >
      <Image
        source={{ uri: item.serviceImage }}
        style={styles.serviceImage}
        defaultSource={require('../assets/default-service.png')}
      />
      <View style={styles.registrationInfo}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.customerInfo}>
          <Icon name="person" size={16} color="#666" /> {item.customerName}
        </Text>
        <View style={styles.appointmentContainer}>
          <Text style={styles.appointmentInfo}>
            <Icon name="event" size={16} color="#666" /> {item.appointmentDate}
          </Text>
          <Text style={styles.appointmentInfo}>
            <Icon name="access-time" size={16} color="#666" /> {item.appointmentTime}
          </Text>
        </View>
        <Text style={styles.locationInfo}>
          <Icon name="location-on" size={16} color="#666" /> {item.locationName}
        </Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
          {item.status === 'pending' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={() => handleStatusChange(item.registrationId, 'confirmed')}
              >
                <Icon name="check" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleStatusChange(item.registrationId, 'cancelled')}
              >
                <Icon name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e57373" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý đăng ký dịch vụ</Text>
      </View>

      {registrations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="event-note" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Chưa có đăng ký dịch vụ nào</Text>
        </View>
      ) : (
        <FlatList
          data={registrations}
          renderItem={renderRegistrationItem}
          keyExtractor={(item) => item.registrationId}
          contentContainerStyle={styles.listContainer}
        />
      )}

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
          onPress={() => navigation.navigate('AdminRegistrations')}
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
  header: {
    backgroundColor: '#e57373',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  registrationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  registrationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  customerInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  appointmentContainer: {
    marginBottom: 8,
  },
  appointmentInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
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

export default AdminRegistrations; 
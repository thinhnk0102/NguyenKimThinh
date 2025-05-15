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
import { ref, onValue } from 'firebase/database';

const RegisteredServices = ({ navigation }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const registrationsRef = ref(db, 'service_registrations');
      const unsubscribe = onValue(registrationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const userRegistrations = Object.values(data).filter(
            reg => reg.userId === user.uid
          );
          // Sắp xếp theo thời gian tạo mới nhất
          userRegistrations.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRegistrations(userRegistrations);
        } else {
          setRegistrations([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

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
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
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
        <Text style={styles.headerTitle}>Dịch vụ đã đăng ký</Text>
      </View>

      {registrations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="event-note" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Bạn chưa đăng ký dịch vụ nào</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('HomeLab3')}
          >
            <Text style={styles.browseButtonText}>Xem dịch vụ</Text>
          </TouchableOpacity>
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#e57373',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  
export default RegisteredServices; 
import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';

const ServiceDetail = ({ route }) => {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const serviceRef = ref(db, `services/${serviceId}`);
    const unsubscribe = onValue(serviceRef, (snapshot) => {
      setService(snapshot.val());
    });
    return () => unsubscribe();
  }, [serviceId]);

  // Menu handler
  const handleMenu = () => {
    Alert.alert(
      'Tùy chọn',
      '',
      [
        {
          text: 'Edit',
          onPress: () => navigation.navigate('EditService', { serviceId })
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDelete
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleDelete = async () => {
    Alert.alert(
      "Warning",
      "Are you sure you want to remove this service? This operation cannot be returned",
      [
        {
          text: "CANCEL",
          style: "cancel"
        },
        {
          text: "DELETE",
          style: "destructive",
          onPress: async () => {
            try {
              const db = getDatabase();
              const serviceRef = ref(db, `services/${serviceId}`);
              await remove(serviceRef);
              Alert.alert("Success", "Service deleted!");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          }
        }
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleMenu} style={{ marginRight: 15 }}>
          <MaterialIcons name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#f06292',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, service]);

  if (!service) return <Text>Loading...</Text>;

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <Text style={styles.title}>{service.serviceName}</Text>
        <View style={styles.row}><Text style={styles.label}>Price:</Text><Text style={styles.value}>{service.price?.toLocaleString()} đ</Text></View>
        <View style={styles.row}><Text style={styles.label}>Creator:</Text><Text style={styles.value}>{service.creator || "N/A"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Time:</Text><Text style={styles.value}>{service.time || "N/A"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Final update:</Text><Text style={styles.value}>{service.finalUpdate || "N/A"}</Text></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'start',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    margin: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 320,
    maxWidth: 400,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e57373',
    marginBottom: 22,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  label: {
    fontWeight: 'bold',
    color: '#f06292',
    fontSize: 16,
    minWidth: 110,
  },
  value: {
    color: '#333',
    fontSize: 16,
    flexShrink: 1,
    textAlign: 'right',
  },
  bold: { fontWeight: 'bold' },
});

export default ServiceDetail; 
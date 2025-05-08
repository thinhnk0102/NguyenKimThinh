import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { useNavigation, useRoute } from "@react-navigation/native";

const EditService = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId } = route.params;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const serviceRef = ref(db, `services/${serviceId}`);
    const unsubscribe = onValue(serviceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setName(data.serviceName || "");
        setPrice(data.price ? data.price.toString() : "");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [serviceId]);

  const handleUpdate = async () => {
    if (!name || !price) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const db = getDatabase();
      const serviceRef = ref(db, `services/${serviceId}`);
      await update(serviceRef, {
        serviceName: name,
        price: Number(price),
        finalUpdate: new Date().toLocaleString(),
      });
      Alert.alert("Thành công", "Đã cập nhật dịch vụ!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f8f8f8' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.header}>Edit Service</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Service name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Service name"
            placeholderTextColor="#aaa"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Price *</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor="#aaa"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 40,
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e57373',
    marginBottom: 24,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    color: '#333',
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#222',
  },
  button: {
    backgroundColor: "#e57373",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: '#e57373',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 1,
  },
});

export default EditService; 
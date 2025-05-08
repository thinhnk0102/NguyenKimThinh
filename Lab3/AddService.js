import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getDatabase, ref, push } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const AddService = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const navigation = useNavigation();

  const handleAdd = async () => {
    if (!name || !price) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const db = getDatabase();
      const servicesRef = ref(db, "services");
      await push(servicesRef, {
        serviceName: name,
        price: Number(price),
        creator: "Thịnh",
        time: new Date().toLocaleString(),
        finalUpdate: new Date().toLocaleString(),
      });
      Alert.alert("Thành công", "Đã thêm dịch vụ!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Service name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Input a service name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Price *</Text>
      <TextInput
        style={styles.input}
        placeholder="0"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontWeight: "bold", marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginTop: 5, marginBottom: 10 },
  button: { backgroundColor: "#e57373", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default AddService; 
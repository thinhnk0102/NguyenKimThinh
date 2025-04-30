import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="black" />
        </View>
        <Text style={styles.profileName}>Nguyễn Kim Thịnh</Text>
        <Text style={styles.profileEmail}>nguyenkimthinh.it@gmail.com</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={22} color="black" />
          <Text style={styles.infoText}>+84 12345678</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={22} color="black" />
          <Text style={styles.infoText}>Đại Học Thủ Dầu Một</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#6A5ACD",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

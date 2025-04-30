import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Home Screen</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Detail")}
        >
          <Text style={styles.buttonText}>Go to Detail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F0F4F8", // 💡 Nền sáng dịu
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E1E1E", // 💡 Chữ đậm rõ nét
    textAlign: "center",
  },
  button: {
    backgroundColor: "black", // 💡 Xanh dương hiện đại
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

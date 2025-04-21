import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

// Component Button có thể tái sử dụng
const Button = (props) => (
  <TouchableOpacity
    onPress={props.onPress}
    style={{
      backgroundColor: "#ff637c",
      alignSelf: "center",
      padding: 10,
      margin: 10,
      ...props.buttonStyle, // Cho phép truyền thêm style nếu cần
    }}
  >
    <Text style={{ color: "#fff" }}>{props.text}</Text>
  </TouchableOpacity>
);

const App = () => {
  return (
    <View style={styles.container}>
      <Button text="Say hello" onPress={() => alert("Hello!")} />
      <Button
        text="Say goodbye"
        onPress={() => alert("Goodbye!")}
        buttonStyle={{ backgroundColor: "#4dc2c2" }}
      />
    </View>
  );
};

// Các style cho ứng dụng
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Canh giữa các phần tử
  },
});

export default App;

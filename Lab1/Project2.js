import React from "react";
import { View, Button, TouchableOpacity, Text, StyleSheet } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <Button title="Button 1" onPress={() => alert("Hello 1!")} />
      <TouchableOpacity
        onPress={() => alert("Hello 2!")}
        style={styles.button}
      >
        <Text style={styles.text}>Button 2</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});

export default App;

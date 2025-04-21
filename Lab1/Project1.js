import React from "react";
import { View, Text, StyleSheet } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Hello World</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // căn giữa theo chiều dọc
    alignItems: 'flex-start',     // căn giữa theo chiều ngang
    backgroundColor: '#CCCCCC',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'aqua',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#black',
  },
});

export default App;

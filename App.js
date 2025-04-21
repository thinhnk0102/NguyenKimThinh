import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import tất cả các project components (đảm bảo import đúng đường dẫn)
import Project1 from '../ThucHanh/Lab1/Project1';
import Project2 from '../ThucHanh/Lab1/Project2';
import Project3 from '../ThucHanh/Lab1/Project3';
import Project4 from '../ThucHanh/Lab1/Project4';
import Project5 from '../ThucHanh/Lab1/Project5';
import Project6 from '../ThucHanh/Lab1/Project6';
import Project7 from '../ThucHanh/Lab1/Project7';
import Project8 from '../ThucHanh/Lab1/Project8';

const Stack = createNativeStackNavigator();

// Danh sách project với tên, component và màu sắc tương ứng
const projects = [
  { id: 1, name: 'Project1', component: 'Project1', color: '#FF5733' },
  { id: 2, name: 'Project2', component: 'Project2', color: '#33FF57' },
  { id: 3, name: 'Project3', component: 'Project3', color: '#3357FF' },
  { id: 4, name: 'Project4', component: 'Project4', color: '#FF33A1' },
  { id: 5, name: 'Project5', component: 'Project5', color: '#A133FF' },
  { id: 6, name: 'Project6', component: 'Project6', color: '#FF8C33' },
  { id: 7, name: 'Project7', component: 'Project7', color: '#33FFF4' },
  { id: 8, name: 'Project8', component: 'Project8', color: '#F433FF' },
];

// Màn hình chính
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách Project</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.projectBox, { backgroundColor: item.color }]} // Áp dụng màu cho từng dự án
            onPress={() => {
              // Điều hướng đến màn hình của project tương ứng
              navigation.navigate(item.component);
            }}
          >
            <Text style={styles.projectText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang Chủ' }} />
        <Stack.Screen name="Project1" component={Project1} options={{ title: 'Hello, Word!' }} />
        <Stack.Screen name="Project2" component={Project2} options={{ title: 'Capturing Taps' }} />
        <Stack.Screen name="Project3" component={Project3} options={{ title: 'Project 3' }} />
        <Stack.Screen name="Project4" component={Project4} options={{ title: 'State & Props' }} />
        <Stack.Screen name="Project5" component={Project5} options={{ title: 'Styling' }} />
        <Stack.Screen name="Project6" component={Project6} options={{ title: 'Scrollable Content' }} />
        <Stack.Screen name="Project7" component={Project7} options={{ title: 'Building a Form' }} />
        <Stack.Screen name="Project8" component={Project8} options={{ title: 'Long List' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  grid: {
    alignItems: 'center',
  },
  projectBox: {
    width: 300,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  projectText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

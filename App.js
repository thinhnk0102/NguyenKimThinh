import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import AuthRouter from './Lab3/routes/AuthRouter';
import CustomerRouter from './Lab3/routes/CustomerRouter';
import AdminRouter from './Lab3/routes/AdminRouter';

// Import tất cả các project components
import Project1 from '../ThucHanh/Lab1/Project1';
import Project2 from '../ThucHanh/Lab1/Project2';
import Project3 from '../ThucHanh/Lab1/Project3';
import Project4 from '../ThucHanh/Lab1/Project4';
import Project5 from '../ThucHanh/Lab1/Project5';
import Project6 from '../ThucHanh/Lab1/Project6';
import Project7 from '../ThucHanh/Lab1/Project7';
import Project8 from '../ThucHanh/Lab1/Project8';
import ContactsNavigator from "./Lab2/routes";
import LoginScreen from "./Lab3/LoginScreen";
import RegisterScreen from "./Lab3/RegisterScreen";
import HomeLab3 from "./Lab3/HomeLab3";
import AddService from "./Lab3/AddService";
import ServiceDetail from "./Lab3/ServiceDetail";
import EditService from "./Lab3/EditService";
import ProfileScreen from "./Lab3/ProfileScreen";
import Calculator from "./Lab1/Caculator";
import TodoApp from "./Lab5/TodoApp";
import ResetPassword from "./Lab3/ResetPassword";
import RegisteredServices from './Lab3/RegisteredServices';
import RegistrationDetail from './Lab3/RegistrationDetail';
import AdminRegistrations from './Lab3/AdminRegistrations';

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
            style={[styles.projectBox, { backgroundColor: item.color }]}
            onPress={() => {
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
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Kiểm tra role của user
        const userRef = ref(db, `users/${currentUser.uid}`);
        const unsubscribeRole = onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUserRole(userData.role);
          } else {
            setUserRole(null);
          }
          setLoading(false);
        });
        return () => unsubscribeRole();
      } else {
        setUser(null);
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerTitleAlign: 'center' }}>
        {!user ? (
          // Auth Stack
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
          </>
        ) : userRole === 'admin' ? (
          // Admin Stack
          <>
            <Stack.Screen name="HomeLab3" component={HomeLab3} options={{ headerShown: false }} />
            <Stack.Screen name="AddService" component={AddService} options={{ title: "Service",headerShown: false }} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetail} options={{ title: "Service detail" }} />
            <Stack.Screen name="EditService" component={EditService} options={{ title: "Service", headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AdminRegistrations" component={AdminRegistrations} options={{ headerShown: false }} />
            <Stack.Screen name="RegistrationDetail" component={RegistrationDetail} options={{ headerShown: false }} />
          </>
        ) : (
          // Customer Stack
          <>
            <Stack.Screen name="HomeLab3" component={HomeLab3} options={{ headerShown: false }} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetail} options={{ title: "Service detail" }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegisteredServices" component={RegisteredServices} options={{ headerShown: false }} />
            <Stack.Screen name="RegistrationDetail" component={RegistrationDetail} options={{ headerShown: false }} />
          </>
        )}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang Chủ' }} />
        <Stack.Screen name="TodoApp" component={TodoApp} options={{ title: 'Todo App' }} />
        <Stack.Screen name="Calculator" component={Calculator} options={{ title: 'Calculator' }} />
        <Stack.Screen name="Home_lab2" component={ContactsNavigator} options={{headerShown: false}} />
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

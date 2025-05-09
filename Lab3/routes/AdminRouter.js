import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeLab3 from '../HomeLab3';
import AddService from '../AddService';
import ServiceDetail from '../ServiceDetail';
import EditService from '../EditService';
import ProfileScreen from '../ProfileScreen';

const Stack = createNativeStackNavigator();

const AdminRouter = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeLab3" component={HomeLab3} />
      <Stack.Screen name="AddService" component={AddService} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
      <Stack.Screen name="EditService" component={EditService} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default AdminRouter; 
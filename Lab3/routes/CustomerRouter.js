import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeLab3 from '../HomeLab3';
import ServiceDetail from '../ServiceDetail';
import ProfileScreen from '../ProfileScreen';

const Stack = createNativeStackNavigator();

const CustomerRouter = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeLab3" component={HomeLab3} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default CustomerRouter; 
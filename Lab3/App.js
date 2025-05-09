import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import AuthRouter from './routes/AuthRouter';
import CustomerRouter from './routes/CustomerRouter';
import AdminRouter from './routes/AdminRouter';

const Stack = createNativeStackNavigator();

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
    return null; // Hoặc hiển thị loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Chưa đăng nhập
          <Stack.Screen name="Auth" component={AuthRouter} />
        ) : userRole === 'admin' ? (
          // Đã đăng nhập và là admin
          <Stack.Screen name="Admin" component={AdminRouter} />
        ) : (
          // Đã đăng nhập và là customer
          <Stack.Screen name="Customer" component={CustomerRouter} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 
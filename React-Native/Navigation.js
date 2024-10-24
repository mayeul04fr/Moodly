import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen/Home';
import SatisfactionScreen from './screens/SatisfactionScreen/Satisfaction';
import StressScreen from './screens/StressScreen/Stress';
import EngagementScreen from './screens/EngagementScreen/Engagement';
import EfficacityScreen from './screens/EfficacityScreen/Efficacity';
import LoginScreen from './screens/LoginScreen/Login';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Satisfaction"
        component={SatisfactionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Stress"
        component={StressScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Engagement"
        component={EngagementScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Efficacity"
        component={EfficacityScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!userToken);
      } catch (e) {
        console.error('Erreur lors de la récupération du token', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainTabNavigator />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Satisfaction"
            component={SatisfactionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Stress"
            component={StressScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Engagement"
            component={EngagementScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Efficacity"
            component={EfficacityScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

import { t } from '../utils/i18n';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import PeerZoneScreen from '../screens/PeerZoneScreen';
import MoralInjuryScreen from '../screens/MoralInjuryScreen';
import ReflexAIScreen from '../screens/ReflexAIScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import BuddyChatScreen from '../screens/BuddyChatScreen';

// Theme colors
import { colors } from '../utils/theme';

// Define types for navigators
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Notifications: undefined;
  BuddyChat: { buddyId?: string } | undefined;
};

type MainTabParamList = {
  Home: undefined;
  Chat: undefined;
  PeerZone: undefined;
  MoralInjury: undefined;
  Profile: undefined;
};

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main Tab Navigator
const MainTabNavigator = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: isDark ? colors.grayLight : colors.grayDark,
        tabBarStyle: {
          backgroundColor: isDark ? colors.darkBackground : colors.lightBackground,
          borderTopColor: isDark ? colors.darkBorder : colors.lightBorder,
        },
        headerStyle: {
          backgroundColor: isDark ? colors.darkBackground : colors.lightBackground,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: isDark ? colors.lightText : colors.darkText,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('home.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          title: t('common.appName'),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: t('chat.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-ellipses" size={size} color={color} />
          ),
          title: t('chat.title'),
        }}
      />
      <Tab.Screen
        name="PeerZone"
        component={PeerZoneScreen}
        options={{
          tabBarLabel: t('peerZone.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
          title: t('peerZone.title'),
        }}
      />
      <Tab.Screen
        name="MoralInjury"
        component={MoralInjuryScreen}
        options={{
          tabBarLabel: t('moralInjury.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
          title: t('moralInjury.title'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('profile.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          title: t('profile.title'),
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  // Determine if user needs onboarding (would normally use AsyncStorage to check)
  const needsOnboarding = true;

  return (
    <Stack.Navigator
      initialRouteName={needsOnboarding ? 'Onboarding' : 'Main'}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen
        name="BuddyChat"
        component={BuddyChatScreen}
        options={{
          headerShown: true,
          title: '',
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: true,
          title: t('notifications.center'),
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { I18nManager, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';

import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/services/store';
import { setupI18n } from './src/utils/i18n';

// Force RTL support for Hebrew
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Ignore specific warnings
LogBox.ignoreLogs([
  'ReactNativeFiberHostComponent: Calling getNode() on the ref of an Animated component',
]);

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Rubik-Regular': require('./src/assets/fonts/Rubik-Regular.ttf'),
        'Rubik-Medium': require('./src/assets/fonts/Rubik-Medium.ttf'),
        'Rubik-Bold': require('./src/assets/fonts/Rubik-Bold.ttf'),
        'Rubik-DemiBold': require('./src/assets/fonts/Rubik-SemiBold.ttf'),
      });
    }

    loadFonts();
    setupI18n();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
} 
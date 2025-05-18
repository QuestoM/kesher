import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';

import Button from '../components/Button';
import { colors, typography, spacing } from '../utils/theme';
import { t } from '../utils/i18n';
import { setOnboarded } from '../services/slices/userSlice';
import { setHealthPermission } from '../services/slices/healthSlice';
import {
  setPermissionGranted,
  setPushToken,
} from '../services/slices/notificationsSlice';

const OnboardingScreen = () => {
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const steps = [
    {
      title: t('onboarding.welcome'),
      description: t('onboarding.welcomeSubtitle'),
    },
    {
      title: t('onboarding.healthPermission'),
      description: t('onboarding.healthPermissionDesc'),
    },
    {
      title: t('onboarding.buddySelection'),
      description: t('onboarding.buddySelectionDesc'),
    },
    {
      title: t('onboarding.notificationPermission'),
      description: t('onboarding.notificationPermissionDesc'),
    },
  ];

  const handleNext = async () => {
    if (step === 1) {
      // Grant health permission in a real app this would request permissions
      dispatch(setHealthPermission(true));
    }

    if (step === steps.length - 1) {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          dispatch(setPermissionGranted(true));
          const tokenData = await Notifications.getExpoPushTokenAsync();
          dispatch(setPushToken(tokenData.data));
        }
      } catch (error) {
        console.log('Notification permission error', error);
      }
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      dispatch(setOnboarded(true));
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  };

  const currentStep = steps[step];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Step indicators */}
        <View style={styles.stepsContainer}>
          {steps.map((_, index) => (
            <View
              key={`step-${index}`}
              style={[
                styles.stepIndicator,
                step === index && styles.activeStepIndicator,
              ]}
            />
          ))}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentStep.title}</Text>
          <Text style={styles.description}>{currentStep.description}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={step === steps.length - 1 ? t('common.finish') : t('common.next')}
            onPress={handleNext}
            fullWidth
          />
          
          {step > 0 && (
            <Button
              title={t('common.back')}
              onPress={() => setStep(step - 1)}
              variant="outline"
              style={styles.backButton}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBackground,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  stepIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.grayLight,
    marginHorizontal: spacing.xs,
  },
  activeStepIndicator: {
    backgroundColor: colors.accent,
    width: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxl,
    color: colors.darkText,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.grayText,
    textAlign: 'center',
    lineHeight: typography.lineHeight.md,
  },
  buttonContainer: {
    marginTop: spacing.xxl,
  },
  backButton: {
    marginTop: spacing.md,
  },
});

export default OnboardingScreen; 
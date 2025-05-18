import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  useColorScheme 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { colors, typography, spacing, borders, shadows } from '../utils/theme';
import { t } from '../utils/i18n';
import { RootState } from '../services/store';
import { MoodType, addCheckIn } from '../services/slices/healthSlice';
import Button from '../components/Button';

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Get data from Redux store
  const { currentStreak, lastCheckInDate, sleepData } = useSelector(
    (state: RootState) => state.health
  );
  
  const { hasUnreadNotifications } = useSelector(
    (state: RootState) => state.notifications
  );

  // Check if user has already checked in today
  const today = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = lastCheckInDate === today;

  // Get the latest sleep data
  const latestSleepData = sleepData.length > 0 
    ? sleepData[sleepData.length - 1] 
    : null;

  // Handle mood selection
  const handleMoodSelection = (mood: MoodType) => {
    dispatch(
      addCheckIn({
        date: today,
        mood,
      })
    );
  };

  // Mood options
  const moodOptions: { mood: MoodType; icon: string; label: string }[] = [
    { mood: 'great', icon: '😄', label: t('home.checkInOptions.great') },
    { mood: 'good', icon: '🙂', label: t('home.checkInOptions.good') },
    { mood: 'okay', icon: '😐', label: t('home.checkInOptions.okay') },
    { mood: 'notGood', icon: '😕', label: t('home.checkInOptions.notGood') },
    { mood: 'bad', icon: '😞', label: t('home.checkInOptions.bad') },
  ];

  return (
    <ScrollView 
      style={[
        styles.container,
        {backgroundColor: isDark ? colors.darkBackground : colors.lightBackground}
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header with notifications */}
      <View style={styles.header}>
        <Text 
          style={[
            styles.greeting, 
            {color: isDark ? colors.lightText : colors.darkText}
          ]}
        >
          {t('common.appName')}
        </Text>
        
        <TouchableOpacity 
          style={styles.notificationIcon}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons 
            name="notifications" 
            size={24} 
            color={hasUnreadNotifications ? colors.accent : (isDark ? colors.grayLight : colors.grayDark)} 
          />
          {hasUnreadNotifications && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      {/* Streak banner */}
      {currentStreak > 0 && (
        <View 
          style={[
            styles.streakBanner,
            {backgroundColor: isDark ? colors.primaryDark : colors.primaryLight}
          ]}
        >
          <Ionicons name="flame" size={24} color={colors.badge1} />
          <Text style={styles.streakText}>
            {t('home.streak', { count: currentStreak })}
          </Text>
        </View>
      )}

      {/* Check-in section */}
      <View 
        style={[
          styles.card,
          {backgroundColor: isDark ? colors.darkBackground : colors.lightBackground}
        ]}
      >
        <Text 
          style={[
            styles.cardTitle,
            {color: isDark ? colors.lightText : colors.darkText}
          ]}
        >
          {t('home.checkIn')}
        </Text>

        {hasCheckedInToday ? (
          <View style={styles.checkedInContainer}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <Text 
              style={[
                styles.checkedInText,
                {color: isDark ? colors.lightText : colors.darkText}
              ]}
            >
              תודה על הצ'ק-אין היומי!
            </Text>
          </View>
        ) : (
          <View style={styles.moodContainer}>
            {moodOptions.map(({ mood, icon, label }) => (
              <TouchableOpacity
                key={mood}
                style={styles.moodOption}
                onPress={() => handleMoodSelection(mood)}
              >
                <Text style={styles.moodIcon}>{icon}</Text>
                <Text 
                  style={[
                    styles.moodLabel,
                    {color: isDark ? colors.lightText : colors.darkText}
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Sleep card */}
      <View 
        style={[
          styles.card,
          {backgroundColor: isDark ? colors.darkBackground : colors.lightBackground}
        ]}
      >
        <View style={styles.cardHeader}>
          <Text 
            style={[
              styles.cardTitle,
              {color: isDark ? colors.lightText : colors.darkText}
            ]}
          >
            {t('home.sleepCard')}
          </Text>
          
          <Ionicons 
            name="moon" 
            size={20} 
            color={isDark ? colors.lightText : colors.primary} 
          />
        </View>

        {latestSleepData ? (
          <View>
            <Text 
              style={[
                styles.sleepHours,
                {color: isDark ? colors.lightText : colors.darkText}
              ]}
            >
              {t('home.sleepCardHours', { hours: latestSleepData.hoursSlept })}
            </Text>
            
            {latestSleepData.quality && (
              <Text 
                style={[
                  styles.sleepQuality,
                  {color: isDark ? colors.grayLight : colors.grayText}
                ]}
              >
                {t('home.sleepCardQuality', { quality: t(`sleep.quality.${latestSleepData.quality}`) })}
              </Text>
            )}
          </View>
        ) : (
          <View>
            <Text 
              style={[
                styles.noSleepData,
                {color: isDark ? colors.grayLight : colors.grayText}
              ]}
            >
              אין עדיין נתוני שינה
            </Text>
            
            <Button
              title="אפשר גישה לנתוני בריאות"
              onPress={() => {/* Would request health permissions */}}
              variant="secondary"
              size="small"
              style={styles.healthPermissionButton}
            />
          </View>
        )}
      </View>

      {/* SOS Button */}
      <Button
        title="SOS"
        onPress={() => navigation.navigate('Chat')}
        variant="danger"
        size="large"
        style={styles.sosButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borders.radius.md,
    marginBottom: spacing.md,
  },
  streakText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    color: colors.lightText,
    marginLeft: spacing.xs,
  },
  card: {
    borderRadius: borders.radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.lg,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  moodOption: {
    alignItems: 'center',
  },
  moodIcon: {
    fontSize: 30,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
  },
  checkedInContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  checkedInText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    marginTop: spacing.sm,
  },
  sleepHours: {
    fontFamily: typography.fontFamily.demiBold,
    fontSize: typography.fontSize.xxl,
    marginTop: spacing.xs,
  },
  sleepQuality: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    marginTop: spacing.xs,
  },
  noSleepData: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    marginTop: spacing.xs,
  },
  healthPermissionButton: {
    marginTop: spacing.md,
  },
  sosButton: {
    marginTop: spacing.md,
  },
});

export default HomeScreen; 
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, typography, spacing, borders, shadows } from '../utils/theme';
import { t } from '../utils/i18n';
import { RootState } from '../services/store';
import { setDarkMode, setLanguage } from '../services/slices/userSlice';
import Button from '../components/Button';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  
  // Get user state from Redux
  const { name, phoneNumber, unit, prefersDarkMode, language } = useSelector(
    (state: RootState) => state.user
  );

  const { level, xpPoints, earnedBadges } = useSelector(
    (state: RootState) => state.badges
  );

  // Determine theme
  const isDark = useSystemTheme 
    ? colorScheme === 'dark' 
    : prefersDarkMode ?? false;

  // Handle theme toggle
  const handleThemeToggle = (value: boolean) => {
    if (useSystemTheme) {
      setUseSystemTheme(false);
      dispatch(setDarkMode(value));
    } else {
      dispatch(setDarkMode(value));
    }
  };

  // Handle system theme toggle
  const handleSystemThemeToggle = (value: boolean) => {
    setUseSystemTheme(value);
    if (value) {
      dispatch(setDarkMode(null)); // Use system default
    }
  };

  // Handle language change
  const handleLanguageChange = (lang: 'he' | 'en') => {
    dispatch(setLanguage(lang));
  };

  // Mock data for demo
  const userData = {
    name: 'יוסי ישראלי',
    phoneNumber: '052-1234567',
    unit: 'גולני',
    email: 'yossi@example.com',
  };

  // Settings groups
  const settingsGroups = [
    {
      title: t('profile.personalDetails'),
      settings: [
        {
          icon: 'person',
          label: t('profile.name'),
          value: userData.name,
          type: 'text',
        },
        {
          icon: 'call',
          label: t('profile.phoneNumber'),
          value: userData.phoneNumber,
          type: 'text',
        },
        {
          icon: 'shield',
          label: t('profile.unit'),
          value: userData.unit,
          type: 'text',
        },
      ],
    },
    {
      title: t('profile.settings'),
      settings: [
        {
          icon: 'moon',
          label: t('profile.darkMode'),
          type: 'switch',
          value: isDark,
          onChange: handleThemeToggle,
        },
        {
          icon: 'phone-portrait',
          label: 'השתמש בהגדרות המכשיר',
          type: 'switch',
          value: useSystemTheme,
          onChange: handleSystemThemeToggle,
        },
        {
          icon: 'language',
          label: t('profile.language'),
          type: 'language',
          value: language,
          onChange: handleLanguageChange,
        },
      ],
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.darkBackground : colors.lightBackground },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile header */}
        <View style={styles.header}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
          </View>
          
          <Text
            style={[
              styles.name,
              { color: isDark ? colors.lightText : colors.darkText },
            ]}
          >
            {userData.name}
          </Text>
          
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>
              רמה {level} · {xpPoints} XP
            </Text>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgesSection}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? colors.lightText : colors.darkText },
            ]}
          >
            הישגים
          </Text>
          
          <View style={styles.badgesContainer}>
            {/* Placeholder badges - would be real in a full app */}
            {[1, 2, 3].map((badge) => (
              <View
                key={badge}
                style={[
                  styles.badge,
                  { backgroundColor: colors[`badge${badge}`] },
                ]}
              >
                <Ionicons
                  name={
                    badge === 1
                      ? 'moon'
                      : badge === 2
                      ? 'checkmark-circle'
                      : 'people'
                  }
                  size={24}
                  color={colors.lightText}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        {settingsGroups.map((group, index) => (
          <View key={index} style={styles.settingsGroup}>
            <Text
              style={[
                styles.groupTitle,
                { color: isDark ? colors.lightText : colors.darkText },
              ]}
            >
              {group.title}
            </Text>
            
            <View
              style={[
                styles.settingsContainer,
                {
                  backgroundColor: isDark ? '#1E1E1E' : colors.lightBackground,
                  borderColor: isDark ? colors.darkBorder : colors.lightBorder,
                },
              ]}
            >
              {group.settings.map((setting, settingIndex) => (
                <View
                  key={settingIndex}
                  style={[
                    styles.setting,
                    settingIndex < group.settings.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: isDark ? colors.darkBorder : colors.lightBorder,
                    },
                  ]}
                >
                  <View style={styles.settingInfo}>
                    <Ionicons
                      name={setting.icon as any}
                      size={20}
                      color={isDark ? colors.grayLight : colors.primary}
                      style={styles.settingIcon}
                    />
                    
                    <Text
                      style={[
                        styles.settingLabel,
                        { color: isDark ? colors.lightText : colors.darkText },
                      ]}
                    >
                      {setting.label}
                    </Text>
                  </View>
                  
                  {setting.type === 'text' && (
                    <Text
                      style={[
                        styles.settingValue,
                        { color: isDark ? colors.grayLight : colors.grayText },
                      ]}
                    >
                      {setting.value}
                    </Text>
                  )}
                  
                  {setting.type === 'switch' && (
                    <Switch
                      value={setting.value as boolean}
                      onValueChange={setting.onChange}
                      trackColor={{ false: colors.grayLight, true: colors.accent }}
                      thumbColor={setting.value ? colors.accentLight : colors.lightBackground}
                    />
                  )}
                  
                  {setting.type === 'language' && (
                    <View style={styles.languageSelector}>
                      <TouchableOpacity
                        style={[
                          styles.languageOption,
                          setting.value === 'he' && styles.selectedLanguage,
                        ]}
                        onPress={() => setting.onChange('he')}
                      >
                        <Text
                          style={[
                            styles.languageText,
                            setting.value === 'he' && styles.selectedLanguageText,
                          ]}
                        >
                          עברית
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.languageOption,
                          setting.value === 'en' && styles.selectedLanguage,
                        ]}
                        onPress={() => setting.onChange('en')}
                      >
                        <Text
                          style={[
                            styles.languageText,
                            setting.value === 'en' && styles.selectedLanguageText,
                          ]}
                        >
                          English
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout and Delete buttons */}
        <View style={styles.buttonsContainer}>
          <Button
            title={t('profile.logout')}
            onPress={() => {/* Would handle logout */}}
            variant="outline"
            fullWidth
            style={styles.logoutButton}
          />
          
          <Button
            title={t('profile.deleteAccount')}
            onPress={() => {/* Would handle account deletion */}}
            variant="danger"
            fullWidth
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxxl,
    color: colors.lightText,
  },
  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    marginBottom: spacing.xs,
  },
  levelContainer: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borders.radius.round,
  },
  levelText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.lightText,
  },
  badgesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.sm,
  },
  badgesContainer: {
    flexDirection: 'row',
  },
  badge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  settingsGroup: {
    marginBottom: spacing.lg,
  },
  groupTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.sm,
  },
  settingsContainer: {
    borderRadius: borders.radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: spacing.sm,
  },
  settingLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
  },
  settingValue: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
  },
  languageSelector: {
    flexDirection: 'row',
  },
  languageOption: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borders.radius.md,
    marginLeft: spacing.xs,
  },
  selectedLanguage: {
    backgroundColor: colors.accent,
  },
  languageText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.grayText,
  },
  selectedLanguageText: {
    color: colors.lightText,
  },
  buttonsContainer: {
    marginTop: spacing.md,
  },
  logoutButton: {
    marginBottom: spacing.md,
  },
  deleteButton: {
    marginBottom: spacing.xxl,
  },
});

export default ProfileScreen; 
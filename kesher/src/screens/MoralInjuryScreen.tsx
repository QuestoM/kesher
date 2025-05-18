import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, typography, spacing, borders, shadows } from '../utils/theme';
import { t } from '../utils/i18n';
import Button from '../components/Button';

// Story categories
const STORY_CATEGORIES = [
  'חברים', 'משפחה', 'פעילות מבצעית', 'החלטות מפקדים', 'מוסר', 'אזרחים'
];

const MoralInjuryScreen = () => {
  const [storyText, setStoryText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Submit story
  const handleSubmitStory = () => {
    // In a real app, this would send the story to the backend
    console.log('Submitting story:', {
      text: storyText,
      isAnonymous,
      categories: selectedCategories,
    });
    
    // Reset form
    setStoryText('');
    setSelectedCategories([]);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.darkBackground : colors.lightBackground },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Page header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: isDark ? colors.lightText : colors.darkText },
            ]}
          >
            {t('moralInjury.title')}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? colors.grayLight : colors.grayText },
            ]}
          >
            כאן אתה יכול לשתף חוויות ואירועים שמעסיקים אותך, בפרטיות מלאה
          </Text>
        </View>

        {/* Anonymous switch */}
        <View style={styles.anonymousContainer}>
          <Text
            style={[
              styles.anonymousText,
              { color: isDark ? colors.lightText : colors.darkText },
            ]}
          >
            {t('moralInjury.anonymousMode')}
          </Text>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: colors.grayLight, true: colors.accent }}
            thumbColor={isAnonymous ? colors.accentLight : colors.lightBackground}
          />
        </View>

        {/* Story text input */}
        <View
          style={[
            styles.textInputContainer,
            {
              backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
              borderColor: isDark ? colors.darkBorder : colors.lightBorder,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { color: isDark ? colors.lightText : colors.darkText },
            ]}
            placeholder={t('moralInjury.storyPlaceholder')}
            placeholderTextColor={isDark ? colors.grayLight : colors.grayDark}
            multiline
            textAlignVertical="top"
            value={storyText}
            onChangeText={setStoryText}
          />
        </View>

        {/* Categories */}
        <Text
          style={[
            styles.categoriesTitle,
            { color: isDark ? colors.lightText : colors.darkText },
          ]}
        >
          קטגוריות:
        </Text>
        
        <View style={styles.categoriesContainer}>
          {STORY_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategories.includes(category) && {
                  backgroundColor: colors.accent,
                },
                {
                  borderColor: isDark ? colors.darkBorder : colors.lightBorder,
                },
              ]}
              onPress={() => toggleCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategories.includes(category)
                      ? colors.lightText
                      : isDark
                      ? colors.lightText
                      : colors.darkText,
                  },
                ]}
              >
                {category}
              </Text>
              {selectedCategories.includes(category) && (
                <Ionicons name="checkmark" size={14} color={colors.lightText} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit button */}
        <Button
          title="שתף את הסיפור"
          onPress={handleSubmitStory}
          variant="primary"
          fullWidth
          disabled={!storyText.trim()}
          style={styles.submitButton}
        />

        {/* Group rooms section */}
        <View style={styles.groupSection}>
          <Text
            style={[
              styles.groupSectionTitle,
              { color: isDark ? colors.lightText : colors.darkText },
            ]}
          >
            {t('moralInjury.groupRoom')}
          </Text>
          
          <Text
            style={[
              styles.groupSectionDescription,
              { color: isDark ? colors.grayLight : colors.grayText },
            ]}
          >
            הצטרף לחדרים לשיחה קבוצתית אנונימית במרחב בטוח ותומך
          </Text>

          {/* Group rooms */}
          <View style={styles.groupRooms}>
            {[
              { name: 'מוסר הלחימה', count: 8 },
              { name: 'משימה ופקודה', count: 5 },
              { name: 'חיילים ואזרחים', count: 12 },
            ].map((room) => (
              <TouchableOpacity
                key={room.name}
                style={[
                  styles.roomCard,
                  {
                    backgroundColor: isDark ? colors.primaryDark : colors.primaryLight,
                  },
                ]}
              >
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomCount}>{room.count} משתתפים</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxl,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
  },
  anonymousContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  anonymousText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: borders.radius.md,
    minHeight: 150,
    marginBottom: spacing.md,
  },
  textInput: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    padding: spacing.md,
    minHeight: 150,
    textAlign: 'right',
  },
  categoriesTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.sm,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borders.radius.lg,
    borderWidth: 1,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    marginRight: spacing.xs,
  },
  submitButton: {
    marginBottom: spacing.xl,
  },
  groupSection: {
    marginTop: spacing.md,
  },
  groupSectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.xs,
  },
  groupSectionDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.md,
  },
  groupRooms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roomCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borders.radius.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  roomName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    color: colors.lightText,
    marginBottom: spacing.xs,
  },
  roomCount: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default MoralInjuryScreen; 
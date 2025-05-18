import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors, typography, spacing, borders, shadows } from '../utils/theme';
import { t } from '../utils/i18n';
import { RootState } from '../services/store';
import {
  Notification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
} from '../services/slices/notificationsSlice';
import Button from '../components/Button';

const NotificationsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Get notifications from Redux store
  const { notifications } = useSelector(
    (state: RootState) => state.notifications
  );

  // Mark notification as read
  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  // Remove notification
  const handleRemoveNotification = (id: string) => {
    dispatch(removeNotification(id));
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  // Clear all notifications
  const handleClearAllNotifications = () => {
    dispatch(clearAllNotifications());
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'checkIn':
        return 'checkmark-circle';
      case 'buddySupport':
        return 'people';
      case 'sleepAlert':
        return 'moon';
      case 'achievement':
        return 'trophy';
      default:
        return 'notifications';
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} דקות`;
    if (diffHours < 24) return `${diffHours} שעות`;
    if (diffDays < 7) return `${diffDays} ימים`;

    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Dummy notifications for demo
  const dummyNotifications: Notification[] = [
    {
      id: '1',
      type: 'checkIn',
      title: 'תזכורת צ\'ק-אין',
      message: 'קפצת לנו לראש, איך אתה מרגיש היום?',
      timestamp: Date.now() - 3600000 * 2, // 2 hours ago
      read: false,
    },
    {
      id: '2',
      type: 'buddySupport',
      title: 'יואב כהן רוצה לדבר',
      message: 'החבר שלך שלח לך בקשת שיחה',
      timestamp: Date.now() - 3600000 * 5, // 5 hours ago
      read: true,
    },
    {
      id: '3',
      type: 'sleepAlert',
      title: 'דפוס שינה',
      message: 'שמנו לב שאתה ישן פחות בימים האחרונים',
      timestamp: Date.now() - 3600000 * 24, // 1 day ago
      read: false,
    },
    {
      id: '4',
      type: 'achievement',
      title: 'הישג חדש!',
      message: 'קיבלת את התג "שבוע שינה טובה" 😴',
      timestamp: Date.now() - 3600000 * 72, // 3 days ago
      read: true,
    },
  ];

  // Use our dummy data instead of Redux store for demo
  const notificationsToShow = dummyNotifications;

  // Render notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: isDark ? colors.darkBackground : colors.lightBackground,
          opacity: item.read ? 0.7 : 1,
        },
      ]}
      onPress={() => {
        handleMarkAsRead(item.id);
        // Would navigate to relevant screen based on notification type
      }}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: item.read
              ? colors.grayLight
              : item.type === 'checkIn'
              ? colors.primary
              : item.type === 'buddySupport'
              ? colors.accent
              : item.type === 'sleepAlert'
              ? colors.warning
              : colors.badge1,
          },
        ]}
      >
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={20}
          color={colors.lightText}
        />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text
            style={[
              styles.notificationTitle,
              { color: isDark ? colors.lightText : colors.darkText },
            ]}
          >
            {item.title}
          </Text>
          <Text style={styles.notificationTime}>{formatTime(item.timestamp)}</Text>
        </View>

        <Text
          style={[
            styles.notificationMessage,
            { color: isDark ? colors.grayLight : colors.grayText },
          ]}
        >
          {item.message}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveNotification(item.id)}
      >
        <Ionicons
          name="close-circle"
          size={20}
          color={isDark ? colors.grayLight : colors.grayDark}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.darkBackground : colors.lightBackground },
      ]}
    >
      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <Button
          title="סמן הכל כנקרא"
          onPress={handleMarkAllAsRead}
          variant="outline"
          size="small"
          style={styles.actionButton}
        />
        <Button
          title="נקה הכל"
          onPress={handleClearAllNotifications}
          variant="outline"
          size="small"
          style={styles.actionButton}
        />
      </View>

      {/* Notifications list */}
      {notificationsToShow.length > 0 ? (
        <FlatList
          data={notificationsToShow}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off"
            size={64}
            color={isDark ? colors.grayLight : colors.grayDark}
          />
          <Text
            style={[
              styles.emptyText,
              { color: isDark ? colors.grayLight : colors.grayText },
            ]}
          >
            אין התראות כרגע
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  notificationsList: {
    padding: spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borders.radius.md,
    marginBottom: spacing.md,
    ...shadows.light,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  notificationTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
  },
  notificationTime: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.grayText,
  },
  notificationMessage: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    marginTop: spacing.md,
  },
});

export default NotificationsScreen; 
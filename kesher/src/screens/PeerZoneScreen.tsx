import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  useColorScheme,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors, typography, spacing, borders, shadows } from '../utils/theme';
import { t } from '../utils/i18n';
import Button from '../components/Button';
import { RootState } from '../services/store';
import {
  Buddy,
  BuddyStatus,
  setSelectedBuddy,
  addAlert,
  respondToAlert,
} from '../services/slices/buddySlice';
import { addNotification } from '../services/slices/notificationsSlice';


const PeerZoneScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Buddies from Redux state
  const buddies = useSelector((state: RootState) => state.buddy.buddies);
  
  // State for alert modal
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [selectedBuddyForAlert, setSelectedBuddyForAlert] = useState<Buddy | null>(null);

  // Get current user status from Redux store
  // For now we'll use local state
  const [currentStatus, setCurrentStatus] = useState<BuddyStatus>('online');

  // Status options
  const statusOptions: { value: BuddyStatus; label: string; icon: string }[] = [
    { value: 'online', label: t('peerZone.buddyStatus.online'), icon: 'checkmark-circle' },
    { value: 'busy', label: t('peerZone.buddyStatus.busy'), icon: 'time' },
    { value: 'offline', label: t('peerZone.buddyStatus.offline'), icon: 'moon' },
  ];

  // Get status color
  const getStatusColor = (status: BuddyStatus) => {
    switch (status) {
      case 'online':
        return colors.success;
      case 'busy':
        return colors.warning;
      case 'offline':
        return colors.grayText;
    }
  };

  // Format last active time
  const formatLastActive = (dateString: string) => {
    const now = new Date();
    const lastActive = new Date(dateString);
    const diffMs = now.getTime() - lastActive.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t('time.justNow');
    if (diffMins < 60) return `${diffMins} ${t('time.minutesAgo')}`;
    if (diffHours < 24) return `${diffHours} ${t('time.hoursAgo')}`;
    return `${diffDays} ${t('time.daysAgo')}`;
  };

  // Handle check buddy
  const handleCheckBuddy = (buddy: Buddy) => {
    setSelectedBuddyForAlert(buddy);
    setAlertModalVisible(true);
  };

  // Handle alert response
  const handleAlertResponse = (accept: boolean) => {
    setAlertModalVisible(false);

    if (selectedBuddyForAlert && accept) {
      const alertId = Date.now().toString();

      // Record alert in Redux
      dispatch(
        addAlert({
          id: alertId,
          buddyId: selectedBuddyForAlert.id,
          message: t('peerZone.peerAlert'),
        })
      );

      // Simulate buddy accepting immediately
      dispatch(respondToAlert({ id: alertId, responseType: 'accepted' }));

      // Notify user locally that buddy accepted
      dispatch(
        addNotification({
          id: `${alertId}-notify`,
          type: 'buddySupport',
          title: `${selectedBuddyForAlert.name} רוצה לדבר`,
          message: t('notifications.buddySupport'),
        })
      );

      dispatch(setSelectedBuddy(selectedBuddyForAlert.id));

    }

    // If user chose not to alert or no buddy selected, simply close modal
  };

  // Render buddy item
  const renderBuddyItem = ({ item }: { item: Buddy }) => (
    <View
      style={[
        styles.buddyCard,
        {
          backgroundColor: isDark ? colors.darkBackground : colors.lightBackground,
        },
      ]}
    >
      <View style={styles.buddyInfo}>
        {/* Avatar or placeholder */}
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: item.isPrimary ? colors.accent : colors.primaryLight,
            },
          ]}
        >
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
        </View>

        <View style={styles.buddyDetails}>
          <Text
            style={[
              styles.buddyName,
              { color: isDark ? colors.lightText : colors.darkText },
            ]}
          >
            {item.name}
            {item.isPrimary && (
              <Text style={styles.primaryBadge}> ★</Text>
            )}
          </Text>
          
          <Text
            style={[
              styles.buddyStatus,
              { color: isDark ? colors.grayLight : colors.grayText },
            ]}
          >
            {t(`peerZone.buddyStatus.${item.status}`)} · {formatLastActive(item.lastActive)}
          </Text>
        </View>
      </View>

      <Button
        title={t('peerZone.checkBuddy')}
        onPress={() => handleCheckBuddy(item)}
        variant="outline"
        size="small"
        style={item.status === 'offline' ? styles.disabledButton : undefined}
        disabled={item.status === 'offline'}
      />
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.darkBackground : colors.lightBackground },
      ]}
    >
      {/* Status selector */}
      <View style={styles.statusSelector}>
        <Text
          style={[
            styles.statusTitle,
            { color: isDark ? colors.lightText : colors.darkText },
          ]}
        >
          המצב שלי:
        </Text>
        
        <View style={styles.statusOptions}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusOption,
                currentStatus === option.value && styles.selectedStatus,
                {
                  borderColor:
                    currentStatus === option.value
                      ? getStatusColor(option.value)
                      : isDark
                      ? colors.darkBorder
                      : colors.lightBorder,
                },
              ]}
              onPress={() => setCurrentStatus(option.value)}
            >
              <Ionicons
                name={option.icon as any}
                size={16}
                color={getStatusColor(option.value)}
                style={styles.statusIcon}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      currentStatus === option.value
                        ? getStatusColor(option.value)
                        : isDark
                        ? colors.grayLight
                        : colors.grayText,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Buddy list */}
      <FlatList
        data={buddies}
        renderItem={renderBuddyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.buddyList}
      />

      {/* Add buddy button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: colors.accent },
        ]}
        onPress={() => {
          // Would navigate to add buddy screen
        }}
      >
        <Ionicons name="add" size={24} color={colors.lightText} />
      </TouchableOpacity>

      {/* Alert Modal */}
      <Modal
        visible={alertModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAlertModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? colors.darkBackground : colors.lightBackground,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDark ? colors.lightText : colors.darkText },
                ]}
              >
                {t('peerZone.peerAlert')}
              </Text>
            </View>

            {selectedBuddyForAlert && (
              <View style={styles.alertContent}>
                <View
                  style={[
                    styles.avatarLarge,
                    {
                      backgroundColor: selectedBuddyForAlert.isPrimary
                        ? colors.accent
                        : colors.primaryLight,
                    },
                  ]}
                >
                  <Text style={styles.avatarTextLarge}>
                    {selectedBuddyForAlert.name.charAt(0)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.alertText,
                    { color: isDark ? colors.lightText : colors.darkText },
                  ]}
                >
                  האם לשלוח בדיקת מצב ל{selectedBuddyForAlert.name}?
                </Text>

                <View style={styles.alertButtons}>
                  <Button
                    title={t('peerZone.peerAlertOptions.talk')}
                    onPress={() => handleAlertResponse(true)}
                    variant="primary"
                    style={styles.alertButton}
                  />
                  
                  <Button
                    title={t('peerZone.peerAlertOptions.notNow')}
                    onPress={() => handleAlertResponse(false)}
                    variant="outline"
                    style={styles.alertButton}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusSelector: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBorder,
  },
  statusTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.sm,
  },
  statusOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borders.radius.md,
    borderWidth: 1,
  },
  selectedStatus: {
    borderWidth: 2,
  },
  statusIcon: {
    marginRight: spacing.xs,
  },
  statusText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
  },
  buddyList: {
    padding: spacing.md,
  },
  buddyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borders.radius.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  buddyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.lightText,
  },
  statusIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.lightBackground,
    bottom: 0,
    right: 0,
  },
  buddyDetails: {
    flex: 1,
  },
  buddyName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.xs,
  },
  primaryBadge: {
    color: colors.badge1,
  },
  buddyStatus: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: borders.radius.lg,
    padding: spacing.lg,
    ...shadows.heavy,
  },
  modalHeader: {
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    textAlign: 'center',
  },
  alertContent: {
    alignItems: 'center',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarTextLarge: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    color: colors.lightText,
  },
  alertText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  alertButtons: {
    width: '100%',
  },
  alertButton: {
    marginBottom: spacing.sm,
  },
});

export default PeerZoneScreen; 
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  useColorScheme,
  I18nManager,
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
  addBuddy,
  setSelectedBuddy,
  addAlert,
  // respondToAlert, // (if needed for future alert handling)
  setCurrentStatus,
} from '../services/slices/buddySlice';
import { addNotification } from '../services/slices/notificationsSlice';

const PeerZoneScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Redux state selectors
  const buddies = useSelector((state: RootState) => state.buddy.buddies);
  const currentStatus = useSelector((state: RootState) => state.buddy.currentStatus);

  // Local state for modals & form
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [selectedBuddyForAlert, setSelectedBuddyForAlert] = useState<Buddy | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newBuddyName, setNewBuddyName] = useState('');
  const [newBuddyPhone, setNewBuddyPhone] = useState('');

  // Options for user status toggle
  const statusOptions: { value: BuddyStatus; label: string; icon: string }[] = [
    { value: 'online',   label: t('peerZone.buddyStatus.online'),  icon: 'checkmark-circle' },
    { value: 'busy',     label: t('peerZone.buddyStatus.busy'),    icon: 'time' },
    { value: 'offline',  label: t('peerZone.buddyStatus.offline'), icon: 'moon' },
  ];
  const getStatusColor = (status: BuddyStatus) => {
    switch (status) {
      case 'online':  return colors.success;
      case 'busy':    return colors.warning;
      case 'offline': return colors.grayText;
    }
  };

  // Format relative last-active time (in minutes/hours/days)
  const formatLastActive = (isoDate: string) => {
    const now = new Date();
    const lastActive = new Date(isoDate);
    const diffMs = now.getTime() - lastActive.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return t('time.justNow');
    if (diffMins < 60) return `${diffMins} ${t('time.minutesAgo')}`;
    if (diffHours < 24) return `${diffHours} ${t('time.hoursAgo')}`;
    return `${diffDays} ${t('time.daysAgo')}`;
  };

  // Handle pressing "Check on them": open confirmation modal
  const handleCheckBuddy = (buddy: Buddy) => {
    setSelectedBuddyForAlert(buddy);
    setAlertModalVisible(true);
  };

  // Handle confirmation response for checking on buddy
  const handleAlertResponse = (confirm: boolean) => {
    const buddy = selectedBuddyForAlert;
    setAlertModalVisible(false);
    if (buddy && confirm) {
      // Mark this buddy as selected for chat and log an alert event
      const alertId = Date.now().toString();
      dispatch(addAlert({
        id: alertId,
        buddyId: buddy.id,
        message: t('peerZone.peerAlert'), // "A friend needs you" (alert title)
      }));
      // In a real app, we'd wait for buddy's response; here we assume acceptance:
      // dispatch(respondToAlert({ id: alertId, responseType: 'accepted' }));
      // Optionally create a local notification (not needed if navigating immediately)
      // dispatch(addNotification({ ... }));

      // Select the buddy and navigate to Chat screen with a preset prompt
      dispatch(setSelectedBuddy(buddy.id));
      // Ideally pass a prompt to the chat screen, e.g. via params or global state
      const checkInMessage = t('common.appName') + ': ' + t('peerZone.checkBuddy');
      // Navigate to the Chat tab (AI chat) 
      navigation.navigate('Chat' as never); 
      // (ChatScreen will detect selectedBuddy and can prefill the prompt)
    }
    setSelectedBuddyForAlert(null);
  };

  // Handle adding a new buddy from modal form
  const handleAddBuddySubmit = () => {
    const name = newBuddyName.trim();
    const phone = newBuddyPhone.trim();
    if (!name || !phone) {
      // Ideally show validation feedback
      return;
    }
    const newBuddy: Buddy = {
      id: phone,  // using phone number as unique ID for now
      name: name,
      phoneNumber: phone,
      status: 'offline',
      lastActive: new Date().toISOString(),
      isPrimary: false,
    };
    dispatch(addBuddy(newBuddy));
    // Reset form and close modal
    setNewBuddyName('');
    setNewBuddyPhone('');
    setAddModalVisible(false);
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? colors.darkBackground : colors.lightBackground }
    ]}>
      {/* User Status Selector */}
      <View style={styles.statusSelector}>
        <Text style={[
          styles.statusTitle,
          { color: isDark ? colors.lightText : colors.darkText }
        ]}>
          {t('peerZone.title')} – {/** "Friends" or localized title */}
          {t('peerZone.buddyStatus.' + currentStatus)}
        </Text>
        <View style={styles.statusOptions}>
          {statusOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusOption,
                currentStatus === option.value && styles.selectedStatus,
                {
                  borderColor: currentStatus === option.value
                    ? getStatusColor(option.value)
                    : (isDark ? colors.darkBorder : colors.lightBorder),
                },
              ]}
              onPress={() => dispatch(setCurrentStatus(option.value))}
              accessibilityRole="button"
              accessibilityLabel={option.label}
            >
              <Ionicons
                name={option.icon as any}
                size={16}
                color={getStatusColor(option.value)}
                style={styles.statusIcon}
                // accessibilityElementsHidden={true} // icon is decorative
              />
              <Text style={[
                styles.statusText,
                {
                  color: currentStatus === option.value
                    ? getStatusColor(option.value)
                    : (isDark ? colors.grayLight : colors.grayText),
                },
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Buddies List */}
      <FlatList
        data={buddies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
              styles.buddyCard,
              {
                backgroundColor: isDark ? colors.darkBackground : colors.lightBackground,
                flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              }
            ]}
          >
            {/* Buddy info (Avatar + details) */}
            <View style={[
                styles.buddyInfo,
                { flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }
              ]}
            >
              {/* Avatar circle with initial */}
              <View style={[
                  styles.avatar,
                  {
                    backgroundColor: item.isPrimary ? colors.accent : colors.primaryLight,
                    marginLeft: I18nManager.isRTL ? spacing.md : 0,
                    marginRight: I18nManager.isRTL ? 0 : spacing.md,
                  }
                ]}
              >
                <Text style={styles.avatarText}>
                  {item.name.charAt(0)}
                </Text>
                <View style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor(item.status) }
                  ]}
                />
              </View>
              {/* Name and last active/status text */}
              <View style={styles.buddyDetails}>
                <Text style={[
                    styles.buddyName,
                    { color: isDark ? colors.lightText : colors.darkText }
                  ]}
                >
                  {item.name}
                  {item.isPrimary && (
                    <Text style={styles.primaryBadge}> ★</Text>
                  )}
                </Text>
                <Text style={[
                    styles.buddyStatus,
                    { color: isDark ? colors.grayLight : colors.grayText }
                  ]}
                >
                  {t(`peerZone.buddyStatus.${item.status}`)} · {formatLastActive(item.lastActive)}
                </Text>
              </View>
            </View>
            {/* Action: Check on buddy */}
            <Button
              title={t('peerZone.checkBuddy')}
              onPress={() => handleCheckBuddy(item)}
              variant="outline"
              size="large"  {/* larger touch target for accessibility */}
              disabled={item.status === 'offline'}
              style={item.status === 'offline' ? styles.disabledButton : undefined}
            />
          </View>
        )}
        contentContainerStyle={styles.buddyList}
      />

      {/* Add Buddy Floating Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.accent }]}
        onPress={() => setAddModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={t('onboarding.addBuddy')}
      >
        <Ionicons name="add" size={28} color={colors.lightText} />
      </TouchableOpacity>

      {/* Add Buddy Modal */}
      <Modal
        visible={addModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
              styles.modalContent,
              { backgroundColor: isDark ? colors.darkBackground : colors.lightBackground }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[
                  styles.modalTitle,
                  { color: isDark ? colors.lightText : colors.darkText }
                ]}
              >
                {t('onboarding.addBuddy')}
              </Text>
            </View>
            {/* Form fields for name and phone */}
            <View>
              <Text style={[
                  styles.formLabel,
                  { color: isDark ? colors.lightText : colors.darkText }
                ]}
              >
                {t('profile.name')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: isDark ? colors.darkBorder : colors.lightBorder,
                    color: isDark ? colors.lightText : colors.darkText,
                  }
                ]}
                placeholder={t('profile.name')}
                placeholderTextColor={colors.grayText}
                value={newBuddyName}
                onChangeText={setNewBuddyName}
              />
              <Text style={[
                  styles.formLabel,
                  { color: isDark ? colors.lightText : colors.darkText }
                ]}
              >
                {t('profile.phoneNumber')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: isDark ? colors.darkBorder : colors.lightBorder,
                    color: isDark ? colors.lightText : colors.darkText,
                  }
                ]}
                placeholder={t('profile.phoneNumber')}
                placeholderTextColor={colors.grayText}
                keyboardType="phone-pad"
                value={newBuddyPhone}
                onChangeText={setNewBuddyPhone}
              />
            </View>
            {/* Form action buttons */}
            <View style={styles.formButtons}>
              <Button
                title={t('onboarding.addBuddy')}
                onPress={handleAddBuddySubmit}
                variant="primary"
                fullWidth
                style={styles.formButton}
              />
              <Button
                title={t('common.cancel')}
                onPress={() => setAddModalVisible(false)}
                variant="outline"
                fullWidth
                style={styles.formButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Check-in Confirmation Modal */}
      <Modal
        visible={alertModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAlertModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
              styles.modalContent,
              { backgroundColor: isDark ? colors.darkBackground : colors.lightBackground }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[
                  styles.modalTitle,
                  { color: isDark ? colors.lightText : colors.darkText }
                ]}
              >
                {t('peerZone.peerAlert') /* "A friend needs you" */}
              </Text>
            </View>
            {selectedBuddyForAlert && (
              <View style={styles.alertContent}>
                {/* Buddy initial avatar large */}
                <View style={[
                    styles.avatarLarge,
                    {
                      backgroundColor: selectedBuddyForAlert.isPrimary
                        ? colors.accent
                        : colors.primaryLight,
                    }
                  ]}
                >
                  <Text style={styles.avatarTextLarge}>
                    {selectedBuddyForAlert.name.charAt(0)}
                  </Text>
                </View>
                {/* Confirmation question text */}
                <Text style={[
                    styles.alertText,
                    { color: isDark ? colors.lightText : colors.darkText, writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }
                  ]}
                >
                  {t('peerZone.confirmCheck', { name: selectedBuddyForAlert.name }) 
                    || `${t('common.appName')}: ${t('peerZone.checkBuddy')}?`
                  }
                </Text>
                {/* Confirmation modal buttons */}
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
    fontFamily: typography.fontFamily.demiBold,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.sm,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
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
    marginLeft: spacing.xs,
  },
  statusText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
  },
  buddyList: {
    padding: spacing.md,
  },
  buddyCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borders.radius.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  buddyInfo: {
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
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
    // (No need to flip for RTL, it's symmetric on avatar)
  },
  buddyDetails: {
    flex: 1,
  },
  buddyName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.xs,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  primaryBadge: {
    color: colors.badge1,
  },
  buddyStatus: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
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
  formLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.xs,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightBorder,
    borderRadius: borders.radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: '100%',
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
  },
  formButtons: {
    marginTop: spacing.sm,
  },
  formButton: {
    marginBottom: spacing.sm,
  },
});

export default PeerZoneScreen;

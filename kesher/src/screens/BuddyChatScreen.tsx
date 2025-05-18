import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import { colors, typography, spacing, borders, shadows } from '../utils/theme';
import { t } from '../utils/i18n';
import { RootState } from '../services/store';
import { addMessage } from '../services/slices/buddySlice';

const USER_SENDER_ID = 'user';

const BuddyChatScreen = () => {
  const dispatch = useDispatch();
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const selectedBuddyId = useSelector(
    (state: RootState) => state.buddy.selectedBuddyId
  );
  const buddy = useSelector((state: RootState) =>
    state.buddy.buddies.find((b) => b.id === selectedBuddyId)
  );
  const messages = useSelector((state: RootState) =>
    state.buddy.messages.filter((m) => m.buddyId === selectedBuddyId)
  );
  const userPhone = useSelector((state: RootState) => state.user.phoneNumber);

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim() || !buddy) return;

    dispatch(
      addMessage({
        id: Date.now().toString(),
        buddyId: buddy.id,
        senderId: userPhone || USER_SENDER_ID,
        text: inputText.trim(),
      })
    );

    setInputText('');
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderItem = ({ item }: { item: any }) => {
    const isBuddyMessage = buddy && item.senderId === buddy.id;
    return (
      <View
        style={[
          styles.messageBubble,
          isBuddyMessage ? styles.buddyBubble : styles.userBubble,
          {
            backgroundColor: isBuddyMessage
              ? isDark
                ? colors.primaryDark
                : colors.primaryLight
              : colors.accent,
          },
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
      </View>
    );
  };

  if (!buddy) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDark ? colors.darkBackground : colors.lightBackground },
        ]}
      >
        <Text style={{ alignSelf: 'center', marginTop: spacing.lg }}>
          {t('peerZone.peerAlert')}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.darkBackground : colors.lightBackground },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDark ? colors.darkBackground : colors.lightBackground,
              borderTopColor: isDark ? colors.darkBorder : colors.lightBorder,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
                color: isDark ? colors.lightText : colors.darkText,
              },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('chat.placeholder')}
            placeholderTextColor={isDark ? colors.grayLight : colors.grayDark}
            multiline
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim()
                  ? colors.accent
                  : isDark
                  ? colors.darkBorder
                  : colors.lightBorder,
              },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={24}
              color={inputText.trim() ? colors.lightText : colors.grayDark}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    padding: spacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borders.radius.lg,
    marginBottom: spacing.md,
    ...shadows.light,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: borders.radius.sm,
  },
  buddyBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: borders.radius.sm,
  },
  messageText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.lightText,
  },
  timeText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.sm,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderRadius: borders.radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 120,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BuddyChatScreen;

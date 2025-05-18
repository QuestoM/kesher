import React, { useState, useRef, useLayoutEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
=======
import { useNavigation } from '@react-navigation/native';

import { colors, typography, spacing, borders, shadows } from '../utils/theme';
import { t } from '../utils/i18n';
import Button from '../components/Button';
import { RootState } from '../services/store';
import { addMessage, BuddyMessage } from '../services/slices/buddySlice';

const BuddyChatScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'BuddyChat'>>();
=======
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { selectedBuddyId, buddies, messages } = useSelector(
    (state: RootState) => state.buddy
  );

  const buddyId = route.params?.buddyId ?? selectedBuddyId;

  const buddy = buddies.find((b) => b.id === buddyId) ?? null;
  const buddyMessages = messages.filter((m) => m.buddyId === buddyId);
=======
  const buddy = buddies.find((b) => b.id === selectedBuddyId);
  const buddyMessages = messages.filter((m) => m.buddyId === selectedBuddyId);

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    if (buddy) {
      navigation.setOptions({ title: buddy.name });
    }
  }, [navigation, buddy]);

  const handleSend = () => {
    if (!inputText.trim() || !buddyId) return;

    const newMessage: Omit<BuddyMessage, 'timestamp' | 'isRead'> = {
      id: Date.now().toString(),
      buddyId,
=======
    if (!inputText.trim() || !selectedBuddyId) return;

    const newMessage: Omit<BuddyMessage, 'timestamp' | 'isRead'> = {
      id: Date.now().toString(),
      buddyId: selectedBuddyId,
      senderId: 'me',
      text: inputText.trim(),
    };

    dispatch(addMessage(newMessage));
    setInputText('');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderMessageItem = ({ item }: { item: BuddyMessage }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderId === 'me' ? styles.userBubble : styles.aiBubble,
        {
          backgroundColor: item.senderId === 'me'
            ? colors.accent
            : isDark
            ? colors.primaryDark
            : colors.primaryLight,
        },
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
    </View>
  );

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
          data={buddyMessages}
          renderItem={renderMessageItem}
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

        <View style={styles.sosContainer}>
          <Button
            title={t('chat.sos')}
            onPress={() => {
              const sosMessage: Omit<BuddyMessage, 'timestamp' | 'isRead'> = {
                id: Date.now().toString(),
                buddyId: buddyId || 'unknown',
=======
                buddyId: selectedBuddyId || 'unknown',
                senderId: 'system',
                text: t('chat.supportReady'),
              };
              dispatch(addMessage(sosMessage));
            }}
            variant="danger"
            size="small"
          />
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
    paddingBottom: 80,
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
  aiBubble: {
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
  sosContainer: {
    position: 'absolute',
    bottom: 80,
    right: spacing.md,
    zIndex: 1,
  },
});

export default BuddyChatScreen;

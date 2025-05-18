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
import { useSelector } from 'react-redux';

import { colors, typography, spacing, borders, shadows } from '../utils/theme';
import { t } from '../utils/i18n';
import Button from '../components/Button';
import { RootState } from '../services/store';

// Message interface
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

const ChatScreen = () => {
  const selectedBuddyId = useSelector(
    (state: RootState) => state.buddy.selectedBuddyId
  );

  const [messages, setMessages] = useState<Message[]>(() =>
    selectedBuddyId
      ? [
          {
            id: '1',
            text: 'היי, אני כאן – מה קורה?',
            isUser: false,
            timestamp: Date.now(),
          },
        ]
      : [
          {
            id: '1',
            text: 'שלום, אנחנו כאן בשבילך. איך אני יכול לעזור לך היום?',
            isUser: false,
            timestamp: Date.now() - 60000,
          },
        ]
  );
  
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Send message
  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');

    if (selectedBuddyId) {
      // In buddy chat mode we don't auto-generate responses
      return;
    }

    // Simulate AI response (would be replaced with actual API call)
    setTimeout(() => {
      // Simulate typing
      let aiResponse = '';

      // Simple pattern matching for demo purposes
      if (inputText.toLowerCase().includes('שלום') || inputText.toLowerCase().includes('היי')) {
        aiResponse = 'היי אחי, מה קורה? איך אתה מרגיש היום?';
      } else if (
        inputText.toLowerCase().includes('עצוב') ||
        inputText.toLowerCase().includes('קשה') ||
        inputText.toLowerCase().includes('עייף')
      ) {
        aiResponse = 'אני מבין שקשה לך עכשיו. אתה רוצה לדבר על מה שמטריד אותך?';
      } else if (inputText.toLowerCase().includes('שינה') || inputText.toLowerCase().includes('לישון')) {
        aiResponse = 'שינה טובה היא חלק חשוב מהחוסן האישי. אתה מתקשה לישון לאחרונה?';
      } else if (inputText.toLowerCase().includes('חבר') || inputText.toLowerCase().includes('בודד')) {
        aiResponse = 'חברים הם חלק משמעותי מהתמיכה שלנו. אולי כדאי לפנות לאחד הבאדיז שלך?';
      } else {
        aiResponse = 'תודה ששיתפת. אתה רוצה להמשיך לדבר על זה או שיש משהו אחר שמעסיק אותך?';
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    }, 1000);
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Render message item
  const renderMessageItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble,
        {
          backgroundColor: item.isUser
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
          data={messages}
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
              backgroundColor: isDark 
                ? colors.darkBackground 
                : colors.lightBackground,
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
                  : isDark ? colors.darkBorder : colors.lightBorder,
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

        {/* SOS Button */}
        <View style={styles.sosContainer}>
          <Button
            title="SOS"
            onPress={() => {
              // Would trigger emergency contact
              const sosMessage: Message = {
                id: Date.now().toString(),
                text: 'מפעיל קשר חירום עם גורם מקצועי. אנחנו כאן בשבילך.',
                isUser: false,
                timestamp: Date.now(),
              };
              setMessages((prevMessages) => [...prevMessages, sosMessage]);
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
    paddingBottom: 80, // Extra space for the SOS button
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

export default ChatScreen; 
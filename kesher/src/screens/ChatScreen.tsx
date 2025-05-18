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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, typography, spacing, borders, shadows } from '../utils/theme';
import { t } from '../utils/i18n';
import Button from '../components/Button';

// Message interface
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'שלום, אנחנו כאן בשבילך. איך אני יכול לעזור לך היום?',
      isUser: false,
      timestamp: Date.now() - 60000,
    },
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  /**
   * Send the user's text to the OpenAI chat API and return the assistant's reply.
   * Endpoint: https://api.openai.com/v1/chat/completions
   * Example request body:
   * {
   *   model: 'gpt-3.5-turbo',
   *   messages: [
   *     { role: 'system', content: 'You are a supportive friend responding in Hebrew.' },
   *     { role: 'user', content: userText }
   *   ]
   * }
   */
  const fetchAIResponse = async (userText: string): Promise<string> => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OPENAI_API_KEY is not set');
      throw new Error('Missing API key');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a supportive friend responding in Hebrew.',
          },
          { role: 'user', content: userText },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? '';
  };

  // Send message
  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const text = inputText.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiText = await fetchAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      const fallback: Message = {
        id: (Date.now() + 1).toString(),
        text: 'מצטער, לא הצלחתי לקבל תשובה.',
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, fallback]);
    } finally {
      setIsLoading(false);
    }
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
            editable={!isLoading}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  inputText.trim() && !isLoading
                    ? colors.accent
                    : isDark
                    ? colors.darkBorder
                    : colors.lightBorder,
              },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.lightText} />
            ) : (
              <Ionicons
                name="send"
                size={24}
                color={inputText.trim() ? colors.lightText : colors.grayDark}
              />
            )}
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
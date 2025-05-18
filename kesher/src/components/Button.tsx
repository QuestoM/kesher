import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing, borders } from '../utils/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getBgColor = () => {
    if (disabled) return colors.grayLight;
    
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.accent;
      case 'outline': return 'transparent';
      case 'danger': return colors.error;
      default: return colors.primary;
    }
  };
  
  const getTextColor = () => {
    if (disabled) return colors.grayDark;
    if (variant === 'outline') return colors.primary;
    return colors.lightText;
  };
  
  const getPadding = () => {
    switch (size) {
      case 'small': return { v: spacing.xs, h: spacing.sm };
      case 'medium': return { v: spacing.sm, h: spacing.md };
      case 'large': return { v: spacing.md, h: spacing.lg };
      default: return { v: spacing.sm, h: spacing.md };
    }
  };
  
  const padding = getPadding();
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBgColor(),
          paddingVertical: padding.v,
          paddingHorizontal: padding.h,
          borderWidth: variant === 'outline' ? borders.width.regular : 0,
          borderColor: variant === 'outline' ? colors.primary : undefined,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[
          styles.text,
          { color: getTextColor() },
          textStyle,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  text: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
});

export default Button; 
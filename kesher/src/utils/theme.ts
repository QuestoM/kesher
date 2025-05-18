// Color palette for Kesher app
export const colors = {
  // Primary Colors
  primary: '#4E5D52', // Olive - Main brand color
  primaryLight: '#6B7D6F',
  primaryDark: '#374039',
  
  // Accent Colors
  accent: '#2FACFF', // Sky blue - Secondary brand color
  accentLight: '#5DC1FF',
  accentDark: '#2089D4',
  
  // UI Colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  
  // Background Colors
  lightBackground: '#FFFFFF',
  darkBackground: '#121212',
  
  // Border Colors
  lightBorder: '#E0E0E0',
  darkBorder: '#333333',
  
  // Text Colors
  lightText: '#FFFFFF',
  darkText: '#212121',
  grayText: '#757575',
  
  // Semantic Colors
  grayLight: '#BDBDBD',
  grayDark: '#757575',
  
  // Badge Colors
  badge1: '#FFC107',
  badge2: '#8BC34A',
  badge3: '#9C27B0',
  badge4: '#FF5722',
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'Rubik-Regular',
    medium: 'Rubik-Medium',
    bold: 'Rubik-Bold',
    demiBold: 'Rubik-DemiBold',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 42,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Borders
export const borders = {
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  width: {
    thin: 1,
    regular: 2,
    thick: 3,
  },
};

// Shadows
export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
};

// Animation
export const animation = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};

// Common styles
export const commonStyles = {
  card: {
    backgroundColor: colors.lightBackground,
    borderRadius: borders.radius.md,
    padding: spacing.md,
    ...shadows.medium,
  },
  cardDark: {
    backgroundColor: colors.darkBackground,
    borderRadius: borders.radius.md,
    padding: spacing.md,
    ...shadows.medium,
  },
  container: {
    flex: 1,
    padding: spacing.md,
  },
  button: {
    borderRadius: borders.radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.lightText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
  },
}; 
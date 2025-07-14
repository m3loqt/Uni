export const Colors = {
  // Primary brand colors - inspired by the blue theme in reference
  primary: '#2563EB', // Modern blue
  primaryLight: '#60A5FA',
  primaryDark: '#1D4ED8',
  
  // Secondary colors
  secondary: '#10B981',
  accent: '#F59E0B',
  
  // Status colors
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
  
  // Neutral palette - more sophisticated grays
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  
  // Background colors
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  
  // Text colors with better contrast
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  
  // Status colors for appointments/prescriptions
  statusUpcoming: '#3B82F6',
  statusCompleted: '#10B981',
  statusCancelled: '#EF4444',
  statusActive: '#10B981',
  statusExpired: '#94A3B8',
  statusLowStock: '#F59E0B',
  
  // Interactive states
  hover: '#F1F5F9',
  pressed: '#E2E8F0',
  focus: '#DBEAFE',
  
  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderFocus: '#3B82F6',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
  xxxxxl: 64,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  full: 9999,
} as const;

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 19,
  xxl: 22,
  xxxl: 28,
  xxxxl: 36,
} as const;

export const FontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export const Shadows = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 12,
  },
} as const;

// Animation durations
export const Animations = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// Responsive breakpoints
export const Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// Typography scale
export const Typography = {
  display: {
    fontSize: FontSizes.xxxxl,
    fontWeight: FontWeights.bold,
    lineHeight: 44,
  },
  h1: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    lineHeight: 36,
  },
  h2: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.semibold,
    lineHeight: 28,
  },
  h3: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    lineHeight: 24,
  },
  h4: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    lineHeight: 22,
  },
  body: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    lineHeight: 22,
  },
  caption: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    lineHeight: 18,
  },
  captionMedium: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    lineHeight: 18,
  },
  small: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    lineHeight: 16,
  },
} as const;
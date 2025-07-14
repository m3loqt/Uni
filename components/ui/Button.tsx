import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  style, 
  disabled, 
  ...rest 
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
    };

    // Size variations
    switch (size) {
      case 'sm':
        baseStyle.paddingVertical = Spacing.sm;
        baseStyle.paddingHorizontal = Spacing.lg;
        baseStyle.minHeight = 36;
        break;
      case 'lg':
        baseStyle.paddingVertical = Spacing.lg;
        baseStyle.paddingHorizontal = Spacing.xxl;
        baseStyle.minHeight = 52;
        break;
      default: // md
        baseStyle.paddingVertical = Spacing.md;
        baseStyle.paddingHorizontal = Spacing.xl;
        baseStyle.minHeight = 44;
    }

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = Colors.gray100;
        if (!disabled) {
          baseStyle.shadowColor = Colors.gray900;
          baseStyle.shadowOffset = { width: 0, height: 1 };
          baseStyle.shadowOpacity = 0.05;
          baseStyle.shadowRadius = 2;
          baseStyle.elevation = 1;
        }
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1.5;
        baseStyle.borderColor = disabled ? Colors.gray300 : Colors.primary;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
      case 'destructive':
        baseStyle.backgroundColor = Colors.error;
        if (!disabled) {
          baseStyle.shadowColor = Colors.error;
          baseStyle.shadowOffset = { width: 0, height: 2 };
          baseStyle.shadowOpacity = 0.1;
          baseStyle.shadowRadius = 4;
          baseStyle.elevation = 2;
        }
        break;
      default: // primary
        if (!disabled) {
          baseStyle.shadowColor = Colors.primary;
          baseStyle.shadowOffset = { width: 0, height: 2 };
          baseStyle.shadowOpacity = 0.1;
          baseStyle.shadowRadius = 4;
          baseStyle.elevation = 2;
        }
    }

    if (disabled) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontFamily: 'Inter-SemiBold',
      textAlign: 'center',
    };

    // Size variations
    switch (size) {
      case 'sm':
        baseTextStyle.fontSize = Typography.caption.fontSize;
        break;
      case 'lg':
        baseTextStyle.fontSize = Typography.h4.fontSize;
        break;
      default: // md
        baseTextStyle.fontSize = Typography.body.fontSize;
    }

    // Variant colors
    switch (variant) {
      case 'secondary':
        baseTextStyle.color = Colors.textPrimary;
        break;
      case 'outline':
        baseTextStyle.color = disabled ? Colors.textTertiary : Colors.primary;
        break;
      case 'ghost':
        baseTextStyle.color = disabled ? Colors.textTertiary : Colors.primary;
        break;
      case 'destructive':
        baseTextStyle.color = Colors.textInverse;
        break;
      default: // primary
        baseTextStyle.color = Colors.textInverse;
    }

    return baseTextStyle;
  };

  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity 
        style={[getButtonStyle(), style]} 
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...rest}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={[StyleSheet.absoluteFill, { borderRadius: BorderRadius.lg }]}
        />
        {leftIcon}
        <Text style={getTextStyle()}>
          {loading ? 'Loading...' : title}
        </Text>
        {rightIcon}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[getButtonStyle(), style]} 
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {leftIcon}
      <Text style={getTextStyle()}>
        {loading ? 'Loading...' : title}
      </Text>
      {rightIcon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Additional styles if needed
});
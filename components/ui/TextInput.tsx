import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  Text,
  Animated,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function TextInput({ 
  label,
  icon, 
  rightIcon, 
  error,
  helperText,
  required = false,
  style, 
  onFocus,
  onBlur,
  value,
  ...rest 
}: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return Colors.error;
    if (isFocused) return Colors.primary;
    return Colors.border;
  };

  const labelStyle = {
    position: 'absolute' as const,
    left: icon ? 48 : Spacing.lg,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [Typography.body.fontSize, Typography.small.fontSize],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.textTertiary, isFocused ? Colors.primary : Colors.textSecondary],
    }),
    backgroundColor: Colors.surface,
    paddingHorizontal: 4,
    zIndex: 1,
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Animated.Text style={labelStyle}>
          {label}{required && ' *'}
        </Animated.Text>
      )}
      <View style={[
        styles.inputContainer,
        { borderColor: getBorderColor() },
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <RNTextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          placeholderTextColor={Colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          {...rest}
        />
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
      {(error || helperText) && (
        <Text style={[
          styles.helperText,
          error && styles.errorText,
        ]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    minHeight: 56,
    paddingHorizontal: Spacing.lg,
    position: 'relative',
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  rightIconContainer: {
    marginLeft: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  inputWithIcon: {
    marginLeft: 0,
  },
  inputWithRightIcon: {
    marginRight: 0,
  },
  helperText: {
    fontSize: Typography.small.fontSize,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  errorText: {
    color: Colors.error,
  },
});
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ title, variant = 'primary', style, disabled, ...rest }: ButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity style={[styles.button, style]} disabled={disabled} {...rest}>
        <LinearGradient
          colors={disabled ? ['#9CA3AF', '#9CA3AF'] : ['#004D80', '#4695EB']}
          style={styles.gradient}
        >
          <Text style={styles.primaryText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'outline' && styles.outlineButton,
        variant === 'secondary' && styles.secondaryButton,
        disabled && styles.disabledButton,
        style
      ]} 
      disabled={disabled}
      {...rest}
    >
      <Text style={[
        variant === 'outline' && styles.outlineText,
        variant === 'secondary' && styles.secondaryText,
        disabled && styles.disabledText,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    marginVertical: 8,
  },
  gradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    alignItems: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#004D80',
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#374151',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  outlineText: {
    color: '#004D80',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  disabledText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
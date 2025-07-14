import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof Spacing;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ 
  children, 
  variant = 'default',
  padding = 'lg',
  style,
  onPress 
}: CardProps) {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.xl,
      padding: Spacing[padding],
    };

    switch (variant) {
      case 'elevated':
        baseStyle.backgroundColor = Colors.surface;
        baseStyle.shadowColor = Colors.gray900;
        baseStyle.shadowOffset = { width: 0, height: 4 };
        baseStyle.shadowOpacity = 0.08;
        baseStyle.shadowRadius = 12;
        baseStyle.elevation = 4;
        break;
      case 'outlined':
        baseStyle.backgroundColor = Colors.surface;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = Colors.border;
        break;
      case 'filled':
        baseStyle.backgroundColor = Colors.gray50;
        break;
      default: // default
        baseStyle.backgroundColor = Colors.surface;
        baseStyle.shadowColor = Colors.gray900;
        baseStyle.shadowOffset = { width: 0, height: 2 };
        baseStyle.shadowOpacity = 0.04;
        baseStyle.shadowRadius = 8;
        baseStyle.elevation = 2;
    }

    return baseStyle;
  };

  const CardComponent = onPress ? 
    require('react-native').TouchableOpacity : 
    View;

  return (
    <CardComponent 
      style={[getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.95 : 1}
    >
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  // Additional styles if needed
});
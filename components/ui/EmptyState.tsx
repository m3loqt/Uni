import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  style?: any;
  variant?: 'default' | 'compact' | 'minimal';
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  style,
  variant = 'default',
}: EmptyStateProps) {
  const getContainerStyle = () => {
    switch (variant) {
      case 'compact':
        return [styles.container, styles.compactContainer];
      case 'minimal':
        return [styles.container, styles.minimalContainer];
      default:
        return styles.container;
    }
  };

  return (
    <View style={[getContainerStyle(), style]}>
      {icon && (
        <View style={[
          styles.iconContainer,
          variant === 'compact' && styles.compactIconContainer,
          variant === 'minimal' && styles.minimalIconContainer,
        ]}>
          {icon}
        </View>
      )}
      <Text style={[
        styles.title,
        variant === 'compact' && styles.compactTitle,
        variant === 'minimal' && styles.minimalTitle,
      ]}>
        {title}
      </Text>
      {description && (
        <Text style={[
          styles.description,
          variant === 'compact' && styles.compactDescription,
          variant === 'minimal' && styles.minimalDescription,
        ]}>
          {description}
        </Text>
      )}
      {actionText && onAction && (
        <TouchableOpacity 
          style={[
            styles.actionButton,
            variant === 'compact' && styles.compactActionButton,
            variant === 'minimal' && styles.minimalActionButton,
          ]} 
          onPress={onAction}
        >
          <Text style={[
            styles.actionText,
            variant === 'minimal' && styles.minimalActionText,
          ]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxxxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    ...Shadows.md,
  },
  compactContainer: {
    padding: Spacing.xxl,
    minHeight: 150,
  },
  minimalContainer: {
    backgroundColor: 'transparent',
    padding: Spacing.xl,
    minHeight: 120,
    shadowOpacity: 0,
    elevation: 0,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
    opacity: 0.6,
  },
  compactIconContainer: {
    marginBottom: Spacing.md,
  },
  minimalIconContainer: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  compactTitle: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xs,
  },
  minimalTitle: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
    maxWidth: 280,
  },
  compactDescription: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
    maxWidth: 240,
    lineHeight: 20,
  },
  minimalDescription: {
    fontSize: FontSizes.xs,
    marginBottom: Spacing.sm,
    maxWidth: 200,
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    minWidth: 120,
  },
  compactActionButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minWidth: 100,
  },
  minimalActionButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minWidth: 80,
  },
  actionText: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.surface,
    textAlign: 'center',
  },
  minimalActionText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
  },
});
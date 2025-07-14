import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'default' | 'full';
}

export function QuickActionCard({ title, subtitle, icon, onPress, variant = 'default' }: QuickActionCardProps) {
  const isFullWidth = variant === 'full';

  return (
    <TouchableOpacity 
      style={[styles.card, isFullWidth && styles.fullWidthCard]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isFullWidth && styles.fullWidthIconContainer]}>
        {icon}
      </View>
      <View style={[styles.content, isFullWidth && styles.fullWidthContent]}>
        <Text style={[styles.title, isFullWidth && styles.fullWidthTitle]}>{title}</Text>
        <Text style={[styles.subtitle, isFullWidth && styles.fullWidthSubtitle]}>{subtitle}</Text>
      </View>
      {isFullWidth && (
        <View style={styles.chevronContainer}>
          <ChevronRight size={20} color={Colors.textTertiary} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  fullWidthCard: {
    flex: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  fullWidthIconContainer: {
    width: 56,
    height: 56,
    marginBottom: 0,
    marginRight: Spacing.lg,
  },
  content: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  fullWidthContent: {
    flex: 1,
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  fullWidthTitle: {
    fontSize: FontSizes.lg,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  fullWidthSubtitle: {
    fontSize: FontSizes.sm,
    textAlign: 'left',
  },
  chevronContainer: {
    marginLeft: Spacing.md,
  },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSizes, BorderRadius, Typography } from '@/constants/theme';

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'default' | 'full' | 'service';
}

export function QuickActionCard({ title, subtitle, icon, onPress, variant = 'default' }: QuickActionCardProps) {
  const isFullWidth = variant === 'full';
  const isService = variant === 'service';

  if (isService) {
    return (
      <TouchableOpacity 
        style={styles.serviceCard} 
        onPress={onPress} 
        activeOpacity={0.8}
      >
        <Card variant="elevated" style={styles.serviceCardInner}>
          <View style={styles.serviceIconContainer}>
            {icon}
          </View>
          <Text style={styles.serviceTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.serviceSubtitle} numberOfLines={2}>{subtitle}</Text>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.card, isFullWidth && styles.fullWidthCard]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <Card variant="elevated" style={[styles.cardInner, isFullWidth && styles.fullWidthCardInner]}>
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
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
  },
  cardInner: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  fullWidthCard: {
    flex: 0,
    width: '100%',
  },
  fullWidthCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  serviceCard: {
    width: '48%',
    aspectRatio: 1,
  },
  serviceCardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
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
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  fullWidthTitle: {
    fontSize: Typography.h4.fontSize,
    textAlign: 'left',
  },
  serviceTitle: {
    fontSize: Typography.captionMedium.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.caption.fontSize,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  fullWidthSubtitle: {
    fontSize: Typography.caption.fontSize,
    textAlign: 'left',
  },
  serviceSubtitle: {
    fontSize: Typography.small.fontSize,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  chevronContainer: {
    marginLeft: Spacing.md,
  },
});
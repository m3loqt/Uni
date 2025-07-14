import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  gradient: string[];
}

export function StatCard({ title, value, unit, icon, gradient }: StatCardProps) {
  return (
    <LinearGradient colors={gradient} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    opacity: 0.9,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  value: {
    fontSize: FontSizes.xxxl,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    lineHeight: FontSizes.xxxl + 4,
  },
  unit: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    opacity: 0.8,
  },
});
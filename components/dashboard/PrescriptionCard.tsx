import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pill, Clock } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

interface PrescriptionCardProps {
  medicineName: string;
  dosage: string;
  doctorName: string;
  daysLeft: number;
}

export function PrescriptionCard({ medicineName, dosage, doctorName, daysLeft }: PrescriptionCardProps) {
  const isLowStock = daysLeft <= 7;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={[styles.iconContainer, isLowStock && styles.lowStockIcon]}>
        <Pill size={24} color={isLowStock ? Colors.warning : Colors.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.medicineName} numberOfLines={1}>{medicineName}</Text>
        <Text style={styles.dosage} numberOfLines={1}>{dosage}</Text>
        <Text style={styles.doctorName} numberOfLines={1}>Dr. {doctorName}</Text>
        
        <View style={styles.footer}>
          <View style={styles.daysLeftContainer}>
            <Clock size={14} color={isLowStock ? Colors.warning : Colors.textSecondary} />
            <Text style={[styles.daysLeft, isLowStock && styles.lowStockText]}>
              {daysLeft} days left
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: 200,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  lowStockIcon: {
    backgroundColor: `${Colors.warning}15`,
  },
  content: {
    gap: Spacing.xs,
  },
  medicineName: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  dosage: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  doctorName: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-Medium',
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  footer: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  daysLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  daysLeft: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textSecondary,
  },
  lowStockText: {
    color: Colors.warning,
  },
});
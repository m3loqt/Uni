import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pill, Clock, User, Calendar } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

interface PrescriptionListCardProps {
  id: string;
  medicineName: string;
  dosage: string;
  doctorName: string;
  prescribedDate: string;
  daysLeft: number;
  status: 'active' | 'expired';
  onPress: () => void;
}

export function PrescriptionListCard({
  medicineName,
  dosage,
  doctorName,
  prescribedDate,
  daysLeft,
  status,
  onPress,
}: PrescriptionListCardProps) {
  const isLowStock = daysLeft <= 7 && status === 'active';
  const isExpired = status === 'expired';

  const getStatusColor = () => {
    if (isExpired) return Colors.statusExpired;
    if (isLowStock) return Colors.statusLowStock;
    return Colors.statusActive;
  };

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (isLowStock) return 'Low Stock';
    return 'Active';
  };

  const getIconColor = () => {
    if (isExpired) return Colors.textSecondary;
    return Colors.primary;
  };

  const getIconBackground = () => {
    if (isExpired) return Colors.gray100;
    return `${Colors.primary}15`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: getIconBackground() }]}>
          <Pill size={24} color={getIconColor()} />
        </View>
        <View style={styles.medicineInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.medicineName} numberOfLines={1}>{medicineName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
          <Text style={styles.dosage} numberOfLines={1}>{dosage}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <User size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={1}>{doctorName}</Text>
        </View>
        
        <View style={styles.footerRow}>
          <View style={styles.dateContainer}>
            <Calendar size={14} color={Colors.textSecondary} />
            <Text style={styles.dateText}>Prescribed: {prescribedDate}</Text>
          </View>
          {status === 'active' && (
            <View style={styles.daysLeftContainer}>
              <Clock size={14} color={isLowStock ? Colors.statusLowStock : Colors.textSecondary} />
              <Text style={[
                styles.daysLeftText,
                isLowStock && styles.lowStockText
              ]}>
                {daysLeft} days left
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  medicineInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  medicineName: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-SemiBold',
    color: Colors.surface,
    textTransform: 'capitalize',
  },
  dosage: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  cardContent: {
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  dateText: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  daysLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  daysLeftText: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textSecondary,
  },
  lowStockText: {
    color: Colors.statusLowStock,
  },
});
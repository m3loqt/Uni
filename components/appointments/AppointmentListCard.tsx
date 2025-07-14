import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

interface AppointmentListCardProps {
  id: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  imageUrl: string;
  onPress: () => void;
}

export function AppointmentListCard({
  doctorName,
  specialty,
  clinic,
  date,
  time,
  status,
  imageUrl,
  onPress,
}: AppointmentListCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'upcoming':
        return Colors.statusUpcoming;
      case 'completed':
        return Colors.statusCompleted;
      case 'cancelled':
        return Colors.statusCancelled;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: imageUrl }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.doctorName} numberOfLines={1}>{doctorName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
          <Text style={styles.specialty} numberOfLines={1}>{specialty}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <MapPin size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={1}>{clinic}</Text>
        </View>
        
        <View style={styles.timeRow}>
          <View style={styles.timeItem}>
            <Calendar size={14} color={Colors.primary} />
            <Text style={styles.timeText}>{date}</Text>
          </View>
          <View style={styles.timeItem}>
            <Clock size={14} color={Colors.primary} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
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
  doctorImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  doctorName: {
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
  specialty: {
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
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  timeText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
});
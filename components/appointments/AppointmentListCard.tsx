import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows, Typography } from '@/constants/theme';

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

  const getStatusText = () => {
    switch (status) {
      case 'upcoming':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: imageUrl }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.doctorName} numberOfLines={1}>{doctorName}</Text>
              <ChevronRight size={20} color={Colors.textTertiary} />
            </View>
            <Text style={styles.specialty} numberOfLines={1}>{specialty}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <MapPin size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>{clinic}</Text>
          </View>
          
          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Calendar size={16} color={Colors.primary} />
              <Text style={styles.timeText}>{date}</Text>
            </View>
            <View style={styles.timeItem}>
              <Clock size={16} color={Colors.primary} />
              <Text style={styles.timeText}>{time}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  doctorImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.lg,
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
    fontSize: Typography.h4.fontSize,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  specialty: {
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: Typography.captionMedium.fontSize,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  cardContent: {
    gap: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  timeText: {
    fontSize: Typography.bodyMedium.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
});
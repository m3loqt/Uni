import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

interface AppointmentCardProps {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  imageUrl: string;
}

export function AppointmentCard({ doctorName, specialty, date, time, imageUrl }: AppointmentCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.header}>
        <Image source={{ uri: imageUrl }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.timeInfo}>
        <View style={styles.timeItem}>
          <Calendar size={18} color={Colors.primary} />
          <Text style={styles.timeText}>{date}</Text>
        </View>
        <View style={styles.timeItem}>
          <Clock size={18} color={Colors.primary} />
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  doctorImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.lg,
  },
  doctorInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  doctorName: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  specialty: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginBottom: Spacing.lg,
  },
  timeInfo: {
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
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
});
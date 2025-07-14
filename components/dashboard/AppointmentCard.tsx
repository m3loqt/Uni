import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Typography } from '@/constants/theme';

interface AppointmentCardProps {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  imageUrl: string;
}

export function AppointmentCard({ doctorName, specialty, date, time, imageUrl }: AppointmentCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <View style={styles.header}>
        <Image source={{ uri: imageUrl }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
        </View>
      </View>
      
      <View style={styles.timeInfo}>
        <View style={styles.timeItem}>
          <View style={styles.timeIconContainer}>
            <Calendar size={16} color={Colors.textInverse} />
          </View>
          <Text style={styles.timeText}>{date}</Text>
        </View>
        <View style={styles.timeItem}>
          <View style={styles.timeIconContainer}>
            <Clock size={16} color={Colors.textInverse} />
          </View>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  doctorImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  doctorInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  doctorName: {
    fontSize: Typography.h4.fontSize,
    fontFamily: 'Inter-Bold',
    color: Colors.textInverse,
  },
  specialty: {
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
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
  timeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textInverse,
  },
});
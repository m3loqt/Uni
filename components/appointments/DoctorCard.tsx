import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, Calendar } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    clinic: string;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    nextAvailable: string;
  };
  onPress: () => void;
}

export function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: doctor.imageUrl }} style={styles.doctorImage} />
      <View style={styles.content}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <Text style={styles.clinic}>{doctor.clinic}</Text>
        
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Star size={16} color={Colors.accent} fill={Colors.accent} />
            <Text style={styles.ratingText}>
              {doctor.rating} ({doctor.reviewCount})
            </Text>
          </View>
          
          <View style={styles.availability}>
            <Calendar size={14} color={Colors.textSecondary} />
            <Text style={styles.availabilityText}>
              Next: {doctor.nextAvailable}
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
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    ...Shadows.md,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.lg,
  },
  content: {
    flex: 1,
  },
  doctorName: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  specialty: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  clinic: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  availability: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  availabilityText: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
});
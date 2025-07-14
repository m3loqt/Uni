import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Phone, MessageCircle, CreditCard as Edit } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useHealthStore } from '@/store/healthStore';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { formatDate, formatTime } from '@/utils/formatters';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appointments } = useHealthStore();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const foundAppointment = appointments.find(apt => apt.id === id);
    setAppointment(foundAppointment);
  }, [id, appointments]);

  const handleBack = () => {
    router.back();
  };

  const handleReschedule = () => {
    router.push(`/(tabs)/appointments/book?reschedule=${id}`);
  };

  const handleCancel = () => {
    // TODO: Implement cancel appointment
    console.log('Cancel appointment:', id);
  };

  if (!appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  const getStatusColor = () => {
    switch (appointment.status) {
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Details</Text>
        <TouchableOpacity style={styles.editButton}>
          <Edit size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Doctor Info */}
        <View style={styles.doctorCard}>
          <Image source={{ uri: appointment.imageUrl }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{appointment.doctorName}</Text>
            <Text style={styles.specialty}>{appointment.specialty}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{appointment.status}</Text>
            </View>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          
          <View style={styles.detailRow}>
            <Calendar size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(appointment.date)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Clock size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{formatTime(appointment.time)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MapPin size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{appointment.clinic}</Text>
              {appointment.address && (
                <Text style={styles.detailSubtext}>{appointment.address}</Text>
              )}
            </View>
          </View>

          {appointment.phone && (
            <View style={styles.detailRow}>
              <Phone size={20} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{appointment.phone}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Notes */}
        {appointment.notes && (
          <View style={styles.notesCard}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{appointment.notes}</Text>
          </View>
        )}

        {/* Actions */}
        {appointment.status === 'upcoming' && (
          <View style={styles.actionsCard}>
            <Button
              title="Reschedule"
              variant="outline"
              onPress={handleReschedule}
            />
            <Button
              title="Cancel Appointment"
              variant="secondary"
              onPress={handleCancel}
            />
            <TouchableOpacity style={styles.messageButton}>
              <MessageCircle size={20} color={Colors.primary} />
              <Text style={styles.messageText}>Message Doctor</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  doctorCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.xl,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.md,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.lg,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: FontSizes.xl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  specialty: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-SemiBold',
    color: Colors.surface,
    textTransform: 'uppercase',
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  detailContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  detailSubtext: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  notesCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  notesText: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  actionsCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    ...Shadows.md,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  messageText: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
});
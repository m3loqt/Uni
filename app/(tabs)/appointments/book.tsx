import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Search } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { DoctorCard } from '@/components/appointments/DoctorCard';
import { TimeSlotPicker } from '@/components/appointments/TimeSlotPicker';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    clinic: 'Heart Care Center',
    rating: 4.8,
    reviewCount: 127,
    imageUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    nextAvailable: '2024-01-25',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Endocrinologist',
    clinic: 'Diabetes Care Clinic',
    rating: 4.9,
    reviewCount: 89,
    imageUrl: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=400',
    nextAvailable: '2024-01-26',
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatologist',
    clinic: 'Skin Health Center',
    rating: 4.7,
    reviewCount: 156,
    imageUrl: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    nextAvailable: '2024-01-27',
  },
];

export default function BookAppointmentScreen() {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleTimeSlotSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(3);
  };

  const handleBookAppointment = () => {
    Alert.alert(
      'Appointment Booked',
      `Your appointment with ${selectedDoctor.name} on ${selectedDate} at ${selectedTime} has been booked successfully.${appointmentNotes ? '\n\nNotes: ' + appointmentNotes : ''}`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const filteredDoctors = mockDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Choose a Doctor</Text>
            <View style={styles.searchContainer}>
              <SearchBar
                placeholder="Search doctors or specialties..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <ScrollView style={styles.doctorsList} showsVerticalScrollIndicator={false}>
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onPress={() => handleDoctorSelect(doctor)}
                />
              ))}
            </ScrollView>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Date & Time</Text>
            <Text style={styles.stepSubtitle}>
              Booking with {selectedDoctor.name}
            </Text>
            <TimeSlotPicker
              doctorId={selectedDoctor.id}
              onTimeSlotSelect={handleTimeSlotSelect}
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Confirm Appointment</Text>
            <Text style={styles.stepSubtitle}>
              Review your appointment details
            </Text>
            
            <View style={styles.confirmationCard}>
              <Text style={styles.confirmationLabel}>Doctor</Text>
              <Text style={styles.confirmationValue}>{selectedDoctor.name}</Text>
              <Text style={styles.confirmationSubvalue}>{selectedDoctor.specialty}</Text>

              <Text style={styles.confirmationLabel}>Date & Time</Text>
              <Text style={styles.confirmationValue}>{selectedDate} at {selectedTime}</Text>

              <Text style={styles.confirmationLabel}>Location</Text>
              <Text style={styles.confirmationValue}>{selectedDoctor.clinic}</Text>
            </View>

            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Additional Notes (Optional)</Text>
              <Text style={styles.notesSubtitle}>
                Share any symptoms, concerns, or specific questions you'd like to discuss
              </Text>
              <TextInput
                style={styles.notesInput}
                placeholder="e.g., Experiencing chest pain for 2 days, need prescription refill, follow-up on blood test results..."
                placeholderTextColor={Colors.textTertiary}
                value={appointmentNotes}
                onChangeText={setAppointmentNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {appointmentNotes.length}/500 characters
              </Text>
            </View>

            <Button
              title="Confirm Appointment"
              onPress={handleBookAppointment}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((stepNumber) => (
          <View
            key={stepNumber}
            style={[
              styles.progressStep,
              stepNumber <= step && styles.progressStepActive,
            ]}
          />
        ))}
      </View>

      {renderStepContent()}
    <View style={styles.bottomSpacing} />
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
  placeholder: {
    width: 44,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    gap: Spacing.sm,
  },
  progressStep: {
    width: 60,
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
  },
  progressStepActive: {
    backgroundColor: Colors.primary,
  },
  stepContent: {
    flex: 1,
    padding: Spacing.xl,
  },
  stepTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  stepSubtitle: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  doctorsList: {
    flex: 1,
  },
  confirmationCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  confirmationLabel: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  confirmationValue: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  confirmationSubvalue: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  notesSection: {
    marginBottom: Spacing.xl,
  },
  notesLabel: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  notesSubtitle: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: FontSizes.md,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
    minHeight: 120,
    maxHeight: 200,
  },
  characterCount: {
    fontSize: FontSizes.xs,
    fontFamily: 'Inter-Regular',
    color: Colors.textTertiary,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
});
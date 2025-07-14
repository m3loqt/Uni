import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Bell, Calendar, Clock, User } from 'lucide-react-native';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { getDoctorAppointments } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { FilterOption } from '@/types';

const filterOptions: FilterOption[] = ['All', 'Upcoming', 'Completed', 'Cancelled'];

export default function DoctorAppointmentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    if (user) {
      try {
        const data = await getDoctorAppointments(user.uid);
        setAppointments(data);
      } catch (error) {
        console.error('Error loading appointments:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = selectedFilter === 'All' || 
      appointment.status.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = appointment.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Plus size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Bell size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search appointments..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <FilterTabs
        options={filterOptions}
        selectedOption={selectedFilter}
        onSelect={setSelectedFilter}
      />

      {/* Appointments List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.appointmentsList}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <TouchableOpacity
                key={appointment.id}
                style={styles.appointmentCard}
                onPress={() => {}}
              >
                <View style={styles.appointmentHeader}>
                  <View style={styles.patientInfo}>
                    <View style={styles.patientAvatar}>
                      <User size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.patientDetails}>
                      <Text style={styles.patientName}>
                        {appointment.patientName || 'Unknown Patient'}
                      </Text>
                      <Text style={styles.appointmentType}>{appointment.specialty}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(appointment.status) }
                  ]}>
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                </View>

                <View style={styles.appointmentDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{appointment.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Clock size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{appointment.time}</Text>
                  </View>
                </View>

                {appointment.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{appointment.notes}</Text>
                  </View>
                )}

                <View style={styles.appointmentActions}>
                  <TouchableOpacity style={styles.actionButtonSecondary}>
                    <Text style={styles.actionButtonText}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButtonPrimary}>
                    <Text style={styles.actionButtonTextPrimary}>
                      {appointment.status === 'upcoming' ? 'Start Consultation' : 'View Details'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <EmptyState
              icon={<Calendar size={48} color={Colors.textTertiary} />}
              title="No appointments found"
              description={
                searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Your scheduled appointments will appear here. Patients can book appointments with you through the app."
              }
            />
          )}
        </View>
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
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  appointmentsList: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  appointmentCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  appointmentType: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
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
    textTransform: 'uppercase',
  },
  appointmentDetails: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textPrimary,
  },
  notesContainer: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md,
  },
  notesLabel: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  notesText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButtonSecondary: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
  },
  actionButtonTextPrimary: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.surface,
  },
});
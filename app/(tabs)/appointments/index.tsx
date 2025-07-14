import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Bell, Calendar } from 'lucide-react-native';
import { AppointmentListCard } from '@/components/appointments/AppointmentListCard';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { useHealthStore } from '@/store/healthStore';
import { subscribeToAppointments } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { FilterOption } from '@/types';

const filterOptions: FilterOption[] = ['All', 'Upcoming', 'Completed', 'Cancelled'];

export default function AppointmentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();
  const { appointments, setAppointments, loading, error, setLoading, setError } = useHealthStore();

  useEffect(() => {
    if (user) {
      setLoading('appointments', true);
      const unsubscribe = subscribeToAppointments(user.uid, (data) => {
        setAppointments(data);
        setLoading('appointments', false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh will be handled by the real-time listener
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = selectedFilter === 'All' || 
      appointment.status.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAppointmentPress = (appointmentId: string) => {
    router.push(`/(tabs)/appointments/${appointmentId}`);
  };

  const handleBookAppointment = () => {
    router.push('/(tabs)/appointments/book');
  };

  if (loading.appointments && !refreshing) {
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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Appointments</Text>
          <Text style={styles.headerSubtitle}>
            {filteredAppointments.length} {filteredAppointments.length === 1 ? 'appointment' : 'appointments'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleBookAppointment}>
            <Plus size={22} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Bell size={22} color={Colors.textSecondary} />
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
        variant="compact"
      />

      {/* Error State */}
      {error.appointments && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.appointments}</Text>
        </View>
      )}

      {/* Appointments List */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.appointmentsList}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <AppointmentListCard
                key={appointment.id}
                {...appointment}
                onPress={() => handleAppointmentPress(appointment.id)}
              />
            ))
          ) : (
            <EmptyState
              icon={<Calendar size={48} color={Colors.textTertiary} />}
              title="No appointments found"
              description={searchQuery ? "Try adjusting your search terms" : "Book your first appointment to get started"}
              actionText="Book Appointment"
              onAction={handleBookAppointment}
              variant="compact"
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
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
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  appointmentsList: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  errorContainer: {
    margin: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  errorText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.error,
  },
});
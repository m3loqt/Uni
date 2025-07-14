import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Bell, Calendar, Filter } from 'lucide-react-native';
import { AppointmentListCard } from '@/components/appointments/AppointmentListCard';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { useHealthStore } from '@/store/healthStore';
import { subscribeToAppointments } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius, Typography } from '@/constants/theme';
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
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Visits</Text>
          <Text style={styles.headerSubtitle}>
            {filteredAppointments.length} {filteredAppointments.length === 1 ? 'appointment' : 'appointments'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleBookAppointment}>
            <Plus size={22} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Filter size={22} color={Colors.textSecondary} />
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
      <View style={styles.filtersContainer}>
        <FilterTabs
          options={filterOptions}
          selectedOption={selectedFilter}
          onSelect={setSelectedFilter}
          variant="compact"
        />
        <View style={styles.sortingContainer}>
          <Text style={styles.sortingLabel}>Sorting</Text>
          <TouchableOpacity style={styles.sortingButton}>
            <View style={styles.sortingIndicator} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Error State */}
      {error.appointments && (
        <View style={styles.errorContainer}>
          <Card variant="outlined" style={styles.errorCard}>
            <Text style={styles.errorText}>{error.appointments}</Text>
          </Card>
        </View>
      )}

      {/* Appointments List */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.appointmentsList}>
          {filteredAppointments.length > 0 ? (
            <>
              {/* Month Header */}
              <Text style={styles.monthHeader}>September 2024</Text>
              
              {filteredAppointments.map((appointment) => (
                <AppointmentListCard
                  key={appointment.id}
                  {...appointment}
                  onPress={() => handleAppointmentPress(appointment.id)}
                />
              ))}
            </>
          ) : (
            <Card variant="outlined">
              <EmptyState
                icon={<Calendar size={48} color={Colors.textTertiary} />}
                title="No appointments found"
                description={searchQuery ? "Try adjusting your search terms" : "Book your first appointment to get started"}
                actionText="Book Appointment"
                onAction={handleBookAppointment}
                variant="compact"
              />
            </Card>
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
    fontSize: Typography.h1.fontSize,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.caption.fontSize,
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
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sortingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sortingLabel: {
    fontSize: Typography.caption.fontSize,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  sortingButton: {
    padding: Spacing.xs,
  },
  sortingIndicator: {
    width: 20,
    height: 12,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxxl,
  },
  appointmentsList: {
    padding: Spacing.xl,
  },
  monthHeader: {
    fontSize: Typography.h3.fontSize,
    fontFamily: 'Inter-Bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  errorContainer: {
    margin: Spacing.lg,
  },
  errorCard: {
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  errorText: {
    fontSize: Typography.body.fontSize,
    fontFamily: 'Inter-Regular',
    color: Colors.error,
  },
});
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Filter, RefreshCw, FileText } from 'lucide-react-native';
import { PrescriptionListCard } from '@/components/prescriptions/PrescriptionListCard';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { useHealthStore } from '@/store/healthStore';
import { getPrescriptions } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { FilterOption } from '@/types';

const filterOptions: FilterOption[] = ['All', 'Active', 'Expired', 'Low Stock'];

export default function PrescriptionsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();
  const { prescriptions, setPrescriptions, loading, error, setLoading, setError } = useHealthStore();

  useEffect(() => {
    if (user) {
      loadPrescriptions();
    }
  }, [user]);

  const loadPrescriptions = async () => {
    if (user) {
      setLoading('prescriptions', true);
      try {
        const data = await getPrescriptions(user.uid);
        setPrescriptions(data);
      } catch (error) {
        setError('prescriptions', error.message);
      } finally {
        setLoading('prescriptions', false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrescriptions();
    setRefreshing(false);
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesFilter = selectedFilter === 'All' || 
      (selectedFilter === 'Low Stock' && prescription.daysLeft <= 7) ||
      prescription.status.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = prescription.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePrescriptionPress = (prescriptionId: string) => {
    router.push(`/(tabs)/prescriptions/${prescriptionId}`);
  };

  if (loading.prescriptions && !refreshing) {
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
          <Text style={styles.headerTitle}>Prescriptions</Text>
          <Text style={styles.headerSubtitle}>
            {filteredPrescriptions.length} {filteredPrescriptions.length === 1 ? 'prescription' : 'prescriptions'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={22} color={refreshing ? Colors.textTertiary : Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Filter size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Bell size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search prescriptions..."
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
      {error.prescriptions && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.prescriptions}</Text>
        </View>
      )}

      {/* Prescriptions List */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.prescriptionsList}>
          {filteredPrescriptions.length > 0 ? (
            filteredPrescriptions.map((prescription) => (
              <PrescriptionListCard
                key={prescription.id}
                {...prescription}
                onPress={() => handlePrescriptionPress(prescription.id)}
              />
            ))
          ) : (
            <EmptyState
              icon={<FileText size={48} color={Colors.textTertiary} />}
              title="No prescriptions found"
              description={
                searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Your prescriptions from doctors will appear here. Visit a doctor to get your first prescription."
              }
              actionText="Book Appointment"
              onAction={() => router.push('/(tabs)/appointments/book')}
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
  prescriptionsList: {
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
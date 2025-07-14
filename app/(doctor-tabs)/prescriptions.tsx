import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Filter, Plus, Pill, User, Calendar } from 'lucide-react-native';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { getDoctorPrescriptions } from '@/services/firebaseService';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { FilterOption } from '@/types';

const filterOptions: FilterOption[] = ['All', 'Active', 'Expired'];

export default function DoctorPrescriptionsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadPrescriptions();
    }
  }, [user]);

  const loadPrescriptions = async () => {
    if (user) {
      try {
        const data = await getDoctorPrescriptions(user.uid);
        setPrescriptions(data);
      } catch (error) {
        console.error('Error loading prescriptions:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesFilter = selectedFilter === 'All' || 
      prescription.status.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = prescription.medicineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.patientName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return Colors.statusActive;
      case 'expired':
        return Colors.statusExpired;
      default:
        return Colors.textSecondary;
    }
  };

  const handleCreatePrescription = () => {
    // TODO: Implement create prescription functionality
    console.log('Create new prescription');
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
        <Text style={styles.headerTitle}>Prescriptions</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCreatePrescription}>
            <Plus size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Filter size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Bell size={24} color={Colors.textSecondary} />
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
      />

      {/* Prescriptions List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.prescriptionsList}>
          {filteredPrescriptions.length > 0 ? (
            filteredPrescriptions.map((prescription) => (
              <TouchableOpacity
                key={prescription.id}
                style={styles.prescriptionCard}
                onPress={() => {}}
              >
                <View style={styles.prescriptionHeader}>
                  <View style={styles.medicineInfo}>
                    <View style={[
                      styles.medicineIcon,
                      { backgroundColor: prescription.status === 'expired' ? Colors.gray100 : `${Colors.primary}20` }
                    ]}>
                      <Pill size={24} color={prescription.status === 'expired' ? Colors.textSecondary : Colors.primary} />
                    </View>
                    <View style={styles.medicineDetails}>
                      <Text style={styles.medicineName}>{prescription.medicineName}</Text>
                      <Text style={styles.dosage}>{prescription.dosage}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(prescription.status) }
                  ]}>
                    <Text style={styles.statusText}>{prescription.status}</Text>
                  </View>
                </View>

                <View style={styles.patientInfo}>
                  <View style={styles.patientRow}>
                    <User size={16} color={Colors.textSecondary} />
                    <Text style={styles.patientText}>
                      {prescription.patientName || 'Unknown Patient'}
                    </Text>
                  </View>
                  <View style={styles.dateRow}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.dateText}>
                      Prescribed: {prescription.prescribedDate}
                    </Text>
                  </View>
                </View>

                {prescription.instructions && (
                  <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsLabel}>Instructions:</Text>
                    <Text style={styles.instructionsText}>{prescription.instructions}</Text>
                  </View>
                )}

                <View style={styles.prescriptionFooter}>
                  <View style={styles.daysLeftContainer}>
                    {prescription.status === 'active' && (
                      <Text style={[
                        styles.daysLeftText,
                        prescription.daysLeft <= 7 && styles.lowStockText
                      ]}>
                        {prescription.daysLeft} days remaining
                      </Text>
                    )}
                  </View>
                  <View style={styles.prescriptionActions}>
                    <TouchableOpacity style={styles.actionButtonSecondary}>
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButtonPrimary}>
                      <Text style={styles.actionButtonTextPrimary}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <EmptyState
              icon={<Pill size={48} color={Colors.textTertiary} />}
              title="No prescriptions found"
              description={
                searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Prescriptions you create for patients will appear here. Start by creating your first prescription."
              }
              actionText="Create Prescription"
              onAction={handleCreatePrescription}
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
  prescriptionsList: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  prescriptionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  medicineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  medicineIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  dosage: {
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
  patientInfo: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  patientText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textPrimary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dateText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  instructionsContainer: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md,
  },
  instructionsLabel: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  instructionsText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  prescriptionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysLeftContainer: {
    flex: 1,
  },
  daysLeftText: {
    fontSize: FontSizes.sm,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  lowStockText: {
    color: Colors.warning,
  },
  prescriptionActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButtonSecondary: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
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